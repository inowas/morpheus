import React, {useEffect, useRef} from 'react';
import {L} from 'common/infrastructure/Leaflet';
import {FeatureGroup, Polygon as LeafletPolygon, useMap} from 'common/infrastructure/React-Leaflet';

import type {Polygon} from 'geojson';
import {GeomanControls} from 'common/components/Map';
import {useMapEvents} from 'react-leaflet';


interface IProps {
  modelGeometry?: Polygon;
  onChangeModelGeometry?: (polygon: Polygon) => void;
  editModelGeometry?: boolean;
  fill?: boolean;
}


const ModelGeometryMapLayer = ({modelGeometry, onChangeModelGeometry, editModelGeometry, fill}: IProps) => {

  const editModelGeometryRef = useRef<L.FeatureGroup>(L.featureGroup());
  const map = useMap();

  useEffect(() => {
    if (!modelGeometry || !map) {
      return;
    }

    const layer = L.geoJSON(modelGeometry);
    map.fitBounds(layer.getBounds());
  }, [map, modelGeometry]);


  const handleChange = () => {
    const featureGroup = editModelGeometryRef.current as L.FeatureGroup;
    const layers = featureGroup.getLayers();

    if (0 === layers.length) {
      return;
    }

    if (1 < layers.length) {
      throw new Error('More than one layer in FeatureGroup');
    }

    const layer = layers[0] as L.Layer;
    if (layer instanceof L.Polygon) {
      const feature = layer.toGeoJSON();
      if (feature.geometry && 'Polygon' === feature.geometry.type) {
        if (onChangeModelGeometry) {
          onChangeModelGeometry(feature.geometry);
          map.fitBounds(layer.getBounds());
        }
      }
    }
  };

  return (
    <>
      <FeatureGroup ref={editModelGeometryRef}>
        {editModelGeometry && <GeomanControls
          key={modelGeometry ? 'edit_controls' : 'create_controls'}
          options={{
            position: 'topleft',
            drawText: false,
            drawMarker: false,
            drawCircle: false,
            cutPolygon: false,
            drawRectangle: false,
            drawPolygon: !modelGeometry,
            drawCircleMarker: false,
            drawPolyline: false,
            editMode: !!modelGeometry,
            removalMode: false,
          }}
          globalOptions={{
            continueDrawing: false,
            editable: true,
            draggable: true,
          }}
          onUpdate={handleChange}
        />}
        {modelGeometry && <LeafletPolygon
          key={editModelGeometry ? 'edit_geometry' : 'view_geometry'}
          positions={modelGeometry.coordinates[0].map((c) => [c[1], c[0]])}
          fill={fill}
          weight={editModelGeometry ? 2 : 1}
          opacity={editModelGeometry ? 1 : 0.5}
          pmIgnore={!editModelGeometry}
        />}
      </FeatureGroup>
    </>
  );
};

export default ModelGeometryMapLayer;
