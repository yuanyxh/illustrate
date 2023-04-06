import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { RouteId } from '@/enum';
import Home from '@/home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { title as ReversalTitle } from '@/pages/reversal/Reversal';
import { title as DragTitle } from '@/pages/drag/Drag';

const Layout = lazy(() => import('@/layout/Layout'));
const Reversal = lazy(() => import('@/pages/reversal/Reversal'));
const Drag = lazy(() => import('@/pages/drag/Drag'));

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
            title: ReversalTitle,
            path: 'reversal',
            element: <Reversal />
          },
          {
            title: DragTitle,
            path: 'drag',
            element: <Drag />
          },
          {
            title: DragTitle,
            path: 'drop',
            element: <Drag />
          }
        ]
      }
    ]
  }
];

export default createHashRouter(routes);
