import { readdir, readFile, stat, writeFile } from "fs/promises";
import { REPO_CWD } from "../src/constants";
import { join } from "path";

main();

async function main() {
  const files = await readdir(join(REPO_CWD, "docs"));
  console.log(files);

  const tasks: { file: string; id: string }[] = [];

  for (const file of files) {
    if (!(await stat(join(REPO_CWD, "docs", file))).isFile()) continue;

    const content = await readFile(join(REPO_CWD, "docs", file), "utf-8");
    const meta = /^---(.*?)---/s.exec(content)?.[1];
    if (!meta) {
      console.log(file, "没有找到 meta");
      process.exit(1);
    }

    const id = /id: (.*?)\s/s.exec(meta)?.[1];
    if (!id) {
      console.log(file, "没有找到 id");
      process.exit(1);
    }
    tasks.push({ file, id });
  }

  for (const { file, id } of tasks) {
    const content = await readFile(join(REPO_CWD, "docs", file), "utf-8");
    const newContent = content.replace(id, id.slice(0, 8));
    await writeFile(join(REPO_CWD, "docs", file), newContent);
    console.log(file, "id 重置成功");
  }
}
