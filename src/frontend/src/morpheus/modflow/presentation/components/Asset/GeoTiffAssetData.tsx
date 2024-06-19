import React from 'react';
import {IAssetRasterData} from '../../../types';
import {ImageRenderer} from 'common/components';

interface IProps {
  data: IAssetRasterData;
}


const GeoTiffAssetData = ({data}: IProps) => (
  <div>
    <p>RasterAssetData</p>
    <ImageRenderer data={data.data}/>
  </div>
);

export default GeoTiffAssetData;
