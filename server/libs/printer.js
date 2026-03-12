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

function normalizeText(text) {
  return text
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // curly apostrophes
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // curly quotes
    .replace(/[\u2013\u2014]/g, "-") // em/en dash
    .replace(/\u2026/g, "..."); // ellipsis
}

async function resizeForPrinter(imagePath) {
  const tmpPath = join(tmpdir(), `printer-${Date.now()}.png`);

  let source;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const response = await fetch(imagePath);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    source = Buffer.from(await response.arrayBuffer());
  } else {
    source = imagePath;
  }

  await sharp(source)
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
          job = job.printLine(normalizeText(item.content ?? ""));
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
