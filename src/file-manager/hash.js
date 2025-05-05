import { logError, resolvePath, pathExists } from "./index.js";
import * as fs from "fs";
import * as crypto from "crypto";

export const calculateHash = (filePath, currentDir) =>
  new Promise(async (resolve, reject) => {
    try {
      const resolvedPath = resolvePath(currentDir, filePath);
      const isResolvedPathExists = await pathExists(resolvedPath);
      if (!isResolvedPathExists) {
        throw new Error(`File does not exist: ${filePath}`);
      }

      const stats = await fs.promises.stat(resolvedPath);
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
