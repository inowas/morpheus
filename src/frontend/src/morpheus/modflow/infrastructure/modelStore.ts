import {IError, ISpatialDiscretization, ITimeDiscretization} from '../types';

import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {IBoundary} from '../types/Boundaries.type';
import {ILayer} from '../types/Layers.type';
import {IModel} from '../types/Model.type';
import {IObservation} from '../types/Observations.type';

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
    setSpatialDiscretization: (state, action: PayloadAction<ISpatialDiscretization>) => {
      if (state.model) {
        state.model.spatial_discretization = action.payload;
      }
    },
    setTimeDiscretization: (state, action: PayloadAction<ITimeDiscretization>) => {
      if (state.model) {
        state.model.time_discretization = action.payload;
      }
    },
    setLayers: (state, action: PayloadAction<ILayer[]>) => {
      if (state.model) {
        state.model.layers = action.payload;
      }
    },
    setBoundaries: (state, action: PayloadAction<IBoundary[]>) => {
      if (state.model) {
        state.model.boundaries = action.payload;
      }
    },
    updateBoundary: (state, action: PayloadAction<IBoundary>) => {
      if (state.model) {
        state.model.boundaries = state.model.boundaries.map((b) => {
          if (b.id === action.payload.id) {
            return action.payload;
          }
          return b;
        });
      }
    },
    setHeadObservations: (state, action: PayloadAction<IObservation[]>) => {
      if (state.model) {
        state.model.observations = action.payload;
      }
    },
    addOrUpdateHeadObservation: (state, action: PayloadAction<IObservation>) => {
      if (state.model) {
        if (state.model.observations.find((o) => o.id === action.payload.id)) {
          state.model.observations = state.model.observations.map((o) => {
            if (o.id === action.payload.id) {
              return action.payload;
            }
            return o;
          });
          return;
        }
        state.model.observations.push(action.payload);
      }
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
export const {
  setModel,
  setSpatialDiscretization,
  setTimeDiscretization,
  setLayers,
  setBoundaries,
  setLoading,
  setHeadObservations,
  setError,
  updateBoundary,
  addOrUpdateHeadObservation,
} = modelSlice.actions;

export default modelSlice.reducer;
