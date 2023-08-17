import React from 'react';
import { classnames, isRenderElement } from '@/utils';
import style from './UploadImage.module.css';

interface UploadImageProps extends Props {
  url?: string;
}

const generateClass = classnames(style);

export default function UploadImage(props: UploadImageProps) {
  const { url } = props;

  const uploadImageClass = generateClass({
    'upload-image': true,
    'has-image': !!url
  });

  const imageElement = (
    <div className={style['upload-image-wrapper']}>
      <img style={{ objectFit: 'cover' }} src={url} alt="" />

      <div className={style['upload-image-mask']}>
        <span className={style['upload-image-delete']}>x</span>
      </div>
    </div>
  );

  return (
    <div
      className={uploadImageClass}
      style={{ marginRight: 10, marginBottom: 5 }}
    >
      {isRenderElement(url) && imageElement}
    </div>
  );
}
