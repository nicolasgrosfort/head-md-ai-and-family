import { SerialPort } from "serialport";
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

export function print(items = []) {
  return new Promise((resolve, reject) => {
    if (!printer || !printerReady) {
      return reject(new Error("Printer not ready"));
    }

    let job = printer;
    for (const item of items) {
      switch (item.type) {
        case "text":
          job = job.printLine(item.content ?? "");
          break;
        case "newline":
          job = job.lineFeed(item.count ?? 1);
          break;
        case "image":
          job = job.printImage(item.path);
          break;
      }
    }
    job.lineFeed(3).print(() => resolve());
  });
}
