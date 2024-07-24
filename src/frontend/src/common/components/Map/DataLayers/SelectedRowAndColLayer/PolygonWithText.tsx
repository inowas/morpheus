import React from 'react';
import {L} from 'common/infrastructure/Leaflet';
import {Marker, Polygon} from 'common/infrastructure/React-Leaflet';

interface IProps {
  coords: [number, number][];
  text: string;
}

const PolygonWithText = ({coords, text}: IProps) => {
  const center = L.polygon(coords).getBounds().getCenter();
  const content = L.divIcon({html: '<span>' + text + '</span>', className: 'leaflet-text-icon'});

  return (
    <Polygon
      positions={coords} weight={0}
      fillColor={'transparent'}
    >
      <Marker position={center} icon={content}/>
    </Polygon>
  );
};

export default PolygonWithText;
