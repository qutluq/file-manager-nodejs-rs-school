export const parseArgs = () => {
  const args = process.argv.slice(2);

  const parsedArgs = {};

  for (let i = 0; i < args.length; i += 2) {
    const keyValuePair = args[i].slice(2).split("=");
    const propName = keyValuePair[0];
    const value = keyValuePair[1];

    parsedArgs[propName] = value;
  }

  return parsedArgs;
};
