import React, { Suspense } from 'react';
import './App.css';

export default function App(props: Props) {
  return (
    <div className="app">
      <Suspense>{props.children}</Suspense>
    </div>
  );
}
