import {combineSlices} from '@reduxjs/toolkit';
import {assetsSlice} from './assetsStore';
import {modelSlice} from './modelStore';
import {permissionsSlice} from './permissionsStore';

const projectRootReducer = combineSlices({
  assets: assetsSlice.reducer,
  model: modelSlice.reducer,
  permissions: permissionsSlice.reducer,
});

export default projectRootReducer;
