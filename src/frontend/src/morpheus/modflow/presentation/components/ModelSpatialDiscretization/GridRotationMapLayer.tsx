import React, {useMemo} from 'react';
import {FeatureGroup, Polygon as LeafletPolygon, useMap} from 'common/infrastructure/React-Leaflet';
import {transformRotate, bbox, bboxPolygon, centerOfMass} from '@turf/turf';

import type {Polygon} from 'geojson';


interface IProps {
  modelGeometry: Polygon;
  rotation: number;
}


const GridRotationMapLayer = ({modelGeometry, rotation}: IProps) => {

  const map = useMap();

  // we need to calculate the rotated bounding box
  // this consists of the following steps:
  // 1. rotate the geometry in the opposite direction
  // 2. calculate the bounding box
  // 3. rotate the bounding box back
  const rotatedBoundingBox = useMemo(() => {
    const center = centerOfMass(modelGeometry);
    const rotatedGeometry = transformRotate(modelGeometry, rotation, {pivot: center});
    const boundingBox = bboxPolygon(bbox(rotatedGeometry));
    return transformRotate(boundingBox, -rotation, {pivot: center});
  }, [modelGeometry, rotation]);

  if (!map) {
    return null;
  }

  return (
    <FeatureGroup>
      <LeafletPolygon
        key={JSON.stringify(rotatedBoundingBox)}
        positions={rotatedBoundingBox.geometry.coordinates[0].map((c) => [c[1], c[0]])}
        fill={false}
        weight={1}
        opacity={1}
        pmIgnore={true}
      />
    </FeatureGroup>
  );
};

export default GridRotationMapLayer;
