import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import Home from '@/home/Home';
import type { RouteObject } from 'react-router-dom';
import Test from '@/pages/test/Test';

const Layout = lazy(() => import('@/layout/Layout'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/illustrate',
    element: <Layout />,
    children: [
      {
        path: 'test',
        element: <Test />
      }
    ]
  }
];

export default createHashRouter(routes);
