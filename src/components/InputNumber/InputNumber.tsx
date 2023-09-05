import React from 'react';
import { isNumber, composeClass, classnames } from '@/utils';
import Input from '@/components/Input/Input';
import style from './InputNumber.module.css';

interface InputNumberProps extends InputProps {
  value: number;
  change: React.Dispatch<React.SetStateAction<number>>;
  size?: 'large' | 'default' | 'small';
  disabled?: boolean;
  step?: number;
  stepStrictly?: boolean;
  precision?: number;
  min?: number;
  max?: number;
}

const generateClass = classnames(style);

export default function InputNumber(props: InputNumberProps) {
  const {
    value,
    change,
    id,
    step = 1,
    min = -window.Infinity,
    max = window.Infinity,
    precision,
    size = 'default',
    disabled
  } = props;

  const _change = (e: string) => {
    if (e.trim() === '') return change(e as unknown as number);

    if (/\d+/.test(e)) {
      let num = window.parseInt(e);

      const distance = num % step;

      if (distance !== 0) {
        num = num + step - distance;
      }

      if (num < min || num > max) return;

      change(
        isNumber(precision) ? Number(num) : Number(num.toFixed(precision))
      );
    }
  };

  const decrease = () => {
    const num = isNumber(value)
      ? value
      : window.parseInt((value as string).trim() === '' ? '0' : value);

    if (num <= min) return;

    change(
      isNumber(precision) ? Number((num - step).toFixed(precision)) : num - step
    );
  };

  const increase = () => {
    const num = isNumber(value)
      ? value
      : window.parseInt((value as string).trim() === '' ? '0' : value);

    if (num >= max) return;

    change(
      isNumber(precision) ? Number((num + step).toFixed(precision)) : num + step
    );
  };

  const inputNumberClass = generateClass([`input-number-${size}`]);
  const inputNumberStyle = generateClass({ 'is-disabled': !!disabled });

  const decreaseStyle = generateClass({ 'is-disabled': +value === min });
  const increaseStyle = generateClass({ 'is-disabled': +value === max });

  return (
    <div
      className={composeClass(
        style['input-number'],
        inputNumberClass,
        inputNumberStyle
      )}
    >
      <span
        role="button"
        aria-label="decrease number"
        className={composeClass(style['input-number-decrease'], decreaseStyle)}
        onClick={decrease}
      >
        <i className="iconfont icon-subtraction"></i>
      </span>

      <span
        role="button"
        aria-label="increase number"
        className={composeClass(style['input-number-increase'], increaseStyle)}
        onClick={increase}
      >
        <i className="iconfont icon-add"></i>
      </span>

      <Input
        id={id}
        value={value.toString()}
        change={_change}
        size={size}
        disabled={disabled}
        className={style['input-number-wrapper']}
      ></Input>
    </div>
  );
}
