import {ICalculation, IError} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface ICalculationResultSlice {
  calculation: ICalculation | null;
  loading: boolean;
  error: IError | null;
}

const initialState: ICalculationResultSlice = {
  calculation: null,
  loading: false,
  error: null,
};


export const calculationSlice = createSlice({
  name: 'calculation',
  initialState,
  reducers: {
    setCalculation: (state, action: PayloadAction<ICalculation>) => {
      state.calculation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<IError | null>) => {
      state.error = action.payload;
    },
  },
});

export const {setCalculation, setError, setLoading} = calculationSlice.actions;
export default calculationSlice.reducer;
