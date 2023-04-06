import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePages } from '@/hooks';
import { classnames } from '@/utils';
import style from './Sidebar.module.css';

interface SidebarProps extends Props {
  smallScreen: boolean;
  visibleSide: boolean;
  toggle(payload: boolean): void;
}

const generateClass = classnames(style);
const active = generateClass(['link', 'active']);

/**
 * @description 网站侧边栏
 */
export default function Sidebar({
  visibleSide,
  smallScreen,
  toggle
}: SidebarProps) {
  const pages = usePages();

  const visible = generateClass({ 'visible-side': visibleSide, sidebar: true });
  const mask = generateClass({ 'visible-mask': visibleSide, mask: true });

  return (
    <>
      <aside className={visible}>
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
          className={mask}
          onClick={() => toggle(false)}
          onScroll={(e) => e.stopPropagation()}
        ></div>
      )}
    </>
  );
}
