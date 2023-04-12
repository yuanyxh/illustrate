import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { RouteId } from '@/enum';
import Home from '@/home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

const Layout = lazy(() => import('@/layout/Layout'));
const DragUploadFile = lazy(
  () => import('@/pages/DragUploadFile/DragUploadFile')
);
const Reversal = lazy(() => import('@/pages/Reversal/Reversal'));
const VisualEdit = lazy(() => import('@/pages/VisualEdit/VisualEdit'));

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
            path: 'drag-upload-file',
            title: '文件拖拽上传',
            element: <DragUploadFile />
          },
          {
            path: 'reversal',
            title: 'HTML & CSS 实现书本翻页效果',
            element: <Reversal />
          },
          {
            path: 'visual-edit',
            title: '可视化编辑',
            element: <VisualEdit />
          }
        ]
      }
    ]
  }
];

export default createHashRouter(routes);
