import React from 'react';
import { classnames } from '@/utils';
import LoadingIcon from '@/components/LoadingIcon/LoadingIcon';
import styles from './Button.module.css';

type Type = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

type NativeType = 'button' | 'submit' | 'reset';

type Size = 'default' | 'large' | 'small';

interface ButtonProps extends ChildProps {
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
      className={`${buttonClass} ${buttonStyle} ${buttonStatus}`}
      onClick={onClick}
      {...nativeProps}
    >
      {loading ? (
        <LoadingIcon style={{ marginRight: 6 }} size="small" />
      ) : undefined}
      {children}
    </button>
  );
}
