import React, { useState, useCallback } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './Main';
import style from './Layout.module.css';

/**
 * @description 网站整体布局
 */
export default function Layout() {
  const [visibleSide, setVisibleSide] = useState(false);

  const toggle = useCallback((payload: boolean) => {
    setVisibleSide(() => payload);
  }, []);

  return (
    <div className={style.layout}>
      <Navbar toggle={toggle} />
      <Sidebar visibleSide={visibleSide} toggle={toggle} />
      <Main />
    </div>
  );
}
