import {IAuthenticatedUser, IError, IUser} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface UserState {
  authenticatedUser: IAuthenticatedUser | null;
  users: IUser[];
  loading: boolean;
  error: IError | null;
}

const initialState: UserState = {
  users: [],
  authenticatedUser: null,
  loading: false,
  error: null,
};


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action: PayloadAction<IAuthenticatedUser | null>) => {
      state.authenticatedUser = action.payload;
    },
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
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
export const {setAuthenticatedUser, setUsers, setLoading, setError} = userSlice.actions;

export default userSlice.reducer;
