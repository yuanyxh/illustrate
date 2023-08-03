/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useCallback } from 'react';
import { isNumber } from '@/utils';

type Options = { delay?: number; deps?: React.DependencyList };

/**
 *
 * @description 节流 hook
 * @param fn 需要防抖的函数
 * @param options options.delay 防抖间隔 options.deps: 依赖
 * @returns 返回一个新函数
 */
export const useDebounce = <T extends (...anys: any[]) => any>(
  fn: T,
  options?: Options
) => {
  const timer = null;

  return ((identify: number | null) => {
    const { delay = 400, deps = [] } = options || {};

    const debounceFn = useCallback((...anys: Parameters<T>) => {
      if (isNumber(identify)) window.clearTimeout(identify);

      identify = window.setTimeout(() => {
        fn.apply(this, anys);

        identify = null;
      }, delay);
    }, deps);

    useEffect(() => {
      return () => {
        if (isNumber(identify)) window.clearTimeout(identify);
      };
    }, []);

    return debounceFn;
  })(timer);
};
