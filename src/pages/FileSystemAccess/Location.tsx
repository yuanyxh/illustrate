import React, { useEffect, useState } from 'react';
import { useModel } from '@/hooks';
import {
  resolvePath,
  generateTreeIndex,
  filterNode,
  getParentName
} from './utils';
import Input from '@/components/Input/Input';
import type { TreeIndex } from './types';
import style from './Location.module.css';

interface LocationProps extends Props {
  root: FileSystemDirectoryHandle | null | undefined;
  currentDirectory: FileSystemDirectoryHandle | null | undefined;
  setCurrentDirectroy: React.Dispatch<
    React.SetStateAction<FileSystemDirectoryHandle | null | undefined>
  >;
}

export default function Location(props: LocationProps) {
  const { root, currentDirectory, setCurrentDirectroy } = props;

  const pathModel = useModel('/');
  const searchModel = useModel('');

  const [index, setIndex] = useState<TreeIndex | null>(null);
  const [list, setList] = useState<
    (TreeIndex & {
      path: string;
    })[]
  >([]);

  useEffect(() => {
    if (!(root && currentDirectory)) return;

    (async () => {
      const paths = await root.resolve(currentDirectory);

      if (paths) {
        pathModel.change(resolvePath(paths));
      }
    })();
  }, [currentDirectory]);

  useEffect(() => {
    if (!(root && currentDirectory)) return;

    (async () => {
      setIndex(await generateTreeIndex(currentDirectory));
    })();
  }, [currentDirectory]);

  useEffect(() => {
    if (!index || !searchModel.value) return setList([]);

    setList(filterNode(index, searchModel.value, ''));
  }, [searchModel.value]);

  return (
    <div className={style['location']}>
      <div className={style['location-history']}>
        <button className={style['location-history-back']}>
          <i className="iconfont icon-a-zuojiantouzhixiangzuojiantou"></i>
        </button>

        <button className={style['location-history-forward']}>
          <i className="iconfont icon-a-youjiantouzhixiangyoujiantou"></i>
        </button>
      </div>

      <div className={style['location-path']}>
        <Input {...pathModel}>
          {{
            prefix() {
              return <i className="iconfont icon-24gf-folderOpen"></i>;
            }
          }}
        </Input>
      </div>

      <div className={style['location-search']}>
        <Input
          {...searchModel}
          placeholder={`在 ${currentDirectory?.name} 中搜索`}
        >
          {{
            prefix() {
              return <i className="iconfont icon-sousuo"></i>;
            }
          }}
        </Input>

        <ul className={style['search-result-list']}>
          {list.map((item) => (
            <li key={item.path} className={style['search-result-item']}>
              <span title={item.name} className={style['search-result-text']}>
                {item.name}
              </span>

              <span title={item.path} className={style['search-result-where']}>
                {getParentName(item.path)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
