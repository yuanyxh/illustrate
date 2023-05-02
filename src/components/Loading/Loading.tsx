import React, { MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import style from './Loading.module.css';
import { classnames } from '@/utils';

interface LoadingProps {
  /** 是否将对应的元素添加至 body 中 */
  appendBody?: boolean;
  /**
   * 延迟显示时间, 单位 ms, 默认 120 ms; 当用户网络畅通时, 内容可能会立即加载完成, 此时不应展示 loading 组件以免造成闪屏,
   * 应该设置一个合理的延迟时间以避免
   * */
  delay?: number;
}

const generateClass = classnames(style);

const stopPropagation = (e: MouseEvent) => e.stopPropagation();

let timer: number | null = null;

/**
 * @description loading 效果
 */
export default function Loading(props: Readonly<LoadingProps>) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    timer = window.setTimeout(() => {
      setLoading(true);
    }, delay || 120);

    return () => {
      timer && window.clearTimeout(timer);
      return;
    };
  }, []);

  const { appendBody, delay } = props;

  const element = (
    <div
      className={generateClass({
        fixed: !!appendBody,
        'loading-wrapper': true
      })}
      onClick={stopPropagation}
    >
      <div className={style.loading} onClick={stopPropagation}></div>
    </div>
  );

  return loading ? (
    appendBody ? (
      createPortal(element, document.body)
    ) : (
      element
    )
  ) : (
    <></>
  );
}
