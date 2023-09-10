import React from 'react';
import GIFVideo from './GIFVideo';
import GIFPicture from './GIFPicture';
import GIFPlayer from './GIFPlayer';
import style from './GIF-Explorer.module.css';

// --title: GIF 编解码--

export default function GIFExplorer() {
  return (
    <div className={style['gif-explorer']}>
      <GIFVideo />

      <GIFPicture />

      <GIFPlayer />
    </div>
  );
}
