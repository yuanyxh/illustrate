import React, { ReactNode } from 'react';
import { classnames } from '@/utils';
import style from './EditArea.module.css';

interface EditAreaProps extends Pick<Props, 'className' | 'style'> {
  /** 效果演示区域 */
  illustrate: ReactNode;
  /** 代码展示区域 */
  code: ReactNode;
}

const generateClass = classnames(style);

/**
 * @description 编辑布局组件, 大屏时为: 左效果演示区, 右代码展示区; 小屏时为: 上效果演示区, 下代码展示区;
 * 也可以自定义而不使用此组件
 */
export default function EditArea(props: EditAreaProps) {
  const { illustrate, code, className = '', style: inlineStyle } = props;

  const edit = generateClass(['edit-area'], ...className.split(' '));

  return (
    <div className={edit} style={inlineStyle}>
      <div className={style.illustrate}>{illustrate}</div>
      <div className={style.code}>{code}</div>
    </div>
  );
}
