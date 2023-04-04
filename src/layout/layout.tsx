import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';
import style from './Layout.module.css';

export default function Layout() {
  return (
    <div className={style.layout}>
      <Sidebar />

      <Main />
    </div>
  );
}
