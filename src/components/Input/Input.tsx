import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { classnames, composeClass, isNumber, isRenderElement } from '@/utils';
import style from './Input.module.css';

export interface InputExpose {
  select(): void;
}

type InputSlots = {
  prefix?(): React.ReactNode | React.ReactNode[];
  suffix?(): React.ReactNode | React.ReactNode[];
};

interface InputProps extends Props {
  change: (val: string) => void;
  focus?:
    | React.FocusEventHandler<HTMLInputElement>
    | React.FocusEventHandler<HTMLTextAreaElement>;

  blur?:
    | React.FocusEventHandler<HTMLInputElement>
    | React.FocusEventHandler<HTMLTextAreaElement>;
  enter?: (val: string) => void;
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
  selectInFocus?: boolean;
  children?: InputSlots;
}

const generateClass = classnames(style);

/**
 * @description input 表单输入
 */
export default forwardRef(function Input(
  props: InputProps,
  ref: React.ForwardedRef<InputExpose>
) {
  const {
    value = '',
    change,
    focus,
    blur,
    enter,
    type = 'text',
    size = 'default',
    resize = true,
    disabled = false,
    autofocus = false,
    tabIndex = 0,
    readonly = false,
    selectInFocus = false,
    name,
    placeholder,
    cols,
    rows,
    maxLength,
    label,
    form,
    children,
    style,
    className = ''
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      select() {
        inputRef.current?.select();
      }
    }),
    []
  );

  const inputClass = generateClass(['input', `input-${size}`]);

  const inputStyle = generateClass({ 'is-disabled': disabled });

  const inputWrapperClass = generateClass(['input-wrapper']);

  const inputInnerClass = generateClass(['input-inner']);

  const textareaClass = generateClass(['textarea']);

  const textareaStyle = generateClass({ 'is-disabled': disabled });

  const textareaInnerClass = generateClass(['textarea-inner']);

  const textareaInnerStyle = generateClass({ 'is-resize': resize });

  const { prefix, suffix } = children || {};

  const clickHandle: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    inputRef.current?.focus();
  };

  const enterHandle: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      enter && enter((e.target as HTMLInputElement).value);
    }
  };

  const input = (
    <div onClick={clickHandle} className={composeClass(inputClass, inputStyle)}>
      <div
        style={style}
        className={composeClass(inputWrapperClass, className)}
        tabIndex={-1}
      >
        {isRenderElement(prefix) && (
          <span className={generateClass(['input-prefix'])}>
            <span className={generateClass(['input-prefix-inner'])}>
              {prefix?.()}
            </span>
          </span>
        )}

        <input
          ref={inputRef}
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
          onFocus={(e) => {
            if (selectInFocus) e.target.select();
            focus && (focus as React.FocusEventHandler<HTMLInputElement>)(e);
          }}
          onBlur={blur as React.FocusEventHandler<HTMLInputElement>}
          onKeyUp={enterHandle}
        />

        {isRenderElement(suffix) && (
          <span className={generateClass(['input-suffix'])}>
            <span className={generateClass(['input-suffix-inner'])}>
              {suffix?.()}
            </span>
          </span>
        )}
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
});
