import React, { forwardRef } from 'react';
import { classnames, composeClass, isNumber, isRenderElement } from '@/utils';
import style from './Input.module.css';

type Props = InputProps & TextAreaProps;

export interface InputExpose {
  select(): void;
}

interface InputSlots {
  prefix?(): React.ReactNode | React.ReactNode[];
  suffix?(): React.ReactNode | React.ReactNode[];
}

interface _InputProps extends Props {
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
  id?: string;
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
  props: _InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
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
    id,
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
    className = '',
    ...nativeProps
  } = props;

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
  };

  const enterHandle: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      enter && enter((e.target as HTMLInputElement).value);
    }
  };

  const input = (
    <div className={composeClass(inputClass, inputStyle)}>
      <div
        style={style}
        className={composeClass(inputWrapperClass, className)}
        tabIndex={-1}
        onClick={clickHandle}
      >
        {isRenderElement(prefix) && (
          <span className={generateClass(['input-prefix'])}>
            <span className={generateClass(['input-prefix-inner'])}>
              {prefix?.()}
            </span>
          </span>
        )}

        <input
          ref={ref}
          id={id}
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
          {...nativeProps}
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
        id={id}
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
        {...nativeProps}
      ></textarea>
    </div>
  );

  return <>{type === 'textarea' ? textarea : input}</>;
});
