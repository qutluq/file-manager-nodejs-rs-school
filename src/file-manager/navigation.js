import * as path from "path";
import * as fs from "fs";

import { logError, resolvePath } from "./index.js";

const isRootDirectory = (dir) => {
  const parsedDir = path.parse(dir);

  return parsedDir.root === dir;
};

const isRootDirectoryOrChild = (dir) => {
  if (!dir) return false;

  const rootDir = path.parse(dir).root;

  return (
    dir.toLowerCase() === rootDir.toLowerCase() ||
    dir.toLowerCase().startsWith(rootDir.toLowerCase())
  );
};

export const goUp = (currentDir) => {
  try {
    if (isRootDirectory(currentDir)) {
      logError("You can't go upper than root directory");
      return currentDir;
    }

    return path.dirname(currentDir);
  } catch (error) {
    logError("Operation failed");
    logError(error.message);
  }

  return currentDir;
};

export const changeDirectory = (targetPath, currentDir) => {
  let newPath = currentDir;

  try {
    if (!targetPath) {
      throw new Error("Path argument is required");
    }

    newPath = resolvePath(currentDir, targetPath);

    if (!fs.existsSync(newPath)) {
      throw new Error(`Directory does not exist: ${newPath}`);
    }

    const stats = fs.statSync(newPath);
    if (!stats.isDirectory()) {
      throw new Error(`Not a directory: ${newPath}`);
    }

    // Make sure the new path is not above the root directory
    if (!isRootDirectoryOrChild(newPath)) {
      logError("You can't go upper than root directory");

      return currentDir;
    }
  } catch (error) {
    logError("Operation failed");
    logError(error.message);
    return currentDir;
  }

  return newPath;
};

export const listDirectory = (currentDir) => {
  try {
    const files = fs.readdirSync(currentDir);

    const fileDetails = files.map((file) => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);

      return {
        Name: file,
        Type: stats.isDirectory() ? "directory" : "file",
      };
    });

    fileDetails.sort((a, b) => {
      if (a.Type === "directory" && b.Type !== "directory") return -1;
      if (a.Type !== "directory" && b.Type === "directory") return 1;
      return a.Name.localeCompare(b.Name);
    });

    console.table(fileDetails);
  } catch (error) {
    logError("Operation failed");
    logError(`Failed to read directory: ${error.message}`);
  }
};
