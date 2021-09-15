import { useCallback, useRef, useState } from "react";

export type ParamsType<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : any;

/**
 * 防抖
 * @param fn 目标函数
 * @param delay 延迟时间
 */
export function debounce<F extends (...args: any) => void>(fn: F, delay = 200) {
  let timer;
  return function (...args: ParamsType<F>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 防抖钩子
 *
 * 防抖钩子使用 hooks 返回一个防抖函数，它不应该作用于副作用中，你应该把它作用到事件或者功能函数上。
 *
 * @param cb 目标函数，该值可以使用 useCallback 生成，以防止性能消耗，如不使用 useCallback 并无使用影响
 * @param delay 延迟时间
 * @returns 返回一个防抖函数
 */
export function useDebounce<F extends (...args: any) => void>(cb: F, delay = 200) {
  // 定时器指针，保证防抖函数的更新不会丢失定时器指针
  const [timer, setTimer] = useState<NodeJS.Timeout>(null);

  // 最新的函数参考，保证后续执行函数时总是使用最新的参数引用，而不是过时的
  const cbRef = useRef(cb);
  cbRef.current = cb;

  return useCallback(
    function (...args: ParamsType<F>) {
      clearTimeout(timer);
      setTimer(setTimeout(() => cbRef.current.apply(this, args), delay));
    },
    [timer, delay]
  );
}
