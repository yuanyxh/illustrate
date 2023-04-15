import React from 'react';
import { NavLink } from 'react-router-dom';
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
export default function Sidebar({ visibleSide, toggle }: SidebarProps) {
  const pages = usePages();

  const active = generateClass(['link', 'active']);
  const side = generateClass(
    { 'visible-side': visibleSide, sidebar: true },
    'scroll-y'
  );
  const mask = generateClass({ 'visible-side': visibleSide, mask: true });

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

      <div
        className={mask}
        onClick={() => toggle(false)}
        onScroll={(e) => e.stopPropagation()}
      />
    </>
  );
}
