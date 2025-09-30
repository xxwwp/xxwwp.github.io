import { join, resolve } from "node:path";

export const REPO_URL = "git@github.com:xxwwp/xxwwp.github.io.git";

export const REPO_CWD = resolve(process.cwd(), ".repo");

export const DOCS_PATH = join(REPO_CWD, "docs");
