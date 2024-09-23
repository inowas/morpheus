import {combineSlices} from '@reduxjs/toolkit';

import {assetsSlice} from './assetsStore';
import {calculationsSlice} from './calculationsStore';
import {metadataSlice} from './metadataStore';
import {modelSlice} from './modelStore';
import {privilegesSlice} from './privilegesStore';

const projectRootReducer = combineSlices({
  assets: assetsSlice.reducer,
  model: modelSlice.reducer,
  calculations: calculationsSlice.reducer,
  privileges: privilegesSlice.reducer,
  metadata: metadataSlice.reducer,
});

export default projectRootReducer;
