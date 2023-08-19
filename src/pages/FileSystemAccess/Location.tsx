import React, { useEffect, useState, useContext } from 'react';
import { useModel } from '@/hooks';
import { classnames, composeClass, isRenderElement } from '@/utils';
import { ControllerContext } from './FileSystemController';
import {
  resolvePath,
  generateTreeIndex,
  filterNode,
  getParentName
} from './utils';
import Input from '@/components/Input/Input';
import type { DirectoryChildren, TreeIndex } from './types';
import style from './Location.module.css';

interface LocationProps extends Props {
  root: FileSystemDirectoryHandle | null | undefined;
  directoryList: DirectoryChildren[];
  currentDirectory: FileSystemDirectoryHandle | null | undefined;
  setCurrentDirectroy: React.Dispatch<
    React.SetStateAction<FileSystemDirectoryHandle | null | undefined>
  >;
}

const generateClass = classnames(style);

export default function Location(props: LocationProps) {
  const { root, directoryList, currentDirectory, setCurrentDirectroy } = props;

  const { history } = useContext(ControllerContext);

  const pathModel = useModel('/');
  const searchModel = useModel('');

  const [backDisabled, setBackDisabled] = useState(false);
  const [forwardDisabled, setForwardDisabled] = useState(false);

  const [index, setIndex] = useState<TreeIndex | null>(null);
  const [list, setList] = useState<
    (TreeIndex & {
      path: string;
    })[]
  >([]);

  useEffect(() => {
    if (root === currentDirectory) {
      setBackDisabled(true);
    } else {
      setBackDisabled(false);
    }

    const childDirectory = directoryList.filter(
      (child) => child.type !== 'create' && child.type === 'directory'
    );

    if (history?.forwardStack.length) {
      setForwardDisabled(false);
    }

    if (
      !directoryList.length ||
      history?.forwardStack.length === 0 ||
      childDirectory.length === 0
    ) {
      setForwardDisabled(true);
    }
  }, [pathModel.value, directoryList]);

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

  const backStyle = generateClass({ 'is-disabled': backDisabled });
  const forwardStyle = generateClass({ 'is-disabled': forwardDisabled });

  const back = () => {
    const back = history?.back();

    if (back) {
      setCurrentDirectroy(back);
    }
  };

  const forward = () => {
    const forward = history?.forward();

    if (forward) {
      setCurrentDirectroy(forward);
    }
  };

  return (
    <div className={style['location']}>
      <div className={style['location-history']}>
        <button
          className={composeClass(style['location-history-back'], backStyle)}
          onClick={() => back()}
        >
          <i className="iconfont icon-a-zuojiantouzhixiangzuojiantou"></i>
        </button>

        <button
          className={composeClass(
            style['location-history-forward'],
            forwardStyle
          )}
          onClick={() => forward()}
        >
          <i className="iconfont icon-a-youjiantouzhixiangyoujiantou"></i>
        </button>
      </div>

      <div className={style['location-path']}>
        <Input {...pathModel} disabled>
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
          focus={() =>
            index &&
            searchModel.value &&
            setList(filterNode(index, searchModel.value, ''))
          }
          blur={() => setList([])}
        >
          {{
            prefix() {
              return <i className="iconfont icon-sousuo"></i>;
            }
          }}
        </Input>

        {isRenderElement(list.length) && (
          <ul className={style['search-result-list']}>
            {list.map((item) => (
              <li key={item.path} className={style['search-result-item']}>
                <span title={item.name} className={style['search-result-text']}>
                  {item.name}
                </span>

                <span
                  title={item.path}
                  className={style['search-result-where']}
                >
                  {getParentName(item.path)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
