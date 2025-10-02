import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { rmSync } from "node:fs";
import * as nPath from "node:path";

const tempDir = "./temp";
const siteDir = "../apps/site-temp/src/content";

main();

function main() {
  try {
    copyDirSync(nPath.join(tempDir), siteDir);
    console.log("copy success");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function copyDirSync(src: string, dest: string) {
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true });
  }

  mkdirSync(dest, { recursive: true });

  if (!existsSync(src)) {
    throw new Error(`${src} not exists`);
  }

  const files = readdirSync(src);
  for (const file of files) {
    const stats = statSync(nPath.join(src, file));
    if (stats.isDirectory()) {
      copyDirSync(nPath.join(src, file), nPath.join(dest, file));
    } else {
      copyFileSync(nPath.join(src, file), nPath.join(dest, file));
    }
  }
}
