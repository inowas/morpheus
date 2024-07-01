import {combineSlices} from '@reduxjs/toolkit';
import {assetsSlice} from './assetsStore';
import {modelSlice} from './modelStore';
import {privilegesSlice} from './privilegesStore';

const projectRootReducer = combineSlices({
  assets: assetsSlice.reducer,
  model: modelSlice.reducer,
  privileges: privilegesSlice.reducer,
});

export default projectRootReducer;
