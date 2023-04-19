import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { RouteId } from '@/enum';
import Home from '@/home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

const Layout = lazy(() => import('@/layout/Layout'));
const DragUploadFile = lazy(
  () => import('@/pages/DragUploadFile/DragUploadFile')
);
const Test = lazy(() => import('@/pages/Test/Test'));
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
            image: 'http://qkc148.bvimg.com/18470/da4102580106cca1.png',
            gif: 'http://qkc148.bvimg.com/18470/da4102580106cca1.png',
            element: <DragUploadFile />
          },
          {
            path: 'test',
            title: '测试页面',
            image: '',
            gif: '',
            element: <Test />
          },
          {
            path: 'visual-edit',
            title: '可视化编辑',
            image: '',
            gif: '',
            element: <VisualEdit />
          }
        ]
      }
    ]
  }
];

export default createHashRouter(routes);
