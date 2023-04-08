import { useState } from 'react';
import { routes } from '@/router';
import { RouteId } from '@/enum';

/**
 * @description 获取所有 page
 */
export function usePages() {
  const children = routes.find((page) => page.id === RouteId.SEQUEL)?.children;

  const [pages] = useState(
    (children || []).find((page) => page.id === RouteId.ERRORBOUNDARY)
      ?.children || []
  );

  return pages;
}
