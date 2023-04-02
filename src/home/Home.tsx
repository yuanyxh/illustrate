import React from 'react';
import style from './Home.module.css';
import { classnames } from '@/utils/';

const generateClass = classnames(style);

export default function Home() {
  const home = generateClass(['home'], 'margin-center');

  return (
    <div className={home}>
      <input type="text" />
    </div>
  );
}
