import { produce, type Producer } from "immer";
import { BehaviorSubject } from "rxjs";

export class ImmerBehaviorSubject<T> extends BehaviorSubject<T> {
  produce(fn: Producer<T>) {
    this.next(produce(this.value, fn));
  }
}
