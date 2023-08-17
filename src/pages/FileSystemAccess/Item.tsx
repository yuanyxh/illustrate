import React from 'react';
import { classnames, composeClass } from '@/utils';
import { getIconName } from './utils';
import Text from '@/components/Text/Text';
import type {
  DirectoryChildren,
  DirectoryHandle,
  FileHandle,
  DisplayType
} from './types';
import style from './Item.module.css';

interface ItemProps extends Props {
  item: DirectoryHandle | FileHandle;
  select: DirectoryChildren[];
  isSelect: boolean;
  display: DisplayType;
  setSelect: React.Dispatch<React.SetStateAction<DirectoryChildren[]>>;
  onEnter(item: DirectoryHandle | FileHandle): void;
}

const generateClass = classnames(style);

export const itemStyle = style;

export default function Item(props: ItemProps) {
  const { item, isSelect, display, setSelect, onEnter } = props;

  // const { value, change } = useModel('');

  // TODO: 应该放到 filesystem body
  // useEffect(() => {
  //   const hasCreate = directoryList.find((item) => item.type === 'create');

  //   if (hasCreate) {
  //     change(
  //       resolveName(
  //         directoryList,
  //         hasCreate.name === 'directory' ? New.DIRECTORY : New.FILE
  //       )
  //     );

  //     setSelect([]);
  //   }
  // }, [directoryList]);

  const itemClass = generateClass(['item', `item-${display}`]);
  const itemStyle = generateClass({ 'is-select': isSelect });

  // let name = value;

  const itemClickHandle = (item: DirectoryChildren, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelect((prev) => {
        return prev.includes(item) ? prev : [...prev, item];
      });
    } else {
      setSelect([item]);
    }
  };

  // const createHandle = () => {
  //   if (!currentDirectory || item.type !== 'create') return;

  //   if (!name.trim()) {
  //     name = isCreateDirectory ? New.DIRECTORY : New.FILE;
  //   }

  //   name = resolveName(directoryList, name);

  //   const i = directoryList.findIndex((curr) => item === curr);

  //   const isSome = directoryList.find(
  //     (item, index) => index !== i && item.name === name
  //   );

  //   if (isSome) {
  //     return;
  //   }

  //   (async () => {
  //     const handle = await currentDirectory[
  //       isCreateDirectory ? 'getDirectoryHandle' : 'getFileHandle'
  //     ](name, { create: true });

  //     directoryList[i] = {
  //       name: name,
  //       type: isCreateDirectory ? 'directory' : 'file',
  //       handle: handle
  //     } as DirectoryChildren;

  //     setDirectoryList([...directoryList]);
  //   })();

  //   change('');
  // };

  // const create = (createItem: CreateHandle) => (
  //   <div
  //     className={composeClass(itemClass)}
  //     onMouseDown={(e) => e.stopPropagation()}
  //     data-display={display}
  //   >
  //     <i className={composeClass('iconfont', getIconName(createItem))}></i>

  //     <div className={style['item-name']}>
  //       <Input
  //         value={value}
  //         change={(e) => {
  //           isValidFileName(e) && change(e);
  //         }}
  //         autofocus
  //         selectInFocus
  //         size="small"
  //         blur={() => createHandle()}
  //         enter={() => createHandle()}
  //       ></Input>
  //     </div>
  //   </div>
  // );

  return (
    <div
      className={composeClass(itemClass, itemStyle)}
      title={item.name}
      data-display={display}
      data-name={item.name}
      onClick={(e) => {
        e.stopPropagation();
        itemClickHandle(item, e.ctrlKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEnter(item);
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <i className={composeClass('iconfont', getIconName(item))}></i>

      <Text className={style['item-name']} truncated>
        {item.name}
      </Text>
    </div>
  );
}
