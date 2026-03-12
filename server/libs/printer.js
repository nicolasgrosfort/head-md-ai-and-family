import { unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { SerialPort } from "serialport";
import sharp from "sharp";
import Printer from "thermalprinter";

const serialPort = new SerialPort({
  path: "/dev/ttyAMA0",
  baudRate: 19200,
});

let printer = null;
let printerReady = false;

serialPort.on("open", () => {
  printer = new Printer(serialPort);
  printer.on("ready", () => {
    printerReady = true;
    console.log("Printer ready");
  });
  printer.on("error", (err) => console.error("Erreur imprimante:", err));
});

serialPort.on("error", (err) => console.error("Erreur port série:", err));

async function resizeForPrinter(imagePath) {
  const tmpPath = join(tmpdir(), `printer-${Date.now()}.png`);
  await sharp(imagePath)
    .resize({ width: 384, withoutEnlargement: true })
    .png()
    .toFile(tmpPath);
  return {
    path: tmpPath,
    cleanup: () => {
      try {
        unlinkSync(tmpPath);
      } catch {}
    },
  };
}

export async function print(items = []) {
  if (!printer || !printerReady) {
    throw new Error("Printer not ready");
  }

  // Pre-process: resize images ahead of time (async)
  const processedItems = await Promise.all(
    items.map(async (item) => {
      if (item.type === "image") {
        const resized = await resizeForPrinter(item.path);
        return { ...item, _resized: resized };
      }
      return item;
    }),
  );

  return new Promise((resolve) => {
    let job = printer;
    for (const item of processedItems) {
      switch (item.type) {
        case "text":
          if (item.bold) job = job.bold(true);
          job = job.printLine(item.content ?? "");
          if (item.bold) job = job.bold(false);
          break;
        case "newline":
          job = job.lineFeed(item.count ?? 1);
          break;
        case "image":
          job = job.printImage(item._resized.path);
          break;
      }
    }
    job.lineFeed(3).print(() => {
      processedItems.forEach((item) => item._resized?.cleanup());
      resolve();
    });
  });
}
