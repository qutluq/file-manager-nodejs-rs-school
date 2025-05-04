import * as fs from "fs";
import { resolvePath, logError } from "./index.js";
import * as path from "path";

export const catFile = (filePath, currentDir) =>
  new Promise((resolve, reject) => {
    try {
      const resolvedPath = resolvePath(currentDir, filePath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File does not exist: ${resolvedPath}`);
      }

      const stats = fs.statSync(resolvedPath);
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

export const createFile = (filePath, currentDir) => {
  try {
    const resolvedPath = resolvePath(currentDir, filePath);

    if (fs.existsSync(resolvedPath)) {
      throw new Error(`File already exists: ${resolvedPath}`);
    }

    fs.writeFileSync(resolvedPath, "");
    console.log(`File created: ${filePath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to create file: ${error.message}`);
  }
};

export const createDir = (filePath, currentDir) => {
  try {
    const resolvedPath = resolvePath(currentDir, filePath);

    if (fs.existsSync(resolvedPath)) {
      throw new Error(`File already exists: ${resolvedPath}`);
    }

    fs.mkdirSync(resolvedPath, { recursive: true });
    console.log(`Directory created: ${filePath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to create directory: ${error.message}`);
  }
};

export const renameFile = (oldPath, newPath, currentDir) => {
  try {
    const resolvedOldPath = resolvePath(currentDir, oldPath);
    const resolvedNewPath = resolvePath(currentDir, newPath);

    if (!fs.existsSync(resolvedOldPath)) {
      throw new Error(`Source does not exist: ${oldPath}`);
    }

    if (fs.existsSync(resolvedNewPath)) {
      throw new Error(`Destination already exists: ${newPath}`);
    }

    fs.renameSync(resolvedOldPath, resolvedNewPath);
    console.log(`Renamed: ${oldPath} → ${newPath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to rename: ${error.message}`);
  }
};

export const copyFile = (sourcePath, destPath, currentDir) =>
  new Promise((resolve, reject) => {
    try {
      const resolvedSourcePath = resolvePath(currentDir, sourcePath);
      const resolvedDestPath = resolvePath(currentDir, destPath);

      if (!fs.existsSync(resolvedSourcePath)) {
        throw new Error(`Source does not exist: ${sourcePath}`);
      }

      const stats = fs.statSync(resolvedSourcePath);

      if (stats.isFile()) {
        const destDir = path.dirname(resolvedDestPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
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
  new Promise((resolve, reject) => {
    try {
      const resolvedSourcePath = resolvePath(currentDir, sourcePath);
      const resolvedDestPath = resolvePath(currentDir, path.join(destPath, sourcePath));

      if (!fs.existsSync(resolvedSourcePath)) {
        throw new Error(`Source does not exist: ${sourcePath}`);
      }

      const stats = fs.statSync(resolvedSourcePath);

      if (stats.isFile()) {
        const destDir = path.dirname(resolvedDestPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        const readStream = fs.createReadStream(resolvedSourcePath);
        const writeStream = fs.createWriteStream(resolvedDestPath);

        readStream.pipe(writeStream);

        writeStream.on("close", () => {
          fs.unlinkSync(resolvedSourcePath);
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

export const deleteFile = (filePath, currentDir) => {
  try {
    const resolvedPath = resolvePath(currentDir, filePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }

    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      throw new Error(`Not a file: ${filePath}`);
    }

    fs.unlinkSync(resolvedPath);
    console.log(`Deleted: ${filePath}`);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to delete: ${error.message}`);
  }
};
