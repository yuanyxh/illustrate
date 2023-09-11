import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';
import { ScrollRestoration, useLocation, useMatch } from 'react-router-dom';
import CONFIG from '@/config';
import { routes } from '@/router';
import { useScreen, useColorScheme } from '@/hooks';
import { isEmpty } from '@/utils';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './Main';
import style from './Layout.module.css';

export const ScreenContext = createContext(false);

const map = new Map<string, string>();

/**
 * @description 网站整体布局
 */
export default function Layout() {
  const [visibleSide, setVisibleSide] = useState(false);
  const isSmallScreen = useScreen();
  const location = useLocation();
  const match = useMatch(location.pathname);

  const toggle = useCallback(
    (payload: boolean) => setVisibleSide(() => payload),
    []
  );

  useMemo(() => {
    if (isSmallScreen) {
      window.document.documentElement.setAttribute('screen', 'small');
    } else {
      window.document.documentElement.removeAttribute('screen');
    }
  }, [isSmallScreen]);

  useEffect(() => {
    if (isEmpty(match)) {
      window.document.title = CONFIG.PROJECT_NAME;
    } else {
      if (map.has(match.pattern.path)) {
        window.document.title =
          map.get(match.pattern.path) || CONFIG.PROJECT_NAME;
      } else {
        const paths = match.pattern.path
          .split('/')
          .filter((path) => path.trim() !== '');

        const title = resolve(findRoute(paths, routes.slice(0)));
        window.document.title = title;

        map.set(match.pattern.path, title);
      }
    }

    return () => {
      window.document.title = CONFIG.PROJECT_NAME;
    };
  }, [match]);

  useColorScheme();

  const resolve = (title: string) => {
    if (title.trim() !== '') {
      return `${title} | ${CONFIG.PROJECT_NAME}`;
    }

    return CONFIG.PROJECT_NAME;
  };

  const findRoute = (
    paths: string[],
    target: Route.CustomRouteObject[] | undefined
  ): string => {
    const path = paths.shift();

    if (isEmpty(target) || isEmpty(path)) return '';

    for (let i = 0; i < target.length; i++) {
      const fined = target[i].path === path || target[i].path === `/${path}`;

      if (fined) {
        if (paths.length === 0) {
          return target[i].title || '';
        } else {
          target = target[i].children;
          return findRoute(paths, target);
        }
      }
    }

    for (let i = 0; i < target.length; i++) {
      const children = target[i].children;
      const result = findRoute([path], children);

      if (result !== '') {
        return result;
      }
    }

    return '';
  };

  return (
    <ScreenContext.Provider value={isSmallScreen}>
      <div className={style.layout}>
        <Navbar toggle={toggle} />
        <Sidebar visibleSide={visibleSide} toggle={toggle} />
        <Main />
      </div>

      <ScrollRestoration getKey={(location) => location.pathname} />
    </ScreenContext.Provider>
  );
}
