import { Octokit } from "octokit";
import { distinctUntilChanged, type BehaviorSubject } from "rxjs";

export class OctokitApi {
  private _octokit: Octokit | undefined;

  setAuth = (auth: string | undefined) => {
    this._octokit = new Octokit({ auth });
  };

  constructor(private readonly auth: BehaviorSubject<string | undefined>) {
    this.auth.pipe(distinctUntilChanged()).subscribe((auth) => {
      this.setAuth(auth);
    });
  }

  get octokit() {
    if (this._octokit === undefined) throw new Error("you need to set auth first");
    return this._octokit;
  }

  readonly request = ((url, options) => {
    if (!options) return this.octokit.request(url);
    return this.octokit.request(url, {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      ...options,
    });
  }) as (typeof Octokit.prototype)["request"];
}
