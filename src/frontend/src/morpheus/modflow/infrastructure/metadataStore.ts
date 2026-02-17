import {IError, IMetadata} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface IModelStoreState {
  metadata: IMetadata | null;
  error: IError | null;
  loading: boolean;
}

const initialState: IModelStoreState = {
  metadata: null,
  loading: false,
  error: null,
};

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    clear: () => initialState,
    setMetadata: (state, action: PayloadAction<IMetadata>) => {
      state.metadata = action.payload;
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
  setMetadata,
  setLoading,
  setError,
  clear,
} = metadataSlice.actions;

export default metadataSlice.reducer;
