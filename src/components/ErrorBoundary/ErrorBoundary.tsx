/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { isNumber, isString, hasData } from '@/utils';
import { ErrorStatus } from './enum';
import { defaultErrorMessage } from './config';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import Button from '@/components/Button/Button';
import style from './ErrorBoundary.module.css';

/**
 * @description 错误边界, 处理 404 或组件内部错误
 */
export default function ErrorBoundary() {
  const navigate = useNavigate();

  const error: any = useRouteError();

  const isPageNotFound = hasData(error)
    ? isNumber(error.status) && error.status === ErrorStatus.NOT_FOUND
    : true;

  const message = isString(error)
    ? error
    : error && (error.statusText || error.message || defaultErrorMessage);

  const back = () => {
    navigate(-1);
  };

  const errorElement = (
    <div>
      <h1 className={style['title']}>An Error!</h1>

      <p className={style['error']}>{message}</p>
    </div>
  );

  return (
    <div className={style['error-boundary']}>
      {isPageNotFound ? <PageNotFound /> : errorElement}

      <Button type="primary" onClick={back}>
        返回上一页
      </Button>
    </div>
  );
}
