import React, { ReactNode } from 'react';
import { classnames } from '@/utils';
import style from './EditArea.module.css';

interface EditAreaProps extends Pick<Props, 'className' | 'style'> {
  illustrate: ReactNode;
  code: ReactNode;
}

const generateClass = classnames(style);

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
