import {IError, IUser} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface UserState {
  users: IUser[];
  loading: boolean;
  error: IError | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
export const {setUsers, setLoading, setError} = userSlice.actions;

export default userSlice.reducer;
