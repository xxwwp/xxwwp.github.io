import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

const branch = "temp";
const repo = "git@github.com:xxwwp/xxwwp.github.io.git";
const tempDir = "./temp";

function main() {
  try {
    removeDirSync(tempDir);

    spawnSync(
      "git",
      ["clone", "-b", branch, "--single-branch", repo, tempDir],
      {
        stdio: "inherit",
        cwd: process.cwd(),
      },
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function removeDirSync(dir: string) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true });
  }
}

main();
