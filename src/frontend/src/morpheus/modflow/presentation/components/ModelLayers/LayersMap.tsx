import React, {useEffect} from 'react';
import type {Polygon} from 'geojson';
import {FeatureGroup, Polygon as LeafletPolygon, useMap} from 'react-leaflet';
import {IMapRef, Map} from 'common/components/Map';
import * as L from 'leaflet';
import {MapRef} from 'common/components/Map/Map';


interface IProps {
  modelGeometry: Polygon | null
  mapRef: IMapRef
}

const LayersMap = ({modelGeometry}: IProps) => {
  const map = useMap();
  useEffect(() => {
    if (!modelGeometry) {
      return;
    }

    const layer = L.geoJSON(modelGeometry);
    map.fitBounds(layer.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelGeometry]);

  return (
    <FeatureGroup>
      {modelGeometry && (
        <LeafletPolygon
          pmIgnore={true}
          positions={modelGeometry.coordinates[0].map((c) => [c[1], c[0]])}
          fill={false}
          weight={1.5}
        />
      )}
    </FeatureGroup>
  );
};

const LayersMapWrapper = (props: IProps) => (
  <Map>
    <MapRef mapRef={props.mapRef}/>;
    <LayersMap {...props} />
  </Map>
);

export default LayersMapWrapper;
