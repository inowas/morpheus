import React from 'react';
import {IAssetShapefileData} from '../../../types';

interface IProps {
  data: IAssetShapefileData;
}


const ShapeFileAssetData = ({data}: IProps) => {
  return (
    <div>
      <p>ShapefileAssetData</p>
    </div>
  );
};

export default ShapeFileAssetData;
