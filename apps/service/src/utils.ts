import { existsSync, rmSync } from "node:fs";

export function removeDir(dir: string) {
  existsSync(dir) && rmSync(dir, { recursive: true });
}
