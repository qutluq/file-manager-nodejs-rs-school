import * as os from "os";
import * as readline from "readline";
import {
  parseArgs,
  generateRandomName,
  logError,
  goUp,
  changeDirectory,
  listDirectory,
  catFile,
  createFile,
  createDir,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
  getOSInfo,
} from "./index.js";

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

const processCommand = async (input) => {
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
      // Navigation operations
      case "up":
        currentDir = goUp(currentDir);
        break;
      case "cd":
        const targetDir = args.join(" ");
        currentDir = changeDirectory(targetDir, currentDir);
        break;
      case "ls":
        listDirectory(currentDir);
        break;

      // File operations
      case "cat":
        await catFile(args.join(" "), currentDir);
        break;
      case "add":
        createFile(args.join(" "), currentDir);
        break;
      case "mkdir":
        createDir(args.join(" "), currentDir);
        break;
      case "rn":
        if (args.length !== 2) {
          console.log("Invalid input: requires source and destination");
          break;
        }
        renameFile(args[0], args[1], currentDir);
        break;
      case "cp":
        if (args.length !== 2) {
          console.log("Invalid input: requires source and destination");
          break;
        }
        await copyFile(args[0], args[1], currentDir);
        break;
      case "mv":
        if (args.length !== 2) {
          console.log("Invalid input: requires source and destination");
          break;
        }
        await moveFile(args[0], args[1], currentDir);
        break;
      case "rm":
        deleteFile(args.join(" "), currentDir);
        break;

      // OS operations
      case "os":
        if (args.length !== 1) {
          logError("One of following arguments required:");
          logError("  --EOL, --cpus, --homedir, --username, --architecture");

          break;
        }
        getOSInfo(args[0]);
        break;

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
  ``;
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
