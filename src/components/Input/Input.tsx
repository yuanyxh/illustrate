import React from 'react';
import { classnames, composeClass, isNumber } from '@/utils';
import style from './Input.module.css';

interface InputProps extends Props {
  change: (val: string) => void;
  focus?:
    | React.FocusEventHandler<HTMLInputElement>
    | React.FocusEventHandler<HTMLTextAreaElement>;

  blur?:
    | React.FocusEventHandler<HTMLInputElement>
    | React.FocusEventHandler<HTMLTextAreaElement>;
  value: string;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  size?: 'default' | 'large' | 'small';
  readonly?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  maxLength?: number;
  resize?: boolean;
  tabIndex?: number;
  label?: string;
  form?: string;
  autofocus?: boolean;
}

const generateClass = classnames(style);

export default function Input(props: InputProps) {
  const {
    value = '',
    change,
    focus,
    blur,
    type = 'text',
    size = 'default',
    resize = true,
    disabled = false,
    autofocus = false,
    tabIndex = 0,
    readonly = false,
    name,
    placeholder,
    cols,
    rows,
    maxLength,
    label,
    form,
    style,
    className = ''
  } = props;

  const inputClass = generateClass(['input', `input-${size}`]);

  const inputStyle = generateClass({ 'is-disabled': disabled });

  const inputWrapperClass = generateClass(['input-wrapper']);

  const inputInnerClass = generateClass(['input-inner']);

  const textareaClass = generateClass(['textarea']);

  const textareaStyle = generateClass({ 'is-disabled': disabled });

  const textareaInnerClass = generateClass(['textarea-inner']);

  const textareaInnerStyle = generateClass({ 'is-resize': resize });

  const input = (
    <div className={composeClass(inputClass, inputStyle)}>
      <div
        style={style}
        className={composeClass(inputWrapperClass, className)}
        tabIndex={-1}
      >
        <input
          className={inputInnerClass}
          type={type}
          name={name}
          value={value}
          form={form}
          tabIndex={tabIndex}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={label}
          autoFocus={autofocus}
          readOnly={readonly}
          onChange={(e) => {
            if (isNumber(maxLength)) {
              return value.length < maxLength && change(e.target.value);
            }
            change(e.target.value);
          }}
          onFocus={focus as React.FocusEventHandler<HTMLInputElement>}
          onBlur={blur as React.FocusEventHandler<HTMLInputElement>}
        />
      </div>
    </div>
  );

  const textarea = (
    <div className={composeClass(textareaClass, textareaStyle)}>
      <textarea
        className={composeClass(
          textareaInnerClass,
          textareaInnerStyle,
          className
        )}
        style={style}
        form={form}
        name={name}
        readOnly={readonly}
        aria-label={label}
        cols={cols}
        rows={rows}
        tabIndex={tabIndex}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autofocus}
        value={value}
        onChange={(e) => {
          if (isNumber(maxLength)) {
            return value.length < maxLength && change(e.target.value);
          }
          change(e.target.value);
        }}
        onFocus={focus as React.FocusEventHandler<HTMLTextAreaElement>}
        onBlur={blur as React.FocusEventHandler<HTMLTextAreaElement>}
      ></textarea>
    </div>
  );

  return <>{type === 'textarea' ? textarea : input}</>;
}
