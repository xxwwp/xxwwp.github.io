import { OctokitApi } from "@/lib/octokit-api";
import { RxAsync } from "@/lib/rx";

export class Service extends OctokitApi {
  readonly repos = new RxAsync(() => {
    return this.request("GET /user/repos");
  });

  readonly branches = new RxAsync((owner: string, repo: string) => {
    return this.request("GET /repos/{owner}/{repo}/branches", {
      owner,
      repo,
    });
  });

  readonly contents = new RxAsync((owner: string, repo: string, ref = "", path = "") => {
    return this.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      ref,
    });
  });
}
