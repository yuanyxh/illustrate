import { useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import screenReducer from './module/screen';
import colorSchemeReducer from './module/colorScheme';
import type { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    screen: screenReducer,
    colorScheme: colorSchemeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
