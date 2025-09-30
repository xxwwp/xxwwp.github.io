import { useBehaviorSubject } from "@/lib/rx";
import { Button, Input } from "antd";
import { BehaviorSubject } from "rxjs";

export default function ViewInputRepo(props: { $value?: BehaviorSubject<string>; onSubmit: (value: string) => void }) {
  const { $value = new BehaviorSubject(""), onSubmit } = props;
  const value = useBehaviorSubject($value);

  return (
    <div>
      <Input value={value} onChange={(e) => $value.next(e.target.value)} />
      <Button htmlType="button" onClick={() => onSubmit(value)}>
        拉取仓库
      </Button>
    </div>
  );
}
