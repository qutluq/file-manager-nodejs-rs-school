import { logError, resolvePath } from "./index.js";
import * as fs from "fs";
import * as crypto from "crypto";

export const calculateHash = (filePath, currentDir) =>
  new Promise((resolve, reject) => {
    try {
      const resolvedPath = resolvePath(currentDir, filePath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File does not exist: ${filePath}`);
      }

      const stats = fs.statSync(resolvedPath);
      if (!stats.isFile()) {
        throw new Error(`Not a file: ${filePath}`);
      }

      const readStream = fs.createReadStream(resolvedPath);
      const hash = crypto.createHash("sha256");

      readStream.on("data", (data) => {
        hash.update(data);
      });

      readStream.on("close", () => {
        resolve(hash.digest("hex"));
      });

      readStream.on("error", (error) => {
        logError("Hash calculation failed");
        reject(error);
      });
    } catch (error) {
      logError("Hash calculation failed");
      reject(error);
    }
  });
