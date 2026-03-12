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
}

export function ledOff(pin) {
  if (!isRpi) {
    console.log(`[LED mock] pin ${pin} OFF`);
    return;
  }
  if (processes[pin]) {
    processes[pin].kill();
    delete processes[pin];
  }
  execSync(`gpioset --chip gpiochip0 ${pin}=0`);
}

process.on("SIGINT", () => {
  Object.keys(processes).forEach((pin) => ledOff(pin));
  process.exit();
});
