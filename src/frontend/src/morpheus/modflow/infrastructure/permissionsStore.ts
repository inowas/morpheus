import {IError, IProjectPermissions} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';


export interface IPermissionsStoreState {
  permissions: IProjectPermissions | null;
  error: IError | null;
  loading: boolean;
}

const initialState: IPermissionsStoreState = {
  permissions: null,
  loading: false,
  error: null,
};

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<IProjectPermissions>) => {
      state.permissions = action.payload;
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
  setPermissions,
  setLoading,
  setError,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
