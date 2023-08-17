import React, { useContext } from 'react';
import { controllerOptions, ignoreType } from './config';
import { classnames, composeClass } from '@/utils';
import { ControllerContext } from './FileSystemController';
import type { DirectoryItem, NodeType } from './types';
import style from './Header.module.css';

type HeaderItem = (typeof controllerOptions)[number]['items'][number];

interface HeaderProps extends Props {
  nodeClick(type: NodeType): void;
  select: DirectoryItem[];
  display: 'thumbnail' | 'list';
}

const generateClass = classnames(style);

export default function Header(props: HeaderProps) {
  const { nodeClick, select, display } = props;

  const { clipboard } = useContext(ControllerContext);

  const iconClass = generateClass(['icon'], ' iconfont');

  const calcDisabledClass = (item: HeaderItem) => {
    const disabledClass = style['is-disabled'];

    if (ignoreType.includes(item.type) || select.length !== 0) {
      if (item.type === 'rename' && select.length > 1) {
        return disabledClass;
      }

      if (item.type === 'paste' && clipboard?.datatransfer.length === 0) {
        return disabledClass;
      }
    } else {
      return disabledClass;
    }

    return '';
  };

  const calcSelectClass = (item: HeaderItem) =>
    item.type === display ? style['is-select'] : '';

  return (
    <header className={style['header']}>
      {controllerOptions.map((group) => (
        <div key={group.id} className={style['header-item-group']}>
          {group.items.map((item) => (
            <div
              key={item.id}
              className={composeClass(
                style['header-item'],
                calcSelectClass(item),
                calcDisabledClass(item)
              )}
              onClick={() => {
                nodeClick(item.type as NodeType);
              }}
            >
              <i className={composeClass(iconClass, item.icon)}></i>
              <span style={{ marginTop: 5 }}>{item.name}</span>
            </div>
          ))}
        </div>
      ))}
    </header>
  );
}
