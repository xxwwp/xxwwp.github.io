function main() {
  const arg = process.argv[2] || "start";

  require("./scripts/" + arg);
}

main();
