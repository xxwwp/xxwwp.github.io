import { spawnSync } from "node:child_process";
import { removeDir } from "../src/utils";
import { REPO_CWD, REPO_URL } from "../src/constants";
import inquirer from "inquirer";

main();

async function main() {
  try {
    const res = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "确定执行该命令吗？这将删除 .repo 目录",
      },
    ]);
    if (!res.confirm) {
      process.exit(0);
    }

    removeDir(REPO_CWD);

    spawnSync("git", ["clone", REPO_URL, REPO_CWD], {
      stdio: "inherit",
    });

    spawnSync("git", ["checkout", "-b", "temp"], {
      stdio: "inherit",
      cwd: REPO_CWD,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
