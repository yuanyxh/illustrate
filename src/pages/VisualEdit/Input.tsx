import React from 'react';
import style from './Input.module.css';

interface InputProps extends Props {
  dragstart: React.DragEventHandler;
}

export default function Input({ dragstart }: InputProps) {
  return (
    <input draggable="true" className={style.input} onDragStart={dragstart} />
  );
}
