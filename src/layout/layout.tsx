import React, { createContext, useState, useCallback } from 'react';
import { useScreen } from '@/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './Main';
import style from './Layout.module.css';

export const ScreenContext = createContext(false);

/**
 * @description 网站整体布局
 */
export default function Layout() {
  const [visibleSide, setVisibleSide] = useState(false);
  const isSmallScreen = useScreen();

  const toggle = useCallback((payload: boolean) => {
    setVisibleSide(() => payload);
  }, []);

  return (
    <ScreenContext.Provider value={isSmallScreen}>
      <div className={style.layout}>
        <Navbar toggle={toggle} />
        <Sidebar visibleSide={visibleSide} toggle={toggle} />
        <Main />
      </div>
    </ScreenContext.Provider>
  );
}
