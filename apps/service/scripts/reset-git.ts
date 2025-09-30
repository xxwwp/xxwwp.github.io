import { spawnSync } from "node:child_process";
import { REPO_CWD } from "../src/constants";
import * as fs from "node:fs/promises";
import * as nPath from "node:path";
import { parse } from "yaml";
import { unionBy } from "lodash";

interface IFilePath {
  type: "file" | "folder";
  path: string;
}

main();

async function main() {
  try {
    const files = await resourceReadFiles();
    const mds = filterMd(files);
    const ids: { path: string; id: string; newId: string }[] = [];
    for (const { path } of mds) {
      ids.push(await parseId(path));
    }

    if (unionBy(ids, "newId").length !== ids.length) {
      console.log("id 重复");
      process.exit(1);
    }

    for (const item of ids) {
      console.log("ppppppppppppppppp ", item.path);
      const referPath = item.path;
      const distPath = nPath.join(REPO_CWD, "docs", `${item.newId}.md`);
      console.log(`${referPath} to ${distPath}`);

      spawnSync("git", ["mv", referPath, distPath], {
        stdio: "inherit",
        cwd: REPO_CWD,
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function removeOtherFiles() {
  const stayFiles = ["docs/", ".git/", ".gitignore"];

  const files = await fs.readdir(REPO_CWD);

  for (const file of files) {
    if (!stayFiles.includes(file)) {
      await fs.rm(nPath.join(REPO_CWD, file), { recursive: true });
    }
  }
}

async function resourceReadFiles(cwd = REPO_CWD) {
  const ignore = [".git"];
  const data: IFilePath[] = [];
  const dirs = [cwd];

  while (dirs.length) {
    const dir = dirs.shift()!;
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = nPath.join(dir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory() && !ignore.includes(file)) {
        dirs.push(filePath);
      } else {
        data.push({ type: "file", path: filePath });
      }
    }
  }

  return data;
}

function filterMd(files: IFilePath[]) {
  return files.filter((file) => file.path.endsWith(".md") && file.type === "file");
}

async function parseId(path: string) {
  const content = await fs.readFile(path, "utf-8");
  const meta = /^---(.*?)---/s.exec(content)?.[1];
  if (!meta) {
    console.log(path, "没有找到 meta");
    process.exit(1);
  }

  try {
    const metaObj = parse(meta);
    return { path, ...metaObj, newId: metaObj.id.slice(0, 8) };
  } catch (error) {
    console.error(error);
    console.error(`${path} 解析失败`);
    process.exit(1);
  }
}
