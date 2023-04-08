import React from 'react';
import { Link } from 'react-router-dom';
import { usePages } from '@/hooks';
import style from './Home.module.css';

const PREFIX = '/sequel/';
const title = style.title + ' doubleline-substring';

/**
 * @description 门户页, 网站首页
 */
export default function Home() {
  const pages = usePages();

  return (
    <div className={style.home}>
      {pages.map((page, i) => (
        <div key={i} className={style.grid}>
          <Link to={PREFIX + page.path}>
            <div className={style.media}></div>
          </Link>
          <Link to={PREFIX + page.path}>
            <h4 className={title}>{page.title}</h4>
          </Link>
        </div>
      ))}
    </div>
  );
}
