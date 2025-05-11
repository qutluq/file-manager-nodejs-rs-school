export const logError = (message) => {
  const redColorCode = "\x1b[31m";
  const resetColorCode = "\x1b[0m";
  console.error(`${redColorCode}${message}${resetColorCode}`);
};
