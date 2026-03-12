import { execSync, spawn } from "child_process";

const isRpi = (() => {
  try {
    execSync("which gpioset", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

const processes = {};

export function ledOn(pin) {
  if (!isRpi) {
    console.log(`[LED mock] pin ${pin} ON`);
    return;
  }
  if (processes[pin]) processes[pin].kill();
  processes[pin] = spawn("gpioset", ["--chip", "gpiochip0", `${pin}=1`]);
  processes[pin].on("error", (err) =>
    console.error(`LED on error pin ${pin}:`, err),
  );
}

export function ledOff(pin) {
  if (!isRpi) {
    console.log(`[LED mock] pin ${pin} OFF`);
    return;
  }
  if (processes[pin]) processes[pin].kill();
  processes[pin] = spawn("gpioset", ["--chip", "gpiochip0", `${pin}=0`]);
  processes[pin].on("error", (err) =>
    console.error(`LED off error pin ${pin}:`, err),
  );
}

process.on("SIGINT", () => {
  Object.keys(processes).forEach((pin) => {
    if (processes[pin]) processes[pin].kill();
  });
  process.exit();
});
