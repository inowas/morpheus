import {configureStore} from '@reduxjs/toolkit';
import {calculationSlice} from './modules/calculation/infrastructure/store';

export const store = configureStore({
  reducer: {
    calculation: calculationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
