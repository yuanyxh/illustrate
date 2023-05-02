import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { useThrottle } from './index';
import { BREAK_POINT } from '@/config';
import { setSmallScreen } from '@/store/module/screen';

export const useScreen = () => {
  const isSmallScreen = useAppSelector((state) => state.screen.isSmallScreen);
  const dispatch = useAppDispatch();

  const resize = useThrottle(() => {
    dispatch(setSmallScreen(window.innerWidth < BREAK_POINT));
  });

  useEffect(() => {
    window.addEventListener('resize', resize);

    return () => window.addEventListener('resize', resize);
  }, []);

  return isSmallScreen;
};
