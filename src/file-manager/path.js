import * as path from "path";
import { promises as fsPromises } from "fs";

export const resolvePath = (currentDir, filePath) => {
  if (!filePath) {
    throw new Error("Path argument is required");
  }

  let newPath;

  if (path.isAbsolute(filePath)) {
    newPath = filePath;
  } else {
    newPath = path.join(currentDir, filePath);
  }
  return path.resolve(newPath);
};

export const pathExists = async (pathname) => {
  try {
    await fsPromises.access(pathname);
    return true;
  } catch (error) {
    return false;
  }
};
