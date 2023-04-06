import React, { useState, useEffect, useCallback } from 'react';
import { useThrottle } from '@/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './Main';
import style from './Layout.module.css';

const BREAKPOINT = 840;

/**
 * @description 网站整体布局
 */
export default function Layout() {
  const [visibleSide, setVisibleSide] = useState(false);

  const [smallScreen, setSmallScreen] = useState(
    window.innerWidth < BREAKPOINT
  );

  const resize = useThrottle(() => {
    if (window.innerWidth <= BREAKPOINT) {
      setSmallScreen(true);
      setVisibleSide(false);
    } else if (window.innerWidth > BREAKPOINT) {
      setSmallScreen(false);
      setVisibleSide(true);
    }
  });

  const toggle = useCallback((payload: boolean) => {
    setVisibleSide(() => payload);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={style.layout}>
      <Navbar smallScreen={smallScreen} toggle={toggle} />
      <Sidebar
        smallScreen={smallScreen}
        visibleSide={visibleSide}
        toggle={toggle}
      />
      <Main />
    </div>
  );
}
