import { useCallback, useEffect, useRef } from "react";

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
 * @param fn 目标函数
 * @param delay 延迟时间
 */

export function useDebounce(cb, delay) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = { cb, delay };
  });

  return useCallback(debounce(cbRef.current, delay), [delay]);
}
