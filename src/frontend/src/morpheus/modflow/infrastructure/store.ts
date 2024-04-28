import {combineSlices} from '@reduxjs/toolkit';
import {modelSlice} from './modelStore';
import {permissionsSlice} from './permissionsStore';

const projectRootReducer = combineSlices({
  model: modelSlice.reducer,
  permissions: permissionsSlice.reducer,
});

export default projectRootReducer;
