import type { Octokit } from "octokit";

export type IRepo = Awaited<ReturnType<typeof Octokit.prototype.request<"GET /user/repos">>>["data"][number];
