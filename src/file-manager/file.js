import * as fs from "fs";
import { resolvePath, logError } from "./index.js";
import * as path from "path";

export const catFile = (filePath, currentDir) =>
  new Promise(async (resolve, reject) => {
    try {
      const resolvedPath = resolvePath(currentDir, filePath);
      const isResolvedPathExists = await pathExists(resolvedPath);
      if (!isResolvedPathExists) {
        throw new Error(`File does not exist: ${resolvedPath}`);
      }

      const stats = await fs.promises.stat(resolvedPath);
      if (!stats.isFile()) {
        throw new Error(`Not a file: ${resolvedPath}`);
      }

      const readStream = fs.createReadStream(resolvedPath);

      readStream.pipe(process.stdout);

      readStream.on("end", () => {
        console.log();
        resolve();
      });

      readStream.on("error", (error) => {
        logError("Failed to display file");
        reject(error);
      });
    } catch (error) {
      logError("Failed to display file");
      reject(error);
    }
  });

export const createFile = async (filePath, currentDir) => {
  try {
    const resolvedPath = resolvePath(currentDir, filePath);

    const isResolvedPathExists = await pathExists(resolvedPath);
    if (!isResolvedPathExists) {
      throw new Error(`File already exists: ${resolvedPath}`);
    }

    await fs.promises.writeFile(resolvedPath, "");
    console.log(`File created: ${filePath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to create file: ${error.message}`);
  }
};

export const createDir = async (filePath, currentDir) => {
  try {
    const resolvedPath = resolvePath(currentDir, filePath);

    const isResolvedPathExists = await pathExists(resolvedPath);
    if (!isResolvedPathExists) {
      throw new Error(`File already exists: ${resolvedPath}`);
    }

    await fs.promises.mkdir(resolvedPath, { recursive: true });
    console.log(`Directory created: ${filePath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to create directory: ${error.message}`);
  }
};

export const renameFile = async (oldPath, newPath, currentDir) => {
  try {
    const resolvedOldPath = resolvePath(currentDir, oldPath);
    const resolvedNewPath = resolvePath(currentDir, newPath);

    const isResolvedOldPathExists = await pathExists(resolvedOldPath);
    if (!isResolvedOldPathExists) {
      throw new Error(`Source does not exist: ${oldPath}`);
    }

    const isResolvedNewPathExists = await pathExists(resolvedNewPath);
    if (!isResolvedNewPathExists) {
      throw new Error(`Destination already exists: ${newPath}`);
    }

    await fs.promises.rename(resolvedOldPath, resolvedNewPath);
    console.log(`Renamed: ${oldPath} → ${newPath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to rename: ${error.message}`);
  }
};

export const copyFile = (sourcePath, destPath, currentDir) =>
  new Promise(async (resolve, reject) => {
    try {
      const resolvedSourcePath = resolvePath(currentDir, sourcePath);
      const resolvedDestPath = resolvePath(currentDir, destPath);

      const isResolvedSourcePathExists = await pathExists(resolvedSourcePath);
      if (!isResolvedSourcePathExists) {
        throw new Error(`Source does not exist: ${sourcePath}`);
      }

      const stats = await fs.promises.stat(resolvedSourcePath);

      if (stats.isFile()) {
        const destDir = path.dirname(resolvedDestPath);

        const isDestDirExists = await pathExists(destDir);
        if (!isDestDirExists) {
          await fs.promises.mkdir(destDir, { recursive: true });
        }
        const readStream = fs.createReadStream(resolvedSourcePath);
        const writeStream = fs.createWriteStream(resolvedDestPath);

        readStream.pipe(writeStream);

        writeStream.on("close", () => {
          console.log(`Copied: ${sourcePath} → ${destPath}`);
          resolve();
        });

        writeStream.on("error", (error) => {
          logError("Failed to copy file");
          reject(error);
        });
      } else {
        throw new Error(`Not a file: ${sourcePath}`);
      }
    } catch (error) {
      logError("Failed to copy file");
      reject(error);
    }
  });

export const moveFile = (sourcePath, destPath, currentDir) =>
  new Promise(async (resolve, reject) => {
    try {
      const resolvedSourcePath = resolvePath(currentDir, sourcePath);
      const resolvedDestPath = resolvePath(currentDir, path.join(destPath, sourcePath));
      const isResolvedSourcePathExists = await pathExists(resolvedSourcePath);
      if (!isResolvedSourcePathExists) {
        throw new Error(`Source does not exist: ${sourcePath}`);
      }

      const stats = await fs.promises.stat(resolvedSourcePath);

      if (stats.isFile()) {
        const destDir = path.dirname(resolvedDestPath);
        const isDestDirExists = await pathExists(destDir);
        if (!isDestDirExists) {
          await fs.promises.mkdir(destDir, { recursive: true });
        }

        const readStream = fs.createReadStream(resolvedSourcePath);
        const writeStream = fs.createWriteStream(resolvedDestPath);

        readStream.pipe(writeStream);

        writeStream.on("close", async () => {
          await fs.promises.unlink(resolvedSourcePath);
          console.log(`Moved: ${sourcePath} → ${destPath}`);
          resolve();
        });

        writeStream.on("error", (error) => {
          logError("File moving failed");
          reject(error);
        });

        return;
      } else {
        throw new Error(`Not a file: ${sourcePath}`);
      }
    } catch (error) {
      logError("File moving failed");
      reject(error);
    }
  });

export const deleteFile = async (filePath, currentDir) => {
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

    await fs.promises.unlink(resolvedPath);
    console.log(`Deleted: ${filePath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to delete: ${error.message}`);
  }
};
