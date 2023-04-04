import React from 'react';
import style from './Home.module.css';
import { classnames } from '@/utils/';
import { Link } from 'react-router-dom';

const generateClass = classnames(style);

const home = generateClass(['home'], 'margin-center');
const route = Array(13).fill(11);

export default function Home() {
  return (
    <div className={home}>
      {route.map((item, i) => {
        return (
          <Link className={style.grid} key={i} to={'/illustrate'}>
            <div>{item}</div>
          </Link>
        );
      })}
    </div>
  );
}
