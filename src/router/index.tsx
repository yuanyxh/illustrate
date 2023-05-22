import React, { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { RouteId } from '@/enum';
import Home from '@/home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

const Layout = lazy(() => import('@/layout/Layout'));
const FileSystemAccess = lazy(
  () => import('@/pages/FileSystemAccess/FileSystemAccess')
);
const Test = lazy(() => import('@/pages/Test/Test'));
const PdfParser = lazy(() => import('@/pages/PdfParser/PdfParser'));
const UploadFile = lazy(() => import('@/pages/UploadFile/UploadFile'));
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
            path: 'file-system-access',
            title: '文件系统管理',
            image: '',
            element: <FileSystemAccess />
          },
          {
            path: 'test',
            title: '测试页面',
            image: '',
            element: <Test />
          },
          {
            path: 'pdf-parser',
            title: 'PDF 解析',
            image: '',
            element: <PdfParser />
          },
          {
            path: 'upload-file',
            title: '文件上传',
            image: '',
            element: <UploadFile />
          },
          {
            path: 'visual-edit',
            title: '可视化编辑',
            image: '',
            element: <VisualEdit />
          }
        ]
      }
    ]
  }
];

export default createHashRouter(routes);
