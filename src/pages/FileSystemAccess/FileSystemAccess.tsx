/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useRef, useEffect } from 'react';
import parsePDF from './pdf/parsePDF';
import style from './FileSystemAccess.module.css';

// --title: 文件系统管理--

export default function FileSystemAccess() {
  const clickHandler = async () => {
    try {
      // @ts-ignore
      const [pdf]: FileSystemFileHandle[] = await window.showOpenFilePicker({
        types: [
          { description: 'pdf 文件', accept: { 'application/pdf': ['.pdf'] } }
        ]
      });

      await parsePDF(await pdf.getFile());
    } catch (err) {
      /* empty */
      console.log(err);
    }
  };

  const clickRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    /*  */
  }, []);

  return (
    <div className={style['file-system-access']}>
      <div className={style.wrapper}>
        <button className="primary" ref={clickRef} onClick={clickHandler}>
          上传 PDF 文件
        </button>
      </div>
    </div>
  );
}
