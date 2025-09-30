import { useRxController } from "@/lib/rx";
import { RxController } from "@/lib/rx";
import { message } from "antd";
import { BehaviorSubject } from "rxjs";
import { Service } from "@/feature/toc/service";
import { lazy } from "react";

export class EditController extends RxController {
  readonly auth = new BehaviorSubject<string | undefined>(undefined);
  readonly service = new Service(this.auth);
  readonly content$ = new BehaviorSubject<string>("");

  init(auth: string) {
    this.auth.next(auth);

    try {
      this.service.repos.trigger();
    } catch (error) {
      message.error("拉取仓库失败");
      throw error;
    }
  }
}

const views = new Map([["input-repo", lazy(() => import("./components/view-input-repo"))]]);

export default function Edit() {
  const edit = useRxController(() => new EditController());
  const ViewInputRepo = views.get("input-repo")!;

  return (
    <div>
      <ViewInputRepo onSubmit={edit.init} />
      {/* 选择 repo */}
    </div>
  );
}
