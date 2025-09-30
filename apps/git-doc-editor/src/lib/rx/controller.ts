import { Subject } from "rxjs";
import { useEffect, useState } from "react";

export class RxController {
  protected readonly destroy$ = new Subject<void>();

  mount() {}

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export function useRxController<T extends RxController>(creator: () => T) {
  const [controller] = useState(creator);

  useEffect(() => {
    controller.mount();
    return () => {
      controller.destroy();
    };
  }, [controller]);

  return controller;
}
