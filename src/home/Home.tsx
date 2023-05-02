import React from 'react';
import { usePages } from '@/hooks';
import Grid from './Grid';
import style from './Home.module.css';

/**
 * @description 门户页, 网站首页
 */
export default function Home() {
  const pages = usePages();

  return (
    <div className={style.home}>
      {pages.map((page, i) => (
        <Grid key={i} page={page} />
      ))}
    </div>
  );
}
