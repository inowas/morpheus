import {L} from 'common/infrastructure/Leaflet';
import React, {useEffect} from 'react';
import {FeatureGroup, GeoJSON as LeafletGeoJSON, useMap} from 'common/infrastructure/React-Leaflet';
import type {GeoJSON} from 'geojson';
import objectHash from 'object-hash';

interface IProps {
  geoJson: GeoJSON;
}

const GeoJsonLayer = ({geoJson}: IProps) => {
  const map = useMap();
  useEffect(() => {
    if (!geoJson || !map) {
      return;
    }

    map.fitBounds(L.geoJSON(geoJson).getBounds());
  }, [geoJson, map]);

  return (
    <FeatureGroup>
      <LeafletGeoJSON key={objectHash(geoJson)} data={geoJson}/>
    </FeatureGroup>
  );
};

export default GeoJsonLayer;
