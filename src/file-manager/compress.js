import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { promises as fsPromises } from "fs";

import { logError, resolvePath, pathExists } from "./index.js";

export const compressFile = (sourcePath, destPath, currentDir) =>
  new Promise(async (resolve, reject) => {
    try {
      const resolvedSourcePath = resolvePath(currentDir, sourcePath);
      const resolvedDestPath = resolvePath(currentDir, destPath);

      const isResolvedSourcePathExists = await pathExists(resolvedSourcePath);
      if (!isResolvedSourcePathExists) {
        throw new Error(`Source does not exist: ${sourcePath}`);
      }

      const stats = await fs.promises.stat(resolvedSourcePath);
      if (!stats.isFile()) {
        throw new Error(`Not a file: ${sourcePath}`);
      }

      const destDir = path.dirname(resolvedDestPath);
      const isDestDirExists = await pathExists(destDir);
      if (!isDestDirExists) {
        await fsPromises.mkdir(destDir, { recursive: true });
      }

      const readStream = fs.createReadStream(resolvedSourcePath);
      const writeStream = fs.createWriteStream(resolvedDestPath);
      const brotliCompress = zlib.createBrotliCompress();

      const pipeline = readStream.pipe(brotliCompress).pipe(writeStream);

      pipeline.on("close", () => {
        console.log(`Compressed: ${sourcePath} → ${destPath}`);
        resolve();
      });

      pipeline.on("error", (error) => {
        console.log("File compressing failed");
        reject(error);
      });
    } catch (error) {
      console.log("File compressing failed");
      reject(error);
    }
  });

export const decompressFile = (sourcePath, destPath, currentDir) =>
  new Promise(async (resolve, reject) => {
    try {
      const resolvedSourcePath = resolvePath(currentDir, sourcePath);
      const resolvedDestPath = resolvePath(currentDir, destPath);

      const isResolvedSourcePathExists = await pathExists(resolvedSourcePath);
      if (!isResolvedSourcePathExists) {
        throw new Error(`Source does not exist: ${sourcePath}`);
      }

      const stats = await fs.promises.stat(resolvedSourcePath);
      if (!stats.isFile()) {
        throw new Error(`Not a file: ${sourcePath}`);
      }

      const destDir = path.dirname(resolvedDestPath);
      const isDestDirExists = await pathExists(destDir);
      if (!isDestDirExists) {
        await fsPromises.mkdir(destDir, { recursive: true });
      }

      const readStream = fs.createReadStream(resolvedSourcePath);
      const writeStream = fs.createWriteStream(resolvedDestPath);
      const brotliDecompress = zlib.createBrotliDecompress();

      const pipeline = readStream.pipe(brotliDecompress).pipe(writeStream);

      pipeline.on("close", () => {
        console.log(`Decompressed: ${sourcePath} → ${destPath}`);
        resolve();
      });

      pipeline.on("error", (error) => {
        logError("File decompressing failed");
        reject(error);
      });
    } catch (error) {
      logError("File decompressing failed");
      reject(error);
    }
  });
