import { useEffect, useCallback } from 'react';

type Options = { delay?: number; deps?: React.DependencyList };

/**
 *
 * @description 节流 hook
 * @param fn 需要节流的函数
 * @param options options.delay 节流间隔 options.deps: 依赖
 * @returns 返回一个新函数
 */
export const useThrottle = <T extends (...anys: unknown[]) => unknown>(
  fn: T,
  options?: Options
) => {
  const timer = null;

  return ((identify: number | null) => {
    const { delay = 50, deps = [] } = options || {};

    const throttleFn = useCallback((...anys: Parameters<T>) => {
      if (identify) return;

      identify = window.setTimeout(() => {
        fn(...anys);

        identify = null;
      }, delay);
    }, deps);

    useEffect(() => {
      return () => {
        if (identify) window.clearTimeout(identify);
      };
    }, []);

    return throttleFn;
  })(timer);
};
