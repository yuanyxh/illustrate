import React, { useState, useRef } from 'react';
import Button from './Button';
import Wrapper from './Wrapper';
import Input from './Input';
import style from './VisualEdit.module.css';

// --title: 可视化编辑--

let node: HTMLElement | null = null,
  curr: HTMLElement | null = null;
export default function VisualEdit() {
  const visual = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isEdit, setIsEdit] = useState(false);

  const dragstart: React.DragEventHandler = (e) => {
    e.dataTransfer.setData('text/html', (e.target as HTMLElement).outerHTML);
  };

  const drop: React.DragEventHandler = (e) => {
    e.preventDefault();

    const html = e.dataTransfer.getData('text/html');
    node?.insertAdjacentHTML('beforeend', html);

    if (node) node.classList.remove(style.active);
  };

  const dragenter: React.DragEventHandler = (e) => {
    const ele = e.target as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    ele.classList.add(style.active);

    if (relatedTarget) relatedTarget.classList.remove(style.active);

    node = ele;
  };

  const dragleave: React.DragEventHandler = (e) => {
    if (node && e.target === node) node.classList.remove(style.active);
  };

  const contextmenu: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();

    curr = e.target as HTMLElement;

    const { clientX: x, clientY: y } = e;
    setPosition({ x, y });
    setShowMenu(true);
  };

  const click: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    setShowMenu(false);
  };

  const edit: React.MouseEventHandler = (e) => {
    setIsEdit(true);
  };

  const createChange: (type: string) => React.ChangeEventHandler = (type) => {
    let handler!: React.ChangeEventHandler;
    switch (type) {
      case 'width':
        handler = (e) =>
          curr &&
          (curr.style.width = (e.target as HTMLInputElement).value + 'px');
        break;
      case 'height':
        handler = (e) =>
          curr &&
          (curr.style.height = (e.target as HTMLInputElement).value + 'px');
        break;
      case 'background-color':
        handler = (e) =>
          curr &&
          (curr.style.backgroundColor = (e.target as HTMLInputElement).value);
    }
    return handler;
  };

  const blur: React.FocusEventHandler = (e) => {
    const value = (e.target as HTMLTextAreaElement).value;
    if (!value) return;

    const attrs = value.split(';');

    let attr: string | undefined;
    while ((attr = attrs.shift())) {
      const [name, value] = attr.split(':');

      curr && (curr.style[name.trim() as unknown as number] = value.trim());
    }
  };

  return (
    <div
      className={style['visual-edit']}
      onClick={click}
      onContextMenu={() => setShowMenu(false)}
    >
      <div
        ref={visual}
        className={style.visual}
        onDragOver={(e) => e.preventDefault()}
        onDrop={drop}
        onDragEnter={dragenter}
        onDragLeave={dragleave}
        onContextMenu={contextmenu}
      ></div>
      <div className={style.edit}>
        {isEdit ? (
          <div className={style.adjustment}>
            <div className={style.back} onClick={() => setIsEdit(false)}>
              返回
            </div>
            <h3 className={style.title}>编辑</h3>
            <div className={style.row}>
              <span className={style.name}>width</span>
              <input
                className={style.number}
                type="number"
                onChange={createChange('width')}
              />
            </div>
            <div className={style.row}>
              <span className={style.name}>height</span>
              <input
                className={style.number}
                type="number"
                onChange={createChange('height')}
              />
            </div>
            <div className={style.row}>
              <span className={style.name}>background-color</span>
              <input
                className={style.color}
                type="color"
                onChange={createChange('background-color')}
              />
            </div>

            <div className={style.row}>
              <textarea
                className={style.custom}
                cols={50}
                rows={10}
                placeholder="自定义样式"
                onBlur={blur}
              ></textarea>
            </div>
          </div>
        ) : (
          <div className={style.component}>
            <h3 className={style.title}>组件</h3>
            <div className={style.row}>
              <span className={style.name}>盒子</span>
              <Wrapper dragstart={dragstart}></Wrapper>
            </div>
            <div className={style.row}>
              <span className={style.name}>输入框</span>
              <Input dragstart={dragstart}></Input>
            </div>
            <div className={style.row}>
              <span className={style.name}>按钮</span>
              <Button dragstart={dragstart}></Button>
            </div>
          </div>
        )}
      </div>

      {showMenu && (
        <ul
          className={style.menu}
          style={{
            position: 'absolute',
            left: position.x + 'px',
            top: position.y + 'px'
          }}
        >
          <li className={style['menu-item']} onClick={edit}>
            编辑
          </li>
        </ul>
      )}
    </div>
  );
}
