import React from 'react';
import { classnames, composeClass } from '@/utils';
import style from './LoadingIcon.module.css';

interface LoadingIcon extends Props {
  size?: 'default' | 'small' | 'large';
  color?: string;
}

const generateClass = classnames(style);

/**
 * @description 加载图标
 */
export default function LoadingIcon(props: LoadingIcon) {
  const {
    size = 'default',
    color = '#fff',
    className = '',
    style = {}
  } = props;

  const loadingIconClass = generateClass([
    'loading-icon',
    `loading-icon-${size}`
  ]);

  const custom = { '--loading-icon-color': color } as React.CSSProperties;

  return (
    <div
      className={composeClass(loadingIconClass, className)}
      style={Object.assign(custom, style)}
    >
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  );
}
