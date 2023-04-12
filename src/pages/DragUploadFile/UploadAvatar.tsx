import React, { useState, useEffect } from 'react';
import style from './UploadAvatar.module.css';

export default function UploadAvatar() {
  const [avatarList, setAvatarList] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      let i = 0;

      for (; i < avatarList.length; i++) {
        URL.revokeObjectURL(avatarList[i]);
      }
    };
  }, []);

  const drop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;

    const file = files[0];

    if (!file.type.includes('image')) return;

    setAvatarList((prev) => [...prev, URL.createObjectURL(file)]);
  };

  return (
    <>
      <h3 className={style.title}>头像拖拽上传</h3>
      <div className={style['drop-avatar']}>
        {avatarList.map((avatar, i) => (
          <div key={i} className={style['uploaded']}>
            <img src={avatar} alt="avatar" />
          </div>
        ))}
        <div
          className={style['avatar-item']}
          onDragOver={(e) => e.preventDefault()}
          onDrop={drop}
        ></div>
      </div>
    </>
  );
}
