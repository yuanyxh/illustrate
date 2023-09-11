import React from 'react';
import Tip from '@/components/Tip/Tip';
import style from './Test.module.css';

// --title: 测试页面--

export default function Test() {
  return (
    <div className={style['test']}>
      <Tip type="primary">
        {{
          header() {
            return 'TIP';
          },
          body() {
            return <span>Test content</span>;
          }
        }}
      </Tip>
    </div>
  );
}
