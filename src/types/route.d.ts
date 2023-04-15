import type {
  IndexRouteObject,
  NonIndexRouteObject,
  Route
} from 'react-router-dom';

declare namespace Route {
  /**
   * @description 自定义索引路由, 继承自 IndexRouteObject
   */
  interface CustomIndexRouteObject extends IndexRouteObject {
    /** page 标题 */
    title?: string;
    /** 封面图片 */
    image?: string;
    /** hover 动图 */
    gif?: string;
    children?: undefined;
  }

  /**
   * @description 自定义非索引路由, 继承自 NonIndexRouteObject
   */
  interface CustomNonIndexRouteObject extends NonIndexRouteObject {
    /** page 标题 */
    title?: string;
    /** 封面图片 */
    image?: string;
    /** hover 动图 */
    gif?: string;
    children?: CustomRouteObject[];
  }

  /** 自定义路由对象 */
  type CustomRouteObject = CustomIndexRouteObject | CustomNonIndexRouteObject;
}

export = Route;
export as namespace Route;
