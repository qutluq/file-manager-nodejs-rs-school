import { logError } from "./index.js";

import * as os from "os";

export const getOSInfo = (param) => {
  try {
    switch (param) {
      case "--EOL":
        console.log("End-Of-Line:");
        console.log(JSON.stringify(os.EOL));
        break;
      case "--cpus":
        const cpus = os.cpus();
        console.log(`CPUs: ${cpus.length}`);
        cpus.forEach((cpu, i) => {
          console.log(`CPU ${i + 1}: ${cpu.model} (${cpu.speed / 1000} GHz)`);
        });
        break;
      case "--homedir":
        console.log(`Home Directory: ${os.homedir()}`);
        break;
      case "--username":
        console.log(`System Username: ${os.userInfo().username}`);
        break;
      case "--architecture":
        console.log(`Architecture: ${os.arch()}`);
        break;
      default:
        logError("Invalid parameter. Available parameters:");
        logError("  --EOL, --cpus, --homedir, --username, --architecture");
        break;
    }
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to get OS info: ${error.message}`);
  }
};
