import React, {useEffect} from 'react';
import {Polygon} from 'geojson';
import {L} from 'common/infrastructure/Leaflet';
import {useMap, FeatureGroup, GeoJSON as LeafletGeoJSON} from 'common/infrastructure/React-Leaflet';
import objectHash from 'object-hash';
import {IAssetShapefileData} from '../../../types';

interface IProps {
  data: IAssetShapefileData;
  modelDomain?: Polygon;
}

const ShapeFileAssetDataLayer = ({data, modelDomain}: IProps) => {

  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    if (0 === data.data.features.length) {
      return;
    }

    const dataLayerBounds = L.geoJSON(data.data).getBounds();

    if (!modelDomain) {
      map.fitBounds(dataLayerBounds);
      return;
    }

    const modelDomainBounds = L.geoJSON(modelDomain).getBounds();
    const extendedBounds = modelDomainBounds.extend(dataLayerBounds);

    map.fitBounds(extendedBounds);
  }, [map, data, modelDomain]);


  return (
    <div style={{width: '100%', height: '100%'}}>
      <FeatureGroup>
        <LeafletGeoJSON key={objectHash(data)} data={data.data}/>
        {modelDomain && <LeafletGeoJSON key={objectHash(modelDomain)} data={modelDomain}/>}
      </FeatureGroup>
    </div>
  );
};

export default ShapeFileAssetDataLayer;
