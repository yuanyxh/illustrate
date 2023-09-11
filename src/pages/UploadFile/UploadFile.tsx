import React from 'react';
import { useModel } from '@/hooks';
import Upload from '@/components/Upload/Upload';
import Button from '@/components/Button/Button';
import Text from '@/components/Text/Text';
import Card from '@/components/Card/Card';
import ExtraInformation from '@/components/ExtraInformation/ExtraInformation';
import UploadList from './UploadList';
import UploadImage from './UploadImage';
import type { UploadFile, TransformResponse } from '@/components/Upload/types';
import style from './UploadFile.module.css';

interface UploadResult {
  message: string;
  status: number;
  result: { name: string; link: string };
}

// --title: 文件上传--

// const generateClass = classnames(style);

export default function UploadFile() {
  const filesModel = useModel<UploadFile[]>([]);
  const dragFilesModel = useModel<UploadFile[]>([]);
  const imageFilesModel = useModel<UploadFile[]>([]);

  const maxSize = 1024 * 1024 * 5;

  const transformResponse: TransformResponse = (res: UploadResult) => {
    return {
      name: res.result.name,
      url: res.result.link
    };
  };

  return (
    <div className={style['upload-file']}>
      <ExtraInformation
        platform={{
          blog: {
            title: 'upload 组件封装',
            url: 'https://yuanyxh.com/posts/produce/upload%20%E7%BB%84%E4%BB%B6%E5%B0%81%E8%A3%85.html'
          },
          juejin: { url: 'https://juejin.cn/post/7228565447946928188' },
          zhihu: { url: 'https://zhuanlan.zhihu.com/p/626339323' },
          csdn: {
            url: 'https://blog.csdn.net/yuanfgbb/article/details/132398327?spm=1001.2014.3001.5502'
          }
        }}
      />

      <Text block style={{ marginBottom: 15 }} type="info" size="large">
        文件上传涉及服务器，本页仅用于调试，可 clone{' '}
        <a
          href="https://github.com/yuanyxh/services"
          rel="noreferrer"
          target="_blank"
        >
          <Button
            style={{
              fontSize: 'var(--font-size-extra-large)',
              verticalAlign: 'revert'
            }}
            link
            type="primary"
          >
            web-server
          </Button>
        </a>{' '}
        以启动本地服务器
      </Text>

      <Card className={style['upload-card']} shadow="never">
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
                  上传文件不大于5MB
                </Text>
              );
            }
          }}
        </Upload>

        <UploadList files={filesModel.value}></UploadList>
      </Card>

      <Card className={style['upload-card']} shadow="never">
        <Upload
          {...dragFilesModel}
          drag
          action={'http://127.0.0.1:8362/upload'}
          transformResponse={transformResponse}
          beforeUpload={(file) => file.size < maxSize}
          style={{ width: '100%' }}
        >
          <section className={style['upload-drag']}>
            <p>
              Drop file here or{' '}
              <Text type="primary" size="large">
                click to upload
              </Text>
            </p>

            <p>
              <Text type="info">The maximum upload of 5MB file</Text>
            </p>
          </section>
        </Upload>

        <UploadList files={dragFilesModel.value}></UploadList>
      </Card>

      <Card className={style['upload-card']} shadow="never">
        <Upload
          {...imageFilesModel}
          action={'http://127.0.0.1:8362/upload'}
          accept={['.jpg', '.png']}
          transformResponse={transformResponse}
          beforeUpload={(file) => file.size < maxSize}
        >
          {{
            default() {
              return <UploadImage></UploadImage>;
            },
            tips() {
              return (
                <Text type="info">
                  upload png、jpg pictures, no more than 5MB
                </Text>
              );
            }
          }}
        </Upload>

        <UploadList
          type="image-list"
          files={imageFilesModel.value}
        ></UploadList>
      </Card>
    </div>
  );
}
