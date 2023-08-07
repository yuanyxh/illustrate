import React from 'react';
import { isArray, classnames, composeClass } from '@/utils';
import style from './Card.module.css';

type ReactElement = React.ReactNode | React.ReactNode[];

type Slots = {
  header(): ReactElement;
  body(): ReactElement;
};

interface CardProps extends Props {
  readonly children: ReactElement | Slots;
  shadow?: 'always' | 'hover' | 'never';
}

function isSlots(eles: unknown): eles is Slots {
  return (
    !isArray(eles) &&
    !!(eles as Slots).header &&
    typeof (eles as Slots).header === 'function'
  );
}

const generateClass = classnames(style);

export default function Card(props: CardProps) {
  const { children, shadow = 'always', className = '', style: _style } = props;

  const _isSlots = isSlots(children);
  const header = _isSlots ? children.header() : undefined;
  const body = _isSlots ? children.body() : children;

  const cardClass = generateClass(['card', `is-${shadow}-shadow`]);

  return (
    <div className={composeClass(cardClass, className)} style={_style}>
      {header ? <div className={style['card-header']}>{header}</div> : header}

      <div className={style['card-body']}>{body}</div>
    </div>
  );
}
