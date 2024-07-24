import React from 'react';
import {Point, Polygon} from 'geojson';
import {Polygon as LeafletPolygon, FeatureGroup, useMapEvents} from 'common/infrastructure/React-Leaflet';
import * as turf from '@turf/turf';
import {LatLng} from 'leaflet';

interface IDataPoint {
  col: number;
  row: number;
  point: Point;
}

interface IProps {
  nCols: number;
  nRows: number;
  colWidths?: number[];
  rowHeights?: number[];
  rotation: number;
  outline: Polygon;
  onHover?: (dataPoint: IDataPoint | null) => void;
  onClick?: (dataPoint: IDataPoint | null) => void;
}

const HoverDataLayer = ({nCols, nRows, colWidths, rowHeights, rotation, outline, onHover, onClick}: IProps) => {

  const getSelection = (latlng: LatLng): IDataPoint | null => {

    colWidths = colWidths || new Array(nCols).fill(1);
    const totalWidth = colWidths.reduce((acc, w) => acc + w, 0);
    colWidths = colWidths.map((w) => w / totalWidth);

    rowHeights = rowHeights || new Array(nRows).fill(1);
    const totalHeight = rowHeights.reduce((acc, h) => acc + h, 0);
    rowHeights = rowHeights.map((h) => h / totalHeight);

    const point = turf.point([latlng.lng, latlng.lat]);
    const polygon = turf.polygon(outline.coordinates);
    const centerOfPolygon = turf.centerOfMass(polygon);

    if (!turf.inside(point, polygon)) {
      return null;
    }

    const rotatedPolygonBbox = turf.bbox(turf.transformRotate(polygon, rotation, {pivot: centerOfPolygon.geometry.coordinates}));
    const rotatedPoint = turf.transformRotate(point, rotation, {pivot: centerOfPolygon.geometry.coordinates});

    const relativeDistanceX = (rotatedPoint.geometry.coordinates[0] - rotatedPolygonBbox[0]) / (rotatedPolygonBbox[2] - rotatedPolygonBbox[0]);
    const relativeDistanceY = (rotatedPolygonBbox[3] - rotatedPoint.geometry.coordinates[1]) / (rotatedPolygonBbox[3] - rotatedPolygonBbox[1]);

    if (0 > relativeDistanceX || 1 < relativeDistanceX || 0 > relativeDistanceY || 1 < relativeDistanceY) {
      return null;
    }

    let col = 0;
    let colSum = 0;
    for (let i = 0; i < nCols; i++) {
      colSum += colWidths[i];
      if (relativeDistanceX <= colSum) {
        col = i;
        break;
      }
    }

    let row = 0;
    let rowSum = 0;
    for (let i = 0; i < nRows; i++) {
      rowSum += rowHeights[i];
      if (relativeDistanceY <= rowSum) {
        row = i;
        break;
      }
    }

    return {col, row, point: point.geometry};
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
        positions={outline.coordinates[0].map((c) => [c[1], c[0]])}
        fill={false}
        weight={0}
        opacity={0}
        pmIgnore={true}
      />
    </FeatureGroup>
  );
};

export default HoverDataLayer;
export type {IDataPoint};
