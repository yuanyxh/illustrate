import React from 'react';
import style from './Main.module.css';
import { Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <main className={style.main}>
      <Outlet />
    </main>
  );
}
