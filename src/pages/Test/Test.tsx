import React from 'react';
import { useModel } from '@/hooks';
import Upload from '@/components/Upload/Upload';
import Button from '@/components/Button/Button';
import Text from '@/components/Text/Text';
import type { UploadFile, TransformResponse } from '@/components/Upload/types';
import style from './Test.module.css';

// --title: 测试页面--

interface UploadResult {
  message: string;
  status: number;
  result: { name: string; link: string };
}

export default function Test() {
  const filesModel = useModel<UploadFile[]>([]);

  const maxSize = 1024 * 1024 * 500;

  const transformResponse: TransformResponse = (res: UploadResult) => {
    return {
      name: res.result.name,
      url: res.result.link
    };
  };

  return (
    <div className={style['test']}>
      <Upload
        {...filesModel}
        action={'http://127.0.0.1:8362/upload'}
        transformResponse={transformResponse}
        beforeUpload={(file) => file.size < maxSize}
      >
        {{
          default() {
            return <Button type="primary">click into upload</Button>;
          },
          tips() {
            return (
              <Text type="info" size="small">
                上传文件不大于500mb
              </Text>
            );
          }
        }}
      </Upload>
    </div>
  );
}
