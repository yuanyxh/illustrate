import React from 'react';
import { useModel } from '@/hooks';
import Input from '@/components/Input/Input';

// --title: 测试页面--

export default function Base64() {
  const model = useModel('');

  return (
    <Input
      {...model}
      placeholder="please input"
      size="large"
      maxLength={20}
    ></Input>
  );
}
