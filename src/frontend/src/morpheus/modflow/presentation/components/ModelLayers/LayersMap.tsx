import React, {useEffect} from 'react';
import {FeatureGroup, Polygon as LeafletPolygon, useMap} from 'react-leaflet';
import {IMapRef, Map} from 'common/components/Map';
import * as L from 'leaflet';
import {MapRef} from 'common/components/Map/Map';
import {ISpatialDiscretization} from '../../../types';


interface IProps {
  spatialDiscretization: ISpatialDiscretization;
  mapRef: IMapRef
}

const LayersMap = ({spatialDiscretization}: IProps) => {
  const map = useMap();
  useEffect(() => {
    if (!spatialDiscretization) {
      return;
    }

    const layer = L.geoJSON(spatialDiscretization.geometry);
    map.fitBounds(layer.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spatialDiscretization.geometry]);

  return (
    <FeatureGroup>
      {spatialDiscretization && (
        <LeafletPolygon
          pmIgnore={true}
          positions={spatialDiscretization.geometry.coordinates[0].map((c) => [c[1], c[0]])}
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
