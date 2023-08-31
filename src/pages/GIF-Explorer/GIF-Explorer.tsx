import React from 'react';
import GIFVideo from './GIFVideo';
import style from './GIF-Explorer.module.css';

// --title: GIF 编解码--

export default function GIFExplorer() {
  return (
    <div className={style['gif-explorer']}>
      <GIFVideo />
    </div>
  );
}
