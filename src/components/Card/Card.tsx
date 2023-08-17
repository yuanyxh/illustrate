import React from 'react';
import { isArray, classnames, composeClass, isRenderElement } from '@/utils';
import style from './Card.module.css';

type ReactElement = React.ReactNode | React.ReactNode[];

type Slots = {
  header(): ReactElement;
  body(): ReactElement;
};

interface CardProps extends Props {
  readonly children: ReactElement | Slots;
  shadow?: 'always' | 'hover' | 'never';
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
}

function isSlots(eles: unknown): eles is Slots {
  return (
    !isArray(eles) &&
    !!(eles as Slots).header &&
    typeof (eles as Slots).header === 'function'
  );
}

const generateClass = classnames(style);

/**
 * @description card 卡片组件
 */
export default function Card(props: CardProps) {
  const {
    children,
    shadow = 'always',
    bodyClassName = '',
    bodyStyle,
    className = '',
    style: _style
  } = props;

  const _isSlots = isSlots(children);
  const header = isRenderElement(_isSlots) && (children as Slots).header?.();
  const body = _isSlots ? children.body() : children;

  const cardClass = generateClass(['card', `is-${shadow}-shadow`]);

  return (
    <div className={composeClass(cardClass, className)} style={_style}>
      {header ? <div className={style['card-header']}>{header}</div> : header}

      <div
        className={composeClass(bodyClassName, style['card-body'])}
        style={bodyStyle}
      >
        {body}
      </div>
    </div>
  );
}
