import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import 'normalize.css';
import './index.css';
import { store } from './store';
import router from '@/router';
import Loading from './components/Loading/Loading';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loading appendBody={true} delay={160} />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
