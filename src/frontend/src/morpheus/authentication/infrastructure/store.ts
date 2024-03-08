import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {IOAuthToken, IError} from '../types';

export interface IAuthenticationState {
  token: IOAuthToken | null;
  loading: boolean;
  error: IError | null;
}

const initialState: IAuthenticationState = {
  token: null,
  loading: false,
  error: null,
};


export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<IOAuthToken | null>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<IError | null>) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setToken, setLoading, setError} = authenticationSlice.actions;

export default authenticationSlice.reducer;
