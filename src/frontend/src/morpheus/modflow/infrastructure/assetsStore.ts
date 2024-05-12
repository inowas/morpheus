import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {IAsset, IError} from '../types';


export interface IPermissionsStoreState {
  assets: IAsset[];
  error: IError | null;
  loading: boolean;
}

const initialState: IPermissionsStoreState = {
  assets: [],
  loading: false,
  error: null,
};

export const assetsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<IAsset[]>) => {
      state.assets = action.payload;
    },
    updateAsset: (state, action: PayloadAction<IAsset>) => {
      state.assets = state.assets.map(asset => asset.asset_id === action.payload.asset_id ? action.payload : asset);
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(asset => asset.asset_id !== action.payload);
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
  setAssets,
  removeAsset,
  updateAsset,
  setLoading,
  setError,
} = assetsSlice.actions;

export default assetsSlice.reducer;
