import { BehaviorSubject } from "rxjs";
import { Service } from "@/feature/service";
import type { IRepo } from "@/feature/model/octokit";

export class App {
  readonly auth = new BehaviorSubject<string | undefined>(undefined);
  readonly service = new Service(this.auth);

  readonly repo = new BehaviorSubject<IRepo | undefined>(undefined);
  readonly path = new BehaviorSubject<string>("");

  async init(auth: string) {
    this.service.setAuth(auth);
  }
}
