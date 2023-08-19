import React, {
  useRef,
  useState,
  useEffect,
  createContext,
  useMemo
} from 'react';
import { CatalogConfig } from './config';
import { composeClass, forEach, isRenderElement } from '@/utils';
import {
  addDirectory,
  FileSystemHistory,
  FileSystemClipboard,
  move,
  getParent
} from './utils';
import Card from '@/components/Card/Card';
import Text from '@/components/Text/Text';
import Header from './Header';
import Body from './Body';
import Location from './Location';
import Catalog from './Catalog';
import type {
  DirectoryChildren,
  EntityHandle,
  DirectoryHandle,
  FileHandle,
  NodeType,
  DisplayType,
  FileSystemContext
} from './types';
import style from './FileSystemController.module.css';

interface FileSystemControllerProps extends Props {
  root?: FileSystemDirectoryHandle | null;
  canCrateRootDirectory?: boolean;
}

// const generateClass = classnames(style);

export const ControllerContext = createContext<FileSystemContext>({
  history: null,
  clipboard: null
});

export default function FileSystemController(props: FileSystemControllerProps) {
  const { root, canCrateRootDirectory = false, ...nativeProps } = props;

  const [currentDirectory, setCurrentDirectroy] = useState<
    FileSystemDirectoryHandle | null | undefined
  >(root);

  const [directoryList, setDirectoryList] = useState<DirectoryChildren[]>([]);
  const [select, setSelect] = useState<EntityHandle[]>([]);
  const [clipList, setClipList] = useState<EntityHandle[]>([]);
  const [display, setDisplay] = useState<DisplayType>('list');
  const [show, setShow] = useState(false);
  const [catalogConf, setCatalogConf] = useState(CatalogConfig.copy);

  const bodyRef = useRef<HTMLInputElement>(null);

  const history = useMemo(() => root && new FileSystemHistory(root), [root]);
  const clipboard = useMemo(() => new FileSystemClipboard(setClipList), []);

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
  }, [currentDirectory, clipList]);

  const remove = async () => {
    if (!currentDirectory) return;

    let handle: EntityHandle | undefined;

    while ((handle = select.shift())) {
      const name = handle.name;
      const i = directoryList.findIndex((curr) => curr === handle);

      if (i < 0) return;

      await currentDirectory.removeEntry(name, { recursive: true });

      directoryList.splice(i, 1);
    }

    setSelect([]);
    setDirectoryList([...directoryList]);
  };

  const onClipboard = (type: 'copy' | 'cut' | 'paste') => {
    if (type === 'copy') {
      clipboard.copy(select);
    }

    if (type === 'cut') {
      clipboard.cut(select);
    }

    if (type === 'paste') {
      onPaste();
    }
  };

  const onPaste = () => {
    if (!root || !currentDirectory) return;

    let count = 0;
    const { datatransfer, state } = clipboard;

    const update = () => {
      count--;
      count === 0 && clipboard.paste();
    };

    forEach(datatransfer, async (value) => {
      if (state === 'copy') {
        count++;
        move(currentDirectory, value).finally(update);
      } else {
        const parent = await getParent(root, value);

        if (parent) {
          count++;
          move(currentDirectory, value, {
            discard: true,
            origin: parent
          }).finally(update);
        }
      }
    });
  };

  const nodeClick = (type: NodeType) => {
    switch (type) {
      case 'copy':
        clipboard.copy(select);
        break;

      case 'cut':
        clipboard.cut(select);
        break;
      case 'create':
        setDirectoryList(addDirectory(directoryList));

        break;
      case 'paste':
        onPaste();

        break;

      case 'move-to':
        setShow(true);

        setCatalogConf(CatalogConfig.move);
        break;

      case 'copy-to':
        setShow(true);

        setCatalogConf(CatalogConfig.copy);
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
    <>
      <ControllerContext.Provider
        value={{ history: history as FileSystemHistory, clipboard }}
      >
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
          onClick={() => bodyRef.current?.focus()}
        >
          {{
            header() {
              return (
                <Header
                  nodeClick={nodeClick}
                  select={select}
                  display={display}
                />
              );
            },
            body() {
              return (
                <>
                  <section className={style['file-system-controller-body']}>
                    <Location
                      root={root}
                      directoryList={directoryList}
                      currentDirectory={currentDirectory}
                      setCurrentDirectroy={setCurrentDirectroy}
                    />

                    <Body
                      ref={bodyRef}
                      root={root}
                      currentDirectory={currentDirectory}
                      setCurrentDirectroy={setCurrentDirectroy}
                      directoryList={directoryList}
                      setDirectoryList={setDirectoryList}
                      select={select}
                      setSelect={setSelect}
                      display={display}
                      onClipboard={onClipboard}
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
      </ControllerContext.Provider>

      <Catalog show={show} change={setShow} config={catalogConf}></Catalog>
    </>
  );
}
