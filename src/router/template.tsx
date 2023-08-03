import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { RouteId } from '@/enum';
import Home from '@/home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

const Layout = lazy(() => import('@/layout/Layout'));
// --import--

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
        id: RouteId.ERROR_BOUNDARY,
        errorElement: <ErrorBoundary />,
        children: [
          // --children--
          {
            path: '*',
            hidden: true,
            element: <ErrorBoundary />
          }
        ]
      }
    ]
  }
];

export default createHashRouter(routes);
