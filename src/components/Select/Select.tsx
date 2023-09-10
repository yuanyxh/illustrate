/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useTransition } from '@/hooks';
import { classnames } from '@/utils';
import Input from '@/components/Input/Input';
import style from './Select.module.css';

const generateClass = classnames(style);

interface Options {
  label: string;
  value: any;
}

interface SelectProps extends Props {
  options: Options[];
  value: any;
  change: React.Dispatch<React.SetStateAction<any>>;
  id?: string;
  size?: 'large' | 'default' | 'small';
  placeholder?: string;
}

const enter: TransitionClass = {
  active: 'zoom-in-active'
};

const leave: TransitionClass = {
  active: 'zoom-out-active'
};

export default function Select(props: SelectProps) {
  const {
    value: modelValue,
    change,
    options,
    id,
    size = 'default',
    placeholder = 'Select'
  } = props;

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFoucs, setIsFoucs] = useState(false);

  useTransition(isFoucs, selectRef, enter, leave);

  const label = useMemo(
    () => options.find((item) => item.value === modelValue),
    [modelValue]
  );

  useEffect(() => {
    window.addEventListener('click', otherClick);

    return () => {
      window.removeEventListener('click', otherClick);
    };
  }, []);

  const selectClass = generateClass(['select', `select-${size}`]);

  const otherClick = () => {
    setIsFoucs(false);
  };

  const handleClick = () => {
    if (isFoucs) {
      setIsFoucs(false);
      inputRef.current?.blur();
    } else {
      setIsFoucs(true);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={selectClass}>
      <Input
        ref={inputRef}
        id={id}
        className={style['select-input']}
        value={label?.label || ''}
        placeholder={placeholder}
        change={() => {
          /*  */
        }}
        onClick={(e) => {
          e.stopPropagation();

          handleClick();
        }}
      >
        {{
          suffix() {
            return (
              <i
                className={`iconfont icon-arrow-down ${style['select-icon']}`}
              ></i>
            );
          }
        }}
      </Input>

      <div ref={selectRef} className={style['select-options']}>
        {options.map(({ label, value }) => (
          <div
            key={label}
            className={generateClass(
              { selected: value === modelValue },
              style['select-options-item']
            )}
            onClick={(e) => {
              e.stopPropagation();

              change(value);

              setIsFoucs(false);
            }}
          >
            <span> {label} </span>
          </div>
        ))}
      </div>
    </div>
  );
}
