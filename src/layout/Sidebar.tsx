import React from 'react';
import style from './Sidebar.module.css';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className={style.sidebar}>
      {Array(30)
        .fill(11)
        .map((item, i) => {
          return (
            <Link
              key={i}
              style={{ display: 'block', height: '50px' }}
              to={'test'}
            >
              <div>{item}</div>
            </Link>
          );
        })}
    </aside>
  );
}
