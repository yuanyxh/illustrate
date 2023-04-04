import React from 'react';
import style from './Home.module.css';
import { Link } from 'react-router-dom';
import { routes } from '@/router';
import { RouteId } from '@/enum';

const PREFIX = '/sequel/';
const title = style.title + ' doubleline-substring';

export default function Home() {
  const pages =
    routes.find((page) => page.id === RouteId.SEQUEL)?.children || [];

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
