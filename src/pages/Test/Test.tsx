import React from 'react';
import Button from '@/components/Button/Button';
import style from './Test.module.css';

// --title: 测试页面--

export default function Test() {
  return (
    <div className={style['test']}>
      <Button type="primary" loading>
        click me
      </Button>
    </div>
  );
}
