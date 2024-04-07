import {combineSlices} from '@reduxjs/toolkit';
import {modelSlice} from './modelStore';

const projectRootReducer = combineSlices({
  model: modelSlice.reducer,
});

export default projectRootReducer;
