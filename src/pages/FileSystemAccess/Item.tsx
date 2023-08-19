import React from 'react';
import { classnames, composeClass } from '@/utils';
import { getIconName } from './utils';

import Text from '@/components/Text/Text';
import type {
  DirectoryHandle,
  EntityHandle,
  FileHandle,
  DisplayType
} from './types';
import style from './Item.module.css';

interface ItemProps extends Props {
  item: DirectoryHandle | FileHandle;
  select: EntityHandle[];
  isSelect: boolean;
  isCut: boolean;
  display: DisplayType;
  setSelect: React.Dispatch<React.SetStateAction<EntityHandle[]>>;
  onEnter(item: DirectoryHandle | FileHandle): void;
}

const generateClass = classnames(style);

export const itemStyle = style;

export default function Item(props: ItemProps) {
  const { item, isSelect, isCut, display, setSelect, onEnter } = props;

  const itemClass = generateClass(['item', `item-${display}`]);
  const itemStyle = generateClass({ 'is-select': isSelect, 'is-cut': isCut });

  const itemClickHandle = (item: EntityHandle, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelect((prev) => {
        return prev.includes(item) ? prev : [...prev, item];
      });
    } else {
      setSelect([item]);
    }
  };

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
