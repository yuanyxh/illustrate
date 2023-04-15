import React, { useEffect } from 'react';
import UploadFile from './UploadFile';
import UploadAvatar from './UploadAvatar';
import style from './DragUploadFile.module.css';

// --title: 文件拖拽上传--
// --image: http://qkc148.bvimg.com/18470/da4102580106cca1.png--
// --gif: http://qkc148.bvimg.com/18470/1693fabe581344ca.gif--

const preventDefault = (e: DragEvent) => e.preventDefault();

export default function DragUploadFile() {
  useEffect(() => {
    document.addEventListener('dragover', preventDefault);
    document.addEventListener('drop', preventDefault);

    return () => {
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, []);

  return (
    <div className={style['drag-upload-file']}>
      <div className={style.wrapper}>
        <div className={style.upload}>
          <UploadFile />
        </div>

        <div className={style.upload}>
          <UploadAvatar />
        </div>
      </div>
    </div>
  );
}
