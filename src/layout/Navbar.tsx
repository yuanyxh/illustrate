import React, { useContext } from 'react';
import { ScreenContext } from './Layout';
import style from './Navbar.module.css';

interface NavbarProps {
  toggle(payload: boolean): void;
}

/**
 * @description 导航栏
 */
export default function Navbar({ toggle }: Readonly<NavbarProps>) {
  const smallScreen = useContext(ScreenContext);

  const onclick = () => toggle(true);

  return (
    <>
      {smallScreen && (
        <nav className={style.navbar}>
          <div className={style.menu} onClick={onclick}></div>
        </nav>
      )}
    </>
  );
}
