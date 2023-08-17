/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { composeClass, forEach, isRenderElement } from '@/utils';
import { addDirectory, isCreate } from './utils';
import Card from '@/components/Card/Card';
import Text from '@/components/Text/Text';
import Header from './Header';
import Body from './Body';
import Location from './Location';
import type {
  DirectoryChildren,
  DirectoryHandle,
  FileHandle,
  NodeType,
  DisplayType
} from './types';
import style from './FileSystemController.module.css';

interface FileSystemControllerProps extends Props {
  root?: FileSystemDirectoryHandle | null;
  canCrateRootDirectory?: boolean;
}

// const generateClass = classnames(style);

export default function FileSystemController(props: FileSystemControllerProps) {
  const { root, canCrateRootDirectory = false, ...nativeProps } = props;

  const [currentDirectory, setCurrentDirectroy] = useState<
    FileSystemDirectoryHandle | null | undefined
  >(root);

  const [directoryList, setDirectoryList] = useState<DirectoryChildren[]>([]);
  const [select, setSelect] = useState<DirectoryChildren[]>([]);
  const [display, setDisplay] = useState<DisplayType>('list');

  useEffect(() => {
    if (!root) return;

    setCurrentDirectroy(root);
  }, [root]);

  useEffect(() => {
    if (!currentDirectory) return;

    setSelect([]);

    (async () => {
      const AsyncIterator = currentDirectory.entries();

      const directorys: DirectoryHandle[] = [];
      const files: FileHandle[] = [];

      for await (const [key, value] of AsyncIterator) {
        if (value.kind === 'directory') {
          directorys.push({ type: 'directory', name: key, handle: value });
        } else if (value.kind === 'file') {
          files.push({ type: 'file', name: key, handle: value });
        }
      }

      setDirectoryList([...directorys, ...files]);
    })();
  }, [currentDirectory]);

  const remove = () => {
    if (!currentDirectory) return;

    forEach(select, async (handle) => {
      if (isCreate(handle)) return;

      const name = handle.name;
      const i = directoryList.findIndex((curr) => curr === handle);

      if (i < 0) return;

      await currentDirectory.removeEntry(name, { recursive: true });

      directoryList.splice(i, 1);

      setDirectoryList([...directoryList]);
    });
  };

  const nodeClick = (type: NodeType) => {
    switch (type) {
      case 'create':
        setDirectoryList(addDirectory(directoryList));

        break;

      case 'remove':
        remove();

        break;
      case 'list':
        setDisplay(type);

        break;
      case 'thumbnail':
        setDisplay(type);

        break;

      default:
        break;
    }
  };

  return (
    <Card
      bodyStyle={{ padding: 0, paddingBottom: 15 }}
      className={composeClass(
        style['file-system-controller'],
        nativeProps.className || ''
      )}
      style={Object.assign(
        { position: 'relative', userSelect: 'none' },
        nativeProps.style || {}
      )}
    >
      {{
        header() {
          return (
            <Header nodeClick={nodeClick} select={select} display={display} />
          );
        },
        body() {
          return (
            <>
              <section className={style['file-system-controller-body']}>
                <Location
                  root={root}
                  currentDirectory={currentDirectory}
                  setCurrentDirectroy={setCurrentDirectroy}
                />

                <Body
                  root={root}
                  currentDirectory={currentDirectory}
                  setCurrentDirectroy={setCurrentDirectroy}
                  directoryList={directoryList}
                  setDirectoryList={setDirectoryList}
                  select={select}
                  setSelect={setSelect}
                  display={display}
                />
              </section>

              {isRenderElement(!canCrateRootDirectory && !root) && (
                <div className={style['locked']}>
                  <i
                    className="iconfont icon-lock"
                    style={{ fontSize: 60, marginBottom: 8 }}
                  ></i>

                  <Text type="info">请先选择本地文件</Text>
                </div>
              )}
            </>
          );
        }
      }}
    </Card>
  );
}
