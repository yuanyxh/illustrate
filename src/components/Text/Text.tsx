import React from 'react';
import { classnames, composeClass } from '@/utils';
import style from './Text.module.css';

interface TextProps extends ChildProps {
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'default' | 'small' | 'large';
  block?: boolean;
  truncated?: boolean;
}

const generateClass = classnames(style);

/**
 * @description 文本
 */
export default function Text(props: TextProps) {
  const {
    children,
    className = '',
    style,
    type = 'default',
    size = 'default',
    block = false,
    truncated = false
  } = props;

  const textType = generateClass(['text', `text-${type}`, `text-${size}`]);

  const textStyle = generateClass({
    'is-block': block,
    'is-truncated': truncated
  });

  return (
    <span
      className={composeClass(textType, textStyle, className)}
      style={style}
    >
      {children}
    </span>
  );
}
