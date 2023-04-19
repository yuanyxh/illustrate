import { createSlice } from '@reduxjs/toolkit';
import { BREAK_POINT } from '@/config/index';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ScreenState {
  isSmallScreen: boolean;
}

const initialState: ScreenState = {
  isSmallScreen: window.innerWidth < BREAK_POINT
};

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setSmallScreen(state, actions: PayloadAction<boolean>) {
      state.isSmallScreen = actions.payload;
    }
  }
});

export const { setSmallScreen } = screenSlice.actions;

export default screenSlice.reducer;
