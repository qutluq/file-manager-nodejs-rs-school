import * as os from "os";
import * as readline from "readline";
import { parseArgs, generateRandomName, logError } from "./index.js";

let currentDir = os.homedir();
const defaultUsername = generateRandomName();
let username = defaultUsername;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const printCurrentDir = () => {
  console.log(`You are currently in ${currentDir}`);
  rl.prompt();
};

const processCommand = (input) => {
  try {
    if (!input) {
      return;
    }

    if (input === ".exit") {
      exit();
      return;
    }

    const [command, ...args] = input.split(" ");

    switch (command) {
      default:
        logError("Invalid input");
        break;
    }
  } catch (error) {
    logError("Operation failed");
    logError(error.message);
  } finally {
    printCurrentDir();
  }
};

const exit = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  process.exit(0);
};

const start = () => {
  const { username: parsedUsername } = parseArgs();
  username = parsedUsername || defaultUsername;

  console.log(`Welcome to the File Manager, ${username}!`);
  printCurrentDir();

  rl.on("line", (input) => processCommand(input.trim()));
  rl.on("SIGINT", () => exit());
};

start();
