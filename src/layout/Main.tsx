import React, { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';
import Loading from '@/components/Loading/Loading';
import style from './Main.module.css';

/**
 * @description 网站主体内容
 */
export default memo(function Main() {
  return (
    <main className={style.main}>
      <Suspense fallback={<Loading delay={150} />}>
        <Outlet />
      </Suspense>
    </main>
  );
});
