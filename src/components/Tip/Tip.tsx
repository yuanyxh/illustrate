import React, { useState, useRef, useEffect } from 'react';
import { useTransition } from '@/hooks';
import { classnames, composeClass, isRenderElement } from '@/utils';
import style from './Tip.module.css';

interface TipSlots {
  header(): React.ReactNode | React.ReactNode[];
  body(): React.ReactNode | React.ReactNode[];
}

interface TipProps extends Props {
  children: TipSlots;
  showClose?: boolean;
  autoClose?: number;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

const generateClass = classnames(style);

export default function Tip(props: TipProps) {
  const {
    children,
    style: _style,
    autoClose,
    type = 'default',
    showClose = false,
    className = '',
    ...nativeProps
  } = props;

  const [show, setShow] = useState(true);
  const [timer, setTimer] = useState(-1);

  const tipRef = useRef<HTMLDivElement>(null);

  useTransition(show, tipRef, { active: '' }, { active: style['tip-leave'] });

  useEffect(() => {
    if (typeof autoClose !== 'number') return;

    const timer = window.setTimeout(() => {
      handleClose();
    }, autoClose);

    setTimer(timer);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const tipClass = generateClass(['tip', `tip-${type}`]);

  const handleClose = () => {
    setShow(false);

    if (timer) {
      window.clearTimeout(timer);
    }
  };

  return (
    <div
      ref={tipRef}
      className={composeClass(tipClass, className)}
      style={_style}
      {...nativeProps}
    >
      <h2 className={style['tip-title']}>{children.header()}</h2>

      <div className={style['tip-desc']}>{children.body()}</div>

      {isRenderElement(showClose) && (
        <button className={style['tip-close']} onClick={handleClose}>
          <i className="iconfont icon-guanbi"></i>
        </button>
      )}
    </div>
  );
}
