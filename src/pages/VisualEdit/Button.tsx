import React from 'react';
import style from './Button.module.css';

interface ButtonProps extends ButtonChildProps {
  dragstart: React.DragEventHandler;
}

export default function Button({ children, dragstart }: Readonly<ButtonProps>) {
  return (
    <button draggable="true" className={style.button} onDragStart={dragstart}>
      {children || '占位'}
    </button>
  );
}
