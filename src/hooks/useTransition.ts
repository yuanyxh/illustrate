import { useState, useLayoutEffect, useEffect } from 'react';
import { createPort, forEach } from '@/utils';

const getClass = (
  arg: TransitionClass | undefined,
  ...states: (keyof TransitionClass)[]
) => {
  if (arg == null) return '';

  const result: string[] = [];

  forEach(states, (val) => {
    result.push(arg[val] || '');
  });

  return result.join(' ').trim();
};

/**
 *
 * @param state 外部控制状态
 * @param ref 过渡元素
 * @returns 延迟状态
 */
export const useTransition = <T extends HTMLElement>(
  state: boolean,
  ref: React.RefObject<T>,
  enter?: TransitionClass,
  leave?: TransitionClass
) => {
  const [show, setShow] = useState(state);

  const port = createPort(ref);

  useLayoutEffect(() => {
    if (state === show) return;

    port.exec((ele) => {
      port.show();

      const from = getClass(state ? enter : leave, 'from');

      from && ele.classList.add(from);
    });
  }, [state]);

  useEffect(() => {
    if (state === show) return;

    port.exec((ele) => {
      const from = getClass(state ? enter : leave, 'from');
      const active = getClass(state ? enter : leave, 'active', 'to');

      from && ele.classList.remove(from);

      const values = (active || '').split(' ');

      values.length && ele.classList.add(...values);
    });
  }, [state]);

  useEffect(() => {
    const end = () => {
      port.exec((ele) => {
        ele.classList.remove(
          ...getClass(enter, 'active', 'from', 'to').split(' ')
        );
        ele.classList.remove(
          ...getClass(leave, 'active', 'from', 'to').split(' ')
        );

        state ? port.show() : port.hide();
      });

      if (state === show) return;

      setShow(() => state);
    };

    port.on('transitionend', end);
    port.on('animationend', end);

    return () => {
      port.off('transitionend', end);
      port.off('animationend', end);
    };
  }, [state]);

  return show;
};
