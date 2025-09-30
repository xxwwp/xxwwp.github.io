import { BehaviorSubject, catchError, finalize, from, Subject, switchMap, takeUntil, tap } from "rxjs";
import { ImmerBehaviorSubject } from "./Immer-behavior-subject";
import { RxController } from "./controller";

export type IRxAsyncData<T extends (...args: any[]) => Promise<any>> = ImmerBehaviorSubject<
  Awaited<ReturnType<T>> | undefined
>;

export class RxAsync<T extends (...args: any[]) => Promise<any>> extends RxController {
  readonly params$ = new BehaviorSubject<Parameters<T> | undefined>(undefined);
  readonly data$ = new ImmerBehaviorSubject<Awaited<ReturnType<T>> | undefined>(undefined);
  readonly loading$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<Error | undefined>(undefined);
  private trigger$ = new Subject<Parameters<T>>();
  private observable$ = this.setPipeline();
  private subscription$ = this.trigger$.subscribe();

  private fn: T;

  constructor(fn: T) {
    super();
    this.fn = fn;
  }

  private setPipeline() {
    return this.trigger$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((args) =>
        from(this.fn(...args)).pipe(
          tap(() => this.params$.next(args)),
          tap((data) => this.data$.next(data)),
          catchError((error) => {
            this.error$.next(error);
            throw error;
          }),
          finalize(() => this.loading$.next(false)),
          takeUntil(this.destroy$),
        ),
      ),
      takeUntil(this.destroy$),
    );
  }

  public trigger(...args: Parameters<T>) {
    this.subscription$.unsubscribe();
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      this.subscription$ = this.observable$.subscribe({
        next: (data) => resolve(data),
        error: (error) => reject(error),
      });
      this.trigger$.next(args);
    });
  }

  public refresh() {
    return this.trigger(...this.params$.value!);
  }
}
