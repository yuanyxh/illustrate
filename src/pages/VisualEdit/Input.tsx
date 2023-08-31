import React from 'react';
import style from './Input.module.css';

interface _InputProps extends InputProps {
  dragstart: React.DragEventHandler;
}

export default function Input({ dragstart }: Readonly<_InputProps>) {
  return (
    <input draggable="true" className={style.input} onDragStart={dragstart} />
  );
}
