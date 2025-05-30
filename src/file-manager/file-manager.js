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
  calculateHash,
  compressFile,
  decompressFile,
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
        currentDir = await changeDirectory(targetDir, currentDir);
        break;
      case "ls":
        await listDirectory(currentDir);
        break;

      // File operations
      case "cat":
        await catFile(args.join(" "), currentDir);
        break;
      case "add":
        await createFile(args.join(" "), currentDir);
        break;
      case "mkdir":
        await createDir(args.join(" "), currentDir);
        break;
      case "rn":
        if (args.length !== 2) {
          console.log("Invalid input: requires source and destination");
          break;
        }
        await renameFile(args[0], args[1], currentDir);
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
        await deleteFile(args.join(" "), currentDir);
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

      // Hash calculation
      case "hash":
        const filePath = args.join(" ");
        const fileHash = await calculateHash(filePath, currentDir);
        console.log(fileHash);
        break;

      // Compress/decompress operations
      case "compress":
        if (args.length !== 2) {
          logError("Invalid input: requires source and destination");
          break;
        }
        await compressFile(args[0], args[1], currentDir);
        break;

      case "decompress":
        if (args.length !== 2) {
          logError("Invalid input: requires source and destination");
          break;
        }
        await decompressFile(args[0], args[1], currentDir);
        break;

      default:
        logError("Invalid input");
        break;
    }
  } catch (error) {
    logError("Operation failed");
    logError(error.message);
  } finally {
    console.log(); //this is intentional to add empty line
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
