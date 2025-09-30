import { app } from "@/feature/app/instance";
import { useBehaviorSubject } from "@/lib/rx";
import { Button } from "antd";

export function Repos() {
  const repos = useBehaviorSubject(app.service.repos.data$)?.data;

  return (
    <div>
      <Button onClick={() => app.service.repos.refresh()}>refresh</Button>
      {repos?.map((v) => (
        <div key={v.id} onClick={() => app.repo.next(v)}>
          {v.name}
        </div>
      ))}
    </div>
  );
}
