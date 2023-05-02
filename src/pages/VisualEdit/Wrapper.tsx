import React from 'react';
import style from './Wrapper.module.css';

interface HeaderProps extends Props {
  dragstart: React.DragEventHandler;
}

export default function Header({ dragstart }: Readonly<HeaderProps>) {
  return (
    <div
      draggable="true"
      className={style.wrapper}
      onDragStart={dragstart}
    ></div>
  );
}
