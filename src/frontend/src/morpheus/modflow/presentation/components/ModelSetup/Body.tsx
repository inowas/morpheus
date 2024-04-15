import React from 'react';
import type {Polygon} from 'geojson';
import {Map} from 'common/components/Map';
import ShowCreateOrEditPolygon from './Map';

interface IProps {
  polygon?: Polygon;
  onChange: (polygon: Polygon) => void;
  editable: boolean;
}

const Body = ({polygon, onChange, editable}: IProps) => (
  <Map>
    <ShowCreateOrEditPolygon
      polygon={polygon}
      onChange={onChange}
      editable={editable}
    />
  </Map>
);

export default Body;
