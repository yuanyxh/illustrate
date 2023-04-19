import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePosition } from '@/hooks';
import { classnames } from '@/utils';
import style from './Test.module.css';

// --title: 测试页面--

const generateClass = classnames(style);

export default function Test() {
  const clickMe = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);

  const rect = usePosition(clickMe);

  const modal = generateClass({ modal: true, show });

  const showModal = () => {
    setShow(true);
  };

  return (
    <>
      <div className={style.test}>
        <button ref={clickMe} className={style.button} onClick={showModal}>
          click me
        </button>

        {createPortal(
          <div className={modal} style={rect}></div>,
          document.body
        )}
      </div>
    </>
  );
}
