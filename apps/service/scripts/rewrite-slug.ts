import { readdir, readFile, writeFile } from "node:fs/promises";
import { DOCS_PATH } from "../src/constants";
import { join } from "node:path";
import { parse } from "yaml";

async function main() {
  const files = await readdir(DOCS_PATH);
  const filepaths = files.map(file => join(DOCS_PATH, file));

  files.forEach(async file => {
    const content = await readFile(join(DOCS_PATH, file), "utf-8");
    const newContent = rewriteSlug(content);
    await writeFile(join(DOCS_PATH, file), newContent);
  });
}

function rewriteSlug(content: string) {
  const meta = /^---(.*?)---/s.exec(content)?.[1];
  if (!meta) {
    console.log(content, "没有找到 meta");
    process.exit(1);
  }
  const metaObj = parse(meta);
  const slug = metaObj.slug;

  if (typeof slug !== "string" || !slug.startsWith("/docs/")) {
    console.log(content, "slug 格式不正确");
    process.exit(1);
  }
  return content.replace(slug, `${slug.slice(6)}`);
}

main();
