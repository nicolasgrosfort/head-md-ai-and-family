import { SerialPort } from "serialport";
import Printer from "thermalprinter";

const serialPort = new SerialPort({
  path: "/dev/ttyAMA0",
  baudRate: 19200,
});

serialPort.on("open", () => {
  const printer = new Printer(serialPort);

  printer.on("ready", () => {
    printer
      .bold(true)
      .printLine("Hello depuis Node.js!")
      .horizontalLine(16)
      .bold(false)
      .printLine("Ligne normale")
      .lineFeed(3)
      .print(() => {
        console.log("Impression terminée");
        process.exit();
      });
  });

  printer.on("error", (err) => console.error("Erreur imprimante:", err));
});

serialPort.on("error", (err) => console.error("Erreur port série:", err));
