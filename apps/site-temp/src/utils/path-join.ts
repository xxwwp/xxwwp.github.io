/**
 * 路径拼接
 *
 * @param paths
 * @param join 拼接符
 * @returns
 */
export function pathJoin(paths: string[]): string {
  const first = paths[0].replace(/^\//, "");

  const rest = paths
    .slice(1)
    .filter(path => path !== "")
    .map(path => path.replace(/\/$/, "").replace(/^\//, ""))
    .join("/");

  return [first, rest].join("/");
}
