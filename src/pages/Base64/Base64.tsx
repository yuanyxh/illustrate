import React from 'react';
import { useModel } from '@/hooks';
import { base64 } from '@/utils';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import style from './Base64.module.css';

// --title: base64 编解码--

export default function Base64() {
  const textModel = useModel('');
  const encryptModel = useModel('');

  const encrypt = () => {
    encryptModel.change(base64.encode(textModel.value));
  };

  const decrypt = () => {
    textModel.change(base64.decode(encryptModel.value));
  };

  return (
    <div className={style['base64']}>
      <section className={style['wrapper']}>
        <div className={style['text']}>
          <Input
            type="textarea"
            style={{ height: '100%' }}
            {...textModel}
            resize={false}
            placeholder="明文输入或输出"
          />
        </div>

        <div className={style['operator']}>
          <Button type="primary" block onClick={encrypt}>
            base64 编码
          </Button>

          <Button onClick={decrypt}>base64 解码</Button>
        </div>

        <div className={style['text']}>
          <Input
            type="textarea"
            style={{ height: '100%' }}
            {...encryptModel}
            resize={false}
            placeholder="密文输入或输出"
          />
        </div>
      </section>
    </div>
  );
}
