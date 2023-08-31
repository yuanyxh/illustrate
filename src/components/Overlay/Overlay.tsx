import React, { forwardRef } from 'react';
import { composeClass, createConsistentClick } from '@/utils';
import style from './Overlay.module.css';

interface OverlayProps extends ChildProps {
  mask?: boolean;
  onClick?: () => unknown;
}

/**
 * @description 遮罩层
 */
export default forwardRef(function Overlay(
  props: OverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    mask = true,
    onClick,
    children,
    className = '',
    style: _style,
    ...nativeProps
  } = props;

  const {
    onMouseDown,
    onMouseUp,
    onClick: click
  } = createConsistentClick(() => onClick && onClick());

  return (
    <div
      ref={ref}
      className={composeClass(mask ? style['overlay'] : '', className)}
      style={_style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={click}
      {...nativeProps}
    >
      {children}
    </div>
  );
});
