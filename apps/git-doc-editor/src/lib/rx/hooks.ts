import { BehaviorSubject, distinctUntilChanged, Observable, take } from "rxjs";
import { useEffect, useState } from "react";

export function useBehaviorSubject<T>(subject: BehaviorSubject<T>) {
  const [value, setValue] = useState(subject.value);
  useEffect(() => {
    const subscription = subject.pipe(distinctUntilChanged()).subscribe((value) => {
      setValue(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [subject]);

  return value;
}

export function useObservable<T>(observable: Observable<T>) {
  const [value, setValue] = useState(() => {
    let v: T | undefined;
    observable.pipe(take(1)).subscribe((value) => (v = value));
    return v;
  });

  useEffect(() => {
    const subscription = observable //
      .pipe(distinctUntilChanged())
      .subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}
