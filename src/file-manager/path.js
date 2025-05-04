import * as path from "path";

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
