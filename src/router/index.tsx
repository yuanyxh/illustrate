import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import Home from '@/home/Home';
import { RouteId } from '@/enum';
import type { NonIndexRouteObject } from 'react-router-dom';
import Reversal, { title as ReversalTitle } from '@/pages/reversal/Reversal';

export interface CustomRouteObject extends NonIndexRouteObject {
  title?: string;
  children?: CustomRouteObject[];
}

const Layout = lazy(() => import('@/layout/Layout'));

export const routes: CustomRouteObject[] = [
  {
    id: RouteId.HOME,
    path: '/',
    element: <Home />
  },
  {
    id: RouteId.SEQUEL,
    path: '/sequel',
    element: <Layout />,
    children: [
      {
        title: ReversalTitle,
        path: 'reversal',
        element: <Reversal />
      }
    ]
  }
];

export default createHashRouter(routes);
