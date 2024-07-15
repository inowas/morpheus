import React from 'react';
import {Point} from 'geojson';
import {CircleMarker as LeafletCircleMarker, FeatureGroup, Tooltip} from 'common/infrastructure/React-Leaflet';
import {Pane} from 'react-leaflet';

interface ILabelledPoint {
  key: string | number;
  point: Point;
  label: string;
  color: string;
}

interface IProps {
  points: ILabelledPoint[]
  onClick: (point: ILabelledPoint) => void;
}

const LabelledPointsLayer = ({points, onClick}: IProps) => {

  return (
    <Pane name={'labelled-points-layer'}>
      <FeatureGroup>
        {points.map(point => (
          <LeafletCircleMarker
            key={point.key}
            center={[point.point.coordinates[1], point.point.coordinates[0]]}
            radius={7}
            color={point.color}
            fillColor={point.color}
            weight={1}
            fillOpacity={1}
            bubblingMouseEvents={true}
            eventHandlers={{
              click: () => onClick && onClick(point),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -5]}
              opacity={1}
              permanent={true}
            >
              {point.label}
            </Tooltip>
          </LeafletCircleMarker>
        ))}
      </FeatureGroup>
    </Pane>
  );
};

export default LabelledPointsLayer;
