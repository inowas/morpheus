import {calculationSlice} from './modules/calculation/infrastructure/store';
import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    calculation: calculationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
