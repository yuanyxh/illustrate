import React, { useState } from 'react';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import MessageBox from '@/components/MessageBox/MessageBox';
import ScreenBoundary from '@/components/ScreenBoundary/ScreenBoundary';
import ExtraInformation from '@/components/ExtraInformation/ExtraInformation';
import FileSystemController from './FileSystemController';
import style from './FileSystemAccess.module.css';

// --title: 文件系统管理--

export default function FileSystemAccess() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);

  const openDirectory = () => {
    (async () => {
      if (typeof window.showDirectoryPicker === 'function') {
        const directory = await window.showDirectoryPicker({
          mode: 'readwrite'
        });

        setRoot(directory);
      } else {
        MessageBox.alert({
          type: 'warning',
          title: '获取目录失败',
          message:
            '当前浏览器暂不支持 window.showDirectoryPicker 方法，请使用最新浏览器或前往 MDN 查看浏览器支持性。'
        });
      }
    })();
  };

  return (
    <ScreenBoundary>
      <div className={style['file-system-access']}>
        <ExtraInformation
          platform={{
            blog: {
              title: '利用 FileSystem API 实现一个 web 端的残缺版文件管理器',
              url: 'https://yuanyxh.com/posts/produce/%E5%88%A9%E7%94%A8%20FileSystem%20API%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%20web%20%E7%AB%AF%E7%9A%84%E6%AE%8B%E7%BC%BA%E7%89%88%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%99%A8.html'
            },
            juejin: { url: 'https://juejin.cn/post/7269013062676512808' },
            zhihu: { url: 'https://zhuanlan.zhihu.com/p/651144415' },
            csdn: {
              url: 'https://blog.csdn.net/yuanfgbb/article/details/132398476?spm=1001.2014.3001.5502'
            }
          }}
        />

        <Card shadow="never">
          <Button
            className="openDirectory"
            type="primary"
            onClick={openDirectory}
          >
            打开新文件夹
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={() => setRoot(null)}>
            关闭当前文件夹
          </Button>

          <FileSystemController
            root={root}
            style={{ marginTop: 30 }}
          ></FileSystemController>
        </Card>
      </div>
    </ScreenBoundary>
  );
}
