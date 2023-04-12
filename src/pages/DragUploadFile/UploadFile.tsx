import React, { useRef, useState } from 'react';
import { classnames } from '@/utils';
import style from './UploadFile.module.css';

// --title: 文件拖拽上传--

const generateClass = classnames(style);

export default function UploadFile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<File[]>([]);

  const drop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const { files } = e.dataTransfer;

    const temp = [];
    for (let i = 0; i < files.length; i++) {
      temp.push(files[i]);
    }

    setFileList(temp);
  };

  const change: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (!files || !files.length) return;

    const temp = [];
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      temp.push(files[i]);
    }

    setFileList(temp);
    e.target.value = '';
  };

  return (
    <>
      <h3 className={style.title}>文件拖拽上传</h3>
      <div
        className={generateClass({
          'drop-file': true,
          'has-file': !!fileList.length
        })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={drop}
        onClick={() => fileRef.current?.click()}
      >
        {fileList.length
          ? fileList.map((file, i) => (
              <div
                key={i}
                className={style['file-item']}
                onClick={(e) => e.stopPropagation()}
              >
                <span>{file.name}</span>
                <span>{file.size + ' bit'}</span>
              </div>
            ))
          : '拖拽文件至此处'}
      </div>
      <input
        ref={fileRef}
        style={{ display: 'none' }}
        type="file"
        multiple
        onChange={change}
      />
    </>
  );
}
