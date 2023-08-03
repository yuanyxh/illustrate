import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ScreenContext } from './Layout';
import { usePages } from '@/hooks';
import { classnames } from '@/utils';
import style from './Sidebar.module.css';

interface SidebarProps extends Props {
  visibleSide: boolean;
  toggle(payload: boolean): void;
}

const generateClass = classnames(style);

/**
 * @description 网站侧边栏
 */
export default function Sidebar({
  visibleSide,
  toggle
}: Readonly<SidebarProps>) {
  const pages = usePages();
  const smallScreen = useContext(ScreenContext);

  const active = generateClass(['link', 'active']);
  const side = generateClass(
    { 'visible-side': visibleSide, sidebar: true },
    'scroll-y'
  );

  useEffect(() => {
    if (smallScreen) toggle(false);
  }, [smallScreen]);

  return (
    <>
      <aside className={side}>
        {pages.map((page, i) => (
          <NavLink
            key={i}
            to={`${page.path}`}
            className={({ isActive }) => (isActive ? active : style.link)}
            onClick={() => toggle(false)}
          >
            <span className="doubleline-substring">{page.title}</span>
          </NavLink>
        ))}
      </aside>

      {smallScreen && (
        <div
          className={`mask ${visibleSide ? 'visible' : ''}`}
          onClick={() => toggle(false)}
          onScroll={(e) => e.stopPropagation()}
        />
      )}
    </>
  );
}
