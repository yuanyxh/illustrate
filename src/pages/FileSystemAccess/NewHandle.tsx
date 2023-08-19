import React, { useEffect } from 'react';
import { New } from './config';
import { useModel } from '@/hooks';
import { composeClass } from '@/utils';
import { resolveName, isValidFileName, getIconName } from './utils';
import Input from '@/components/Input/Input';
import type { CreateHandle, DirectoryChildren, EntityHandle } from './types';
import style from './NewHandle.module.css';

interface NewHandleProps extends Props {
  item: CreateHandle;
  currentDirectory: FileSystemDirectoryHandle | null | undefined;
  directoryList: DirectoryChildren[];
  setDirectoryList: React.Dispatch<React.SetStateAction<DirectoryChildren[]>>;
  select: EntityHandle[];
  setSelect: React.Dispatch<React.SetStateAction<EntityHandle[]>>;
}

export default function NewHandle(props: NewHandleProps) {
  const { item, currentDirectory, directoryList, setDirectoryList, setSelect } =
    props;

  const { value, change } = useModel('');

  useEffect(() => {
    const hasCreate = directoryList.find((item) => item.type === 'create');

    if (hasCreate) {
      change(
        resolveName(
          directoryList,
          hasCreate.name === 'directory' ? New.DIRECTORY : New.FILE
        )
      );

      setSelect([]);
    }
  }, [directoryList]);

  const isCreateDirectory = item.name === 'directory';

  let name = value;

  const createHandle = () => {
    if (!currentDirectory) return;

    if (!name.trim()) {
      name = isCreateDirectory ? New.DIRECTORY : New.FILE;
    }

    name = resolveName(directoryList, name);

    const i = directoryList.findIndex((curr) => item === curr);

    const isSome = directoryList.find(
      (item, index) => index !== i && item.name === name
    );

    if (isSome) {
      return;
    }

    (async () => {
      const handle = await currentDirectory[
        isCreateDirectory ? 'getDirectoryHandle' : 'getFileHandle'
      ](name, { create: true });

      directoryList[i] = {
        name: name,
        type: isCreateDirectory ? 'directory' : 'file',
        handle: handle
      } as DirectoryChildren;

      setDirectoryList([...directoryList]);
    })();

    change('');
  };

  return (
    <div
      className={style['new-handle']}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <i className={composeClass('iconfont', getIconName(item))}></i>

      <div className={style['item-name']}>
        <Input
          value={value}
          change={(e) => {
            isValidFileName(e) && change(e);
          }}
          autofocus
          selectInFocus
          size="small"
          blur={() => createHandle()}
          enter={() => createHandle()}
        ></Input>
      </div>
    </div>
  );
}
