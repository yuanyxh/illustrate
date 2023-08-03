import React from 'react';
import Button from '@/components/Button/Button';

// --title: 测试页面--

export default function Test() {
  return (
    <div>
      <Button type="default" size="large">
        default
      </Button>
      <Button type="primary" size="small">
        primary
      </Button>
      <Button type="success">success</Button>
      <Button type="info" size="large">
        info
      </Button>
      <Button type="warning" size="small">
        warning
      </Button>
      <Button type="danger">danger</Button>
    </div>
  );
}
