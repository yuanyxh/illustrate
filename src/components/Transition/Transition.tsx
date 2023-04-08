import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';

interface TransitionProps {
  visible: boolean;
  children: React.ReactElement;
  enterClass?: {
    from: string;
    active: string;
    to: string;
  };
  leaveClass?: {
    from: string;
    active: string;
    to: string;
  };
}

const defaultClass = { from: '', active: '', to: '' };

const getClass = (...values: string[]) => {
  let curr;
  const classNames: string[] = [];

  while ((curr = values.shift())) {
    classNames.push(curr);
  }

  return classNames;
};

export default function Transition({
  children,
  visible,
  enterClass = defaultClass,
  leaveClass = defaultClass
}: TransitionProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [leave, setLeave] = useState(visible);

  const alias = wrapper.current;

  useLayoutEffect(() => {
    /* enter-from */
    if (visible && alias) {
      alias.classList.add(...getClass(enterClass.from));
    }

    /* leave-from */
    if (!visible && alias) {
      alias.classList.add(...getClass(leaveClass.from));
    }
  }, [visible]);

  useEffect(() => {
    /* enter-active and enter-to */
    if (visible && alias) {
      alias.classList.remove(...getClass(enterClass.from));
      alias.classList.add(...getClass(enterClass.active, enterClass.to));
    }

    /* leave-active and leave-to */
    if (!visible && alias) {
      alias.classList.remove(...getClass(leaveClass.from));
      alias.classList.add(...getClass(leaveClass.active, leaveClass.to));
    }
  }, [visible]);

  useEffect(() => {
    const end = () => setLeave((leave) => !leave);

    wrapper.current?.addEventListener('transitionend', end);

    return () => wrapper.current?.removeEventListener('transitionend', end);
  }, []);

  return (
    <div ref={wrapper} className={visible ? leaveClass.from : enterClass.from}>
      {(visible || leave) && children}
    </div>
  );
}
