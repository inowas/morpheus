import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {IAsset, IAssetId, IError} from '../types';

interface IAssetLoading {
  list: boolean;
  asset: IAssetId | false;
  data: IAssetId | false;
  upload: boolean;
}

export interface IAssetsStoreState {
  assets: IAsset[];
  error: IError | null;
  loading: IAssetLoading;
}

const initialState: IAssetsStoreState = {
  assets: [],
  error: null,
  loading: {
    list: false,
    asset: false,
    data: false,
    upload: false,
  },
};

export const assetsSlice = createSlice({
  name: 'assets',
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
    setLoadingList: (state, action: PayloadAction<boolean>) => {
      state.loading.list = action.payload;
    },
    setLoadingAsset: (state, action: PayloadAction<IAssetId | false>) => {
      state.loading.asset = action.payload;
    },
    setLoadingData: (state, action: PayloadAction<IAssetId | false>) => {
      state.loading.data = action.payload;
    },
    setLoadingUpload: (state, action: PayloadAction<boolean>) => {
      state.loading.upload = action.payload;
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
  setLoadingAsset,
  setLoadingData,
  setLoadingList,
  setLoadingUpload,
  setError,
} = assetsSlice.actions;

export default assetsSlice.reducer;
