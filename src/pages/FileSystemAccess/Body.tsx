import React, { forwardRef, useRef, useEffect, useContext } from 'react';
import { createPort, Rectangle, isRenderElement } from '@/utils';
import { ControllerContext } from './FileSystemController';
import Text from '@/components/Text/Text';
import NewHandle from './NewHandle';
import Item from './Item';
import { itemStyle } from './Item';
import type { DirectoryChildren, EntityHandle, DisplayType } from './types';
import style from './Body.module.css';

interface BodyProps extends Props {
  root: FileSystemDirectoryHandle | null | undefined;
  currentDirectory: FileSystemDirectoryHandle | null | undefined;
  setCurrentDirectroy: React.Dispatch<
    React.SetStateAction<FileSystemDirectoryHandle | null | undefined>
  >;
  directoryList: DirectoryChildren[];
  setDirectoryList: React.Dispatch<React.SetStateAction<DirectoryChildren[]>>;
  select: EntityHandle[];
  setSelect: React.Dispatch<React.SetStateAction<EntityHandle[]>>;
  display: DisplayType;
  onClipboard(type: 'copy' | 'cut' | 'paste'): void;
}

export default forwardRef(function Body(
  props: BodyProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    root,
    currentDirectory,
    setCurrentDirectroy,
    directoryList,
    setDirectoryList,
    select,
    setSelect,
    display = 'list',
    onClipboard
  } = props;

  const { history, clipboard } = useContext(ControllerContext);

  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (
      window.document.querySelector(
        '.' + style['file-clipboard']
      ) as HTMLInputElement
    )?.focus();
  }, [select, root, currentDirectory, directoryList, display]);

  const $frame = createPort(frameRef);

  let tempSelect: string[] = [];
  let isFrameSelection = false;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const frameSelection: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isFrameSelection || !frameRef.current) return;

    endX = (endX === 0 ? startX : endX) + e.movementX;
    endY = (endY === 0 ? startY : endY) + e.movementY;

    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const right = Math.max(startX, endX);
    const bottom = Math.max(startY, endY);

    $frame.css('left', left + 'px');
    $frame.css('top', top + 'px');
    $frame.css('width', Math.abs(startX - endX) + 'px');
    $frame.css('height', Math.abs(startY - endY) + 'px');

    const children = frameRef.current.parentElement?.children;

    if (!children) return;

    for (let i = 0; i < children.length; i++) {
      const curr = children[i];

      if (curr.classList.contains(style['frame'])) continue;

      const name = curr.getAttribute('data-name') || '';

      const mouse = new Rectangle(
        right - left,
        bottom - top,
        left + (right - left) / 2,
        top + (bottom - top) / 2
      );

      const isIntersect = Rectangle.from(
        curr as HTMLElement
      ).intersectRectangle(mouse);

      if (isIntersect) {
        tempSelect.includes(name) || tempSelect.push(name);

        curr.classList.add(itemStyle['is-select']);
      } else {
        tempSelect = tempSelect.filter((item) => item !== name);

        curr.classList.remove(itemStyle['is-select']);
      }
    }
  };

  const startSelect: React.MouseEventHandler<HTMLDivElement> = (e) => {
    isFrameSelection = true;

    const { scrollTop } = e.target as HTMLDivElement;

    startX = e.nativeEvent.offsetX;
    startY = scrollTop + e.nativeEvent.offsetY;

    $frame.show();
  };

  const cacheSelect = () => {
    if (!isFrameSelection) return;

    isFrameSelection = false;

    const result = directoryList.filter((handle) =>
      tempSelect.find((name) => name === handle.name)
    );

    tempSelect = [];

    setSelect(result as unknown as EntityHandle[]);

    $frame.hide();
    $frame.css('width', 0);
    $frame.css('height', 0);

    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
  };

  const enter = (handle: EntityHandle) => {
    if (handle.type === 'directory') {
      setCurrentDirectroy(handle.handle);
      history?.push(handle.handle);
    }
  };

  return (
    <>
      <div
        className={style['body-content']}
        onMouseDown={startSelect}
        onMouseUp={() => cacheSelect()}
        onMouseLeave={() => cacheSelect()}
        onMouseMove={frameSelection}
      >
        {directoryList.map((item) =>
          item.type === 'create' ? (
            <NewHandle
              key={item.name}
              item={item}
              currentDirectory={currentDirectory}
              directoryList={directoryList}
              setDirectoryList={setDirectoryList}
              select={select}
              setSelect={setSelect}
            />
          ) : (
            <Item
              key={item.name}
              item={item}
              select={select}
              display={display}
              isSelect={select.includes(item)}
              isCut={clipboard?.datatransfer.includes(item) || false}
              setSelect={setSelect}
              onEnter={enter}
            />
          )
        )}

        {isRenderElement(directoryList.length === 0) && (
          <div className={style['empty']}>
            <i className="iconfont icon-kongbaiye" style={{ fontSize: 60 }}></i>

            <Text type="info">此文件夹为空</Text>
          </div>
        )}

        <>
          <div ref={frameRef} className={style['frame']}></div>
          <input
            ref={ref}
            type="text"
            className={style['file-clipboard']}
            onCopy={() => onClipboard('copy')}
            onCut={() => onClipboard('cut')}
            onPaste={() => onClipboard('paste')}
          />
        </>
      </div>
    </>
  );
});
