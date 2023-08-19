import React, { useState } from 'react';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import FileSystemController from './FileSystemController';
import style from './FileSystemAccess.module.css';

// --title: 文件系统管理--

export default function FileSystemAccess() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);

  const openDirectory = () => {
    (async () => {
      const directory = await window.showDirectoryPicker({ mode: 'readwrite' });

      setRoot(directory);
    })();
  };

  return (
    <div className={style['file-system-access']}>
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
  );
}
