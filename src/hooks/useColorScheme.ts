import { useEffect, useCallback } from 'react';
import { setColorScheme } from '@/store/module/colorScheme';
import { useAppDispatch } from '@/store';

const query = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)'
};

export function useColorScheme() {
  const dispatch = useAppDispatch();

  const light = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      dispatch(setColorScheme('light'));
    }
  }, []);
  const dark = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      dispatch(setColorScheme('dark'));
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia(query.light).matches) {
      dispatch(setColorScheme('light'));
    } else if (window.matchMedia(query.dark).matches) {
      dispatch(setColorScheme('dark'));
    }

    window.matchMedia(query.light).addEventListener('change', light);
    window.matchMedia(query.dark).addEventListener('change', dark);

    return () => {
      window.matchMedia(query.light).removeEventListener('change', light);
      window.matchMedia(query.dark).removeEventListener('change', dark);
    };
  }, []);
}
