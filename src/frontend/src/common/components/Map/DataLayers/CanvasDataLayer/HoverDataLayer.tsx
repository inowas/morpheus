import React from 'react';
import {Feature, Polygon} from 'geojson';
import {Polygon as LeafletPolygon, FeatureGroup, useMapEvents} from 'common/infrastructure/React-Leaflet';
import * as turf from '@turf/turf';
import {LatLng} from 'leaflet';

interface ISelection {
  col: number;
  row: number;
  value: number;
}

interface IProps {
  data: number[][];
  rotation: number;
  outline: Feature<Polygon>;
  onHover?: (selection: ISelection | null) => void;
  onClick?: (selection: ISelection | null) => void;
}

const HoverDataLayer = ({data, rotation, outline, onHover, onClick}: IProps) => {

  const getSelection = (latlng: LatLng): ISelection | null => {
    const nCols = data[0].length;
    const nRows = data.length;

    const point = turf.point([latlng.lng, latlng.lat]);
    const polygon = turf.polygon(outline.geometry.coordinates);
    const centerOfPolygon = turf.centerOfMass(polygon);

    if (!turf.inside(point, polygon)) {
      return null;
    }

    const rotatedPolygonBbox = turf.bbox(turf.transformRotate(polygon, rotation, {pivot: centerOfPolygon.geometry.coordinates}));
    const rotatedPoint = turf.transformRotate(point, rotation, {pivot: centerOfPolygon.geometry.coordinates});

    const x = (rotatedPoint.geometry.coordinates[0] - rotatedPolygonBbox[0]) / (rotatedPolygonBbox[2] - rotatedPolygonBbox[0]);
    const y = (rotatedPolygonBbox[3] - rotatedPoint.geometry.coordinates[1]) / (rotatedPolygonBbox[3] - rotatedPolygonBbox[1]);

    if (0 > x || 1 < x || 0 > y || 1 < y) {
      return null;
    }

    const col = Math.floor(x * nCols);
    const row = Math.floor(y * nRows);
    const value = data[row][col];

    return {col, row, value};
  };

  useMapEvents({
    click: (e) => {
      if (!onClick) {
        return;
      }

      onClick(getSelection(e.latlng));
    },
    mouseout: () => {
      if (!onHover) {
        return;
      }

      onHover(null);
    },
    mousemove: (e) => {
      if (!onHover) {
        return;
      }

      onHover(getSelection(e.latlng));
    },
  });

  return (
    <FeatureGroup>
      <LeafletPolygon
        key={JSON.stringify(outline)}
        positions={outline.geometry.coordinates[0].map((c) => [c[1], c[0]])}
        fill={false}
        weight={0}
        opacity={0}
        pmIgnore={true}
      />
    </FeatureGroup>
  );
};

export default HoverDataLayer;
