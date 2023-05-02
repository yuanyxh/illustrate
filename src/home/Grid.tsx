import React from 'react';
import { Link } from 'react-router-dom';
import style from './Grid.module.css';

interface GridProps extends Props {
  page: Route.CustomRouteObject;
}

const PREFIX = '/sequel/';
const title = style.title + ' doubleline-substring';

export default function Grid({ page }: Readonly<GridProps>) {
  return (
    <div className={style.grid}>
      <Link to={PREFIX + page.path}>
        <div className={style.media}>
          {page.image && <img src={page.image} loading="lazy" alt="演示封面" />}
        </div>
      </Link>
      <Link to={PREFIX + page.path}>
        <h4 className={title}>{page.title}</h4>
      </Link>
    </div>
  );
}
