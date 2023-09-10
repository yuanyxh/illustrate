import React from 'react';
import { classnames, composeClass, isRenderElement } from '@/utils';
import style from './Progress.module.css';

interface ProgressProps extends ChildProps {
  percentage: number;
  status?: 'success' | 'warning' | 'exception';
  strokeWidth?: number;
  textInside?: boolean;
  color?: string;
  striped?: boolean;
  stripedFlow?: boolean;
  duration?: number;
  format?: (percentage: number) => React.ReactNode;
}

const generateClass = classnames(style);

/**
 * @description 进度条
 */
export default function Progress(props: ProgressProps) {
  const {
    status,
    strokeWidth,
    percentage = 0,
    textInside = false,
    color,
    striped = false,
    stripedFlow = false,
    duration = 3,
    className = '',
    style: _style,
    format,
    ...nativeProps
  } = props;

  const value = (Math.abs(percentage) + 100) % 100;

  const formatValue = format || ((val) => val + '%');

  const showText = formatValue(value);

  const progressClass = generateClass(['progress', `is-${status}`]);

  const progressStyle = generateClass({
    'progress-bar-inner-striped': striped,
    'progress-bar-inner-striped-flow': stripedFlow
  });

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={composeClass(progressClass, className)}
      style={_style}
      {...nativeProps}
    >
      <div className={style['progress-bar']}>
        <div
          className={style['progress-bar-outer']}
          style={{ height: strokeWidth }}
        >
          <div
            className={composeClass(style['progress-bar-inner'], progressStyle)}
            style={{
              width: `${value}%`,
              animationDuration: `${duration}s`,
              backgroundColor: color
            }}
          >
            {isRenderElement(textInside) && (
              <div className={style['progress-bar-inner-text']}>
                <span>{showText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isRenderElement(!textInside) && (
        <div className={style['progress-text']}>
          <span>{showText}</span>
        </div>
      )}
    </div>
  );
}
