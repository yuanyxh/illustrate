/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRouteError, useNavigate, Link } from 'react-router-dom';
import { ErrorMessage } from '@/enum';
import style from './ErrorBoundary.module.css';

/**
 * TODO: 样式不太好看, 待处理; 希望 404 时组件展示在当前位置而不影响其他组件
 * @description 错误边界, 处理 404 或组件内部错误
 */
export default function ErrorBoundary() {
  const navigate = useNavigate();

  const error: any = useRouteError();

  const message = error.statusText || error.message;

  const back = () => {
    navigate(-1);
  };

  let element = null;

  if (message === ErrorMessage.NOTFOUND) {
    element = (
      <>
        <h1 className={style.title}>404 Not Found</h1>
        <p className={style.tips}>你好像正在前往一个不存在的页面哦！</p>
        <p className={style.tips}>
          如果你确定这是一个错误，请前往{' '}
          <Link
            to="https://github.com/yuanyxh/illustrate/issues"
            target="_black"
            className={style.issues}
          >
            github
          </Link>{' '}
          反馈
        </p>
      </>
    );
  } else {
    element = (
      <>
        <h1 className={style.title}>哎呀, 出错啦!</h1>
        <p className={style['error-message']}>{message}</p>
        <p className={style.tips}>
          请前往
          <Link
            to="https://github.com/yuanyxh/illustrate/issues"
            target="_black"
            className={style.issues}
          >
            github
          </Link>{' '}
          反馈，帮助完善网站哦！
        </p>
      </>
    );
  }

  return (
    <div className={style['error-boundary']}>
      {element}
      <button className={style.back} onClick={back}>
        返回上一页
      </button>
    </div>
  );
}
