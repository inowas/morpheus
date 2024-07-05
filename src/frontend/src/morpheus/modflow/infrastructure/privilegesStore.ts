import {IError, IProjectPrivileges} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';


export interface IPrivilegesStoreState {
  privileges: IProjectPrivileges | null;
  error: IError | null;
  loading: boolean;
}

const initialState: IPrivilegesStoreState = {
  privileges: null,
  loading: false,
  error: null,
};

export const privilegesSlice = createSlice({
  name: 'privileges',
  initialState,
  reducers: {
    setPrivileges: (state, action: PayloadAction<IProjectPrivileges>) => {
      state.privileges = action.payload;
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
export const {
  setPrivileges,
  setLoading,
  setError,
} = privilegesSlice.actions;

export default privilegesSlice.reducer;
