import React from 'react';
import { useModel } from '@/hooks';
import { base64 } from '@/utils';
import style from './Base64.module.css';
import type { ChangeEventHandler } from 'react';

// --title: base64 编解码--

export default function Base64() {
  const { value: original, change: changeOriginal } = useModel('');
  const { value: cipherText, change: changeCiphertext } = useModel('');
  const { value: encrypted, change: changeEncrypt } = useModel('');
  const { value: decrypted, change: changeDecrypt } = useModel('');

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    changeOriginal(e.target.value);
  };

  const changeEncryptHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    changeEncrypt(e.target.value);
  };

  const encodeHandler = () => {
    changeCiphertext(base64.encode(original));
  };

  const decodeHandler = () => {
    changeDecrypt(base64.decode(encrypted));
  };

  return (
    <div className={style.base64}>
      <div className={style.wrapper}>
        <input
          type="text"
          placeholder="输入正文"
          value={original}
          onChange={changeHandler}
        />
      </div>

      <div className={style.wrapper}>
        <input type="text" placeholder="输出密文" disabled value={cipherText} />
      </div>

      <button className="primary" onClick={encodeHandler}>
        base64 编码
      </button>

      <div className={style.wrapper} style={{ marginTop: 15 }}>
        <input
          type="text"
          placeholder="输入密文"
          value={encrypted}
          onChange={changeEncryptHandler}
        />
      </div>

      <div className={style.wrapper}>
        <input type="text" placeholder="输出正文" disabled value={decrypted} />
      </div>

      <button className="primary" onClick={decodeHandler}>
        base64 解码
      </button>
    </div>
  );
}
