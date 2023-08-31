import React from 'react';
import { classnames, composeClass, isUndef, isBoolean } from '@/utils';
import style from './Switch.module.css';

const generateClass = classnames(style);

interface SwitchProps<T = boolean> extends Props {
  value: T;
  change: React.Dispatch<React.SetStateAction<T>>;
  id?: string;
  size?: 'large' | 'default' | 'small';
  disabled?: boolean;
  inactiveValue?: T extends undefined ? string | boolean | number : T;
  activeValue?: T extends undefined ? string | boolean | number : T;
}

export default function Switch<T>(props: SwitchProps<T>) {
  const {
    value,
    change,
    activeValue,
    inactiveValue,
    id,
    disabled,
    size = 'default'
  } = props;

  const switchClass = generateClass(['switch', `switch-${size}`]);

  const switchStyle = generateClass({
    'is-checked': value === activeValue,
    'is-disabled': !!disabled
  });

  const handleCheck = () => {
    if (disabled) return;

    if (isBoolean(value)) {
      change((prev) => !prev as T);
    } else if (!(isUndef(activeValue) || isUndef(inactiveValue))) {
      value === activeValue
        ? change(inactiveValue as T)
        : change(activeValue as T);
    }
  };

  return (
    <div className={composeClass(switchClass, switchStyle)}>
      <input
        id={id}
        className={style['switch-input']}
        type="checkbox"
        role="switch"
      />

      <span className={style['switch-core']} onClick={handleCheck}>
        <div className={style['switch-action']}></div>
      </span>
    </div>
  );
}
