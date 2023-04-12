import React from 'react';
import style from './Button.module.css';

interface ButtonProps extends Props {
  dragstart: React.DragEventHandler;
}

export default function Button({ children, dragstart }: ButtonProps) {
  return (
    <button draggable="true" className={style.button} onDragStart={dragstart}>
      {children || '占位'}
    </button>
  );
}
