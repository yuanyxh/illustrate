import React, { useRef } from 'react';
import { useModel } from '@/hooks';
import { classnames } from '@/utils';
import Upload from '@/components/Upload/Upload';
import Button from '@/components/Button/Button';
import type { UploadFile, TransformResponse } from '@/components/Upload/types';
import style from './UploadFile.module.css';

interface UploadResult {
  message: string;
  status: number;
  result: { name: string; link: string };
}

// --title: 文件上传--

const generateClass = classnames(style);

export default function UploadFile() {
  const filesModel = useModel<UploadFile[]>([]);

  const transformResponse: TransformResponse = (res: UploadResult) => {
    return {
      name: res.result.name,
      url: res.result.link
    };
  };

  return (
    <div className={style['upload-file']}>
      <Upload
        {...filesModel}
        action={'http://127.0.0.1:8362/upload'}
        transformResponse={transformResponse}
      >
        <Button type="primary">click into upload</Button>
      </Upload>
    </div>
  );
}
