import React, { Suspense } from 'react';
import './App.css';
import Loading from './components/Loading/Loading';

export default function App(props: Props) {
  return (
    <div className="app">
      <Suspense fallback={<Loading appendBody={true} delay={240} />}>
        {props.children}
      </Suspense>
    </div>
  );
}
