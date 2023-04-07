import React from 'react';
import { NavLink } from 'react-router-dom';
import Transition from '@/components/Transition/Transition';
import { usePages } from '@/hooks';
import { classnames } from '@/utils';
import style from './Sidebar.module.css';

interface SidebarProps extends Props {
  smallScreen: boolean;
  visibleSide: boolean;
  toggle(payload: boolean): void;
}

const generateClass = classnames(style);

const enter = {
  from: generateClass(['mask-enter']),
  active: generateClass(['mask-active']),
  to: generateClass(['mask-to'])
};
const leave = {
  from: generateClass(['mask-to']),
  active: generateClass(['mask-active']),
  to: generateClass(['mask-enter'])
};

/**
 * @description 网站侧边栏
 */
export default function Sidebar({
  visibleSide,
  smallScreen,
  toggle
}: SidebarProps) {
  const pages = usePages();

  const active = generateClass(['link', 'active']);
  const visible = generateClass({ 'visible-side': visibleSide, sidebar: true });

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
        <Transition visible={visibleSide} enterClass={enter} leaveClass={leave}>
          <div
            className={style.mask}
            onClick={() => toggle(false)}
            onScroll={(e) => e.stopPropagation()}
          ></div>
        </Transition>
      )}
    </>
  );
}
