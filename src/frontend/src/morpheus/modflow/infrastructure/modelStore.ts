import {IError} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {IModel} from '../types/Model.type';


type IModelState = 'initializing' | 'error' | 'loading' | 'loaded' | 'setup';

export interface IModelStoreState {
  model: IModel | null;
  modelState: IModelState;
  error: IError | null;
  loading: boolean;
}

const initialState: IModelStoreState = {
  model: null,
  modelState: 'initializing',
  loading: false,
  error: null,
};

export const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setModel: (state, action: PayloadAction<IModel>) => {
      state.model = action.payload;
      state.modelState = 'loaded';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.modelState = 'loading';
      }
    },
    setError: (state, action: PayloadAction<IError | null>) => {
      if (404 === action.payload?.code) {
        state.modelState = 'setup';
        return;
      }

      state.error = action.payload;
      if (action.payload) {
        state.modelState = 'error';
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {setModel, setLoading, setError} = modelSlice.actions;

export default modelSlice.reducer;
