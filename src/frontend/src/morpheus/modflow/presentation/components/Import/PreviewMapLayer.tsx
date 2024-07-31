import React, {useEffect} from 'react';
import {GeoJSON, Polygon} from 'geojson';
import {L} from 'common/infrastructure/Leaflet';
import {useMap, FeatureGroup, GeoJSON as LeafletGeoJSON} from 'common/infrastructure/React-Leaflet';
import objectHash from 'object-hash';

interface IProps {
  item: GeoJSON;
  modelDomain: Polygon;
}

const PreviewMapLayer = ({item, modelDomain}: IProps) => {

  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    map.fitBounds(L.geoJSON(modelDomain).getBounds());
  }, [map, item, modelDomain]);


  return (
    <div style={{width: '100%', height: '100%'}}>
      <FeatureGroup>
        <LeafletGeoJSON key={objectHash(item)} data={item}/>
        {modelDomain && <LeafletGeoJSON key={objectHash(modelDomain)} data={modelDomain}/>}
      </FeatureGroup>
    </div>
  );
};

export default PreviewMapLayer;
