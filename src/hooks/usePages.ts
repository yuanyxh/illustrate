import { useState } from 'react';
import { routes } from '@/router';
import { RouteId } from '@/enum';

/**
 * @description 获取所有 page
 */
export const usePages = () => {
  const children = routes.find((page) => page.id === RouteId.SEQUEL)?.children;

  const [pages] = useState(
    (children || []).find((page) => page.id === RouteId.ERROR_BOUNDARY)
      ?.children || []
  );

  return pages.filter((page) => !page.hidden);
};
