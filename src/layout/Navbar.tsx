import React from 'react';
import style from './Navbar.module.css';

interface NavbarProps {
  smallScreen: boolean;
  toggle(payload: boolean): void;
}

/**
 * @description 导航栏
 */
export default function Navbar({ smallScreen, toggle }: NavbarProps) {
  const onclick = () => toggle(true);

  return smallScreen ? (
    <nav className={style.navbar}>
      <div className={style.menu} onClick={onclick}></div>
    </nav>
  ) : (
    <></>
  );
}
