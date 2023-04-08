import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { RouteId } from '@/enum';
import Home from '@/home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

const Layout = lazy(() => import('@/layout/Layout'));
const Drag = lazy(() => import('@/pages/Drag/Drag'));
const Reversal = lazy(() => import('@/pages/Reversal/Reversal'));

export const routes: Route.CustomRouteObject[] = [
  {
    id: RouteId.HOME,
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />
  },
  {
    id: RouteId.SEQUEL,
    path: '/sequel',
    element: <Layout />,
    children: [
      {
        id: RouteId.ERRORBOUNDARY,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: 'drag',
            title: '文件拖拽上传',
            element: <Drag />
          },
          {
            path: 'reversal',
            title: 'HTML & CSS 实现书本翻页效果',
            element: <Reversal />
          }
        ]
      }
    ]
  }
];

export default createHashRouter(routes);
