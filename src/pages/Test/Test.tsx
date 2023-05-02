import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Upload } from 'antd';
import { usePosition } from '@/hooks';
import { classnames } from '@/utils';
import style from './Test.module.css';
import type { UploadProps } from 'antd';

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

  const props: UploadProps = {
    action: 'http://localhost:8362/upload',
    accept: '.pdf',
    fileList: [],
    onChange(info) {
      console.log(info);
      return info;
    }
  };

  return (
    <>
      <div className={style.test}>
        <Upload {...props}>
          <button>clickMe</button>
        </Upload>

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
