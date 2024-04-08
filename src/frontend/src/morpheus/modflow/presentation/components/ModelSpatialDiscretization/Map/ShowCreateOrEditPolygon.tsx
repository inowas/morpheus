import * as L from 'leaflet';

import React, {useEffect, useRef} from 'react';

import type {Polygon} from 'geojson';
import {FeatureGroup, GeoJSON, useMap} from 'react-leaflet';
import {GeomanControls} from 'common/components/Map';


interface Props {
  editable?: boolean
  polygon?: Polygon
  onChange: (polygon: Polygon) => void
}

const ShowCreateOrEditPolygon = ({polygon, onChange, editable}: Props) => {
  const ref = useRef<L.FeatureGroup>(L.featureGroup());
  const map = useMap();


  const handleChange = () => {

    const layers = ref.current.getLayers();
    if (0 === layers.length) {
      return;
    }

    if (1 < layers.length) {
      throw new Error('More than one layer in FeatureGroup');
    }

    const featureGroup = layers[0] as L.FeatureGroup;
    const layer = featureGroup.getLayers()[0];
    if (layer instanceof L.Polygon) {
      const feature = layer.toGeoJSON();
      if (feature.geometry && 'Polygon' === feature.geometry.type) {
        console.log(feature.geometry as Polygon);
        onChange(feature.geometry as Polygon);
        map.fitBounds(layer.getBounds());
      }
    }
  };

  useEffect(() => {
    if (polygon) {
      const layer = L.geoJSON(polygon);
      map.fitBounds(layer.getBounds());
    }
  }, [polygon]);

  return (
    <FeatureGroup ref={ref}>
      {editable && <GeomanControls
        key={polygon ? 'edit' : 'create'}
        options={{
          position: 'topleft',
          drawText: false,
          drawMarker: false,
          drawCircle: false,
          cutPolygon: false,
          drawRectangle: false,
          drawPolygon: !polygon,
          drawCircleMarker: false,
          drawPolyline: false,
          editMode: !!polygon,
          removalMode: false,
        }}
        globalOptions={{
          continueDrawing: false,
          editable: false,
        }}
        onMount={() => L.PM.setOptIn(false)}
        onUnmount={() => L.PM.setOptIn(false)}
        onUpdate={handleChange}
      />}
      {polygon && <GeoJSON data={polygon}/>}
    </FeatureGroup>
  );
};

export default ShowCreateOrEditPolygon;
