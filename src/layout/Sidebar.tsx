import React from 'react';
import style from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { routes } from '@/router';
import { RouteId } from '@/enum';

const active = `${style.link} ${style.active}`;

export default function Sidebar() {
  const pages =
    routes.find((page) => page.id === RouteId.SEQUEL)?.children || [];

  return (
    <aside className={style.sidebar}>
      {pages.map((page, i) => (
        <NavLink
          key={i}
          to={`${page.path}`}
          className={({ isActive }) => (isActive ? active : style.link)}
        >
          <span className="doubleline-substring">{page.title}</span>
        </NavLink>
      ))}
    </aside>
  );
}
