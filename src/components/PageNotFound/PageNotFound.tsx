import React from 'react';
import { Link } from 'react-router-dom';
import { FEEDBACK_ADDRESS } from '@/config';
import style from './PageNotFound.module.css';

export default function PageNotFound() {
  return (
    <div className={style['page-not-found']}>
      <h1 className={style['title']}>Not Found</h1>

      <p className={style['error']}>
        哎呀！好像不存在这个页面哦！请检查输入地址。
      </p>

      <p className={style['desc']}>
        如果你确认这是一个错误，请前往{' '}
        <Link
          className={style['feedback']}
          to={FEEDBACK_ADDRESS}
          target="_black"
        >
          Github
        </Link>{' '}
        反馈
      </p>
    </div>
  );
}
