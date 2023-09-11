import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ColorScheme {
  colorScheme: 'light' | 'dark';
}

const initialState: ColorScheme = {
  colorScheme: 'light'
};

export const colorSchemeSlice = createSlice({
  name: 'colorScheme',
  initialState,
  reducers: {
    setColorScheme(state, actions: PayloadAction<ColorScheme['colorScheme']>) {
      state.colorScheme = actions.payload;

      window.document.documentElement.className = actions.payload;
    }
  }
});

export const { setColorScheme } = colorSchemeSlice.actions;

export default colorSchemeSlice.reducer;
