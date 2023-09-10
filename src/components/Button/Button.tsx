import React from 'react';
import { classnames, composeClass, isRenderElement } from '@/utils';
import LoadingIcon from '@/components/LoadingIcon/LoadingIcon';
import styles from './Button.module.css';

type Type = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

type NativeType = 'button' | 'submit' | 'reset';

type Size = 'default' | 'large' | 'small';

interface ButtonProps extends ButtonChildProps {
  type?: Type;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: boolean;
  block?: boolean;
  loading?: boolean;
  link?: boolean;
  size?: Size;
  nativeType?: NativeType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const generateClass = classnames(styles);

/**
 * @description 基础组件 button
 */
export default function Button(props: Readonly<ButtonProps>) {
  const {
    children,
    type = 'default',
    size = 'default',
    plain = false,
    round = false,
    circle = false,
    loading = false,
    disabled = loading,
    block = false,
    link = false,
    nativeType = 'button',
    className = '',
    onClick,
    ...nativeProps
  } = props;

  const buttonClass = generateClass([
    'button',
    `button-${type}`,
    `button-${size}`
  ]);

  const buttonStyle = generateClass({
    'is-plain': plain,
    'is-round': round,
    'is-circle': circle,
    'is-link': link,
    'is-block': block
  });

  const buttonStatus = generateClass({
    'is-disabled': disabled,
    'is-loading': loading
  });

  return (
    <button
      type={nativeType}
      className={composeClass(
        buttonClass,
        buttonStyle,
        buttonStatus,
        className
      )}
      style={nativeProps.style}
      onClick={onClick}
      {...nativeProps}
    >
      {isRenderElement(loading) && (
        <LoadingIcon style={{ marginRight: 6 }} size="small" />
      )}
      {children}
    </button>
  );
}
