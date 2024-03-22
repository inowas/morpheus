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
    const layer = ref.current.getLayers().find((l) => l instanceof L.Polygon);
    if (layer instanceof L.Polygon) {
      const feature = layer.toGeoJSON();
      if (feature.geometry && 'Polygon' === feature.geometry.type) {
        onChange(feature.geometry as Polygon);
        map.fitBounds(layer.getBounds());
        ref.current.clearLayers();
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
        eventDebugFn={console.log}
        onCreate={handleChange}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={handleChange}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />}
      {polygon && <GeoJSON data={polygon}/>}
    </FeatureGroup>
  );
};

export default ShowCreateOrEditPolygon;
