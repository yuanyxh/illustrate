import React, { useState } from 'react';
import Transition from '@/components/Transition/Transition';
import style from './Drag.module.css';

export const title = '文件拖拽上传';

const enterClass = {
  from: style['enter-from'],
  active: style['enter-active'],
  to: style['enter-to']
};

const leaveClass = {
  from: style['leave-from'],
  active: style['leave-active'],
  to: style['leave-to']
};

export default function Drag() {
  const [show, setShow] = useState(false);

  const click = () => {
    setShow((show) => !show);
  };

  return (
    <div className={style.drag}>
      <div className={style.wrapper}>
        <Transition
          visible={show}
          enterClass={enterClass}
          leaveClass={leaveClass}
        >
          <div
            className={style.item}
            style={{ backgroundColor: 'hsl(240deg 100% 80%)' }}
          ></div>
        </Transition>

        <button className={style.toggle} onClick={click}>
          切换
        </button>
      </div>
    </div>
  );
}
