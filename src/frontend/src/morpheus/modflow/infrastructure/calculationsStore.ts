import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {ICalculation, ICalculationId} from '../types/Calculation.type';


export interface ICalculationsStoreState {
  calculations: { [key: ICalculationId]: ICalculation };
  error: string | null;
  loading: boolean;
}

const initialState: ICalculationsStoreState = {
  calculations: {},
  loading: false,
  error: null,
};

export const calculationsSlice = createSlice({
  name: 'calculations',
  initialState,
  reducers: {
    setCalculation: (state, action: PayloadAction<ICalculation>) => {
      state.calculations[action.payload.calculation_id] = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCalculation,
  setLoading,
  setError,
} = calculationsSlice.actions;

export default calculationsSlice.reducer;
