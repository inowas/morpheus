import React, {useEffect, useRef} from 'react';
import {FeatureGroup, useMap} from 'common/infrastructure/React-Leaflet';
import {L} from 'common/infrastructure/Leaflet';
import {GeomanControls} from 'common/components/Map';
import {Point} from 'geojson';
import {IObservationType} from '../../../types/HeadObservations.type';

interface IProps {
  observationType: IObservationType | null;
  onAdd: (type: IObservationType, geometry: Point) => void;
}

const DrawObservationLayer = ({observationType, onAdd}: IProps) => {

  const map = useMap();

  // onCreate handler is executed multiple times for the same layer, so we need to store the leaflet ids as reference
  // this is an ugly workaround, I have opened an issue in the geoman-react repository
  const alreadyAddedLayerIds = useRef<number[]>([]);

  // as it is not possible to pass the boundary type to the onCreate event, we need to store it in a ref
  const addBoundaryType = useRef<IObservationType | null>(null);

  useEffect(() => {
    alreadyAddedLayerIds.current = [];
    addBoundaryType.current = null;

    return () => {
      map.off('pm:create', handleCreate);
      map.pm.getGeomanLayers().forEach((layer) => {
        layer.remove();
      });
    };

  }, []);

  useEffect(() => {
    if (!observationType) {
      map.pm.disableDraw();
      map.off('pm:create', handleCreate);
      map.pm.getGeomanLayers().forEach((layer) => {
        layer.remove();
      });
      return;
    }

    map.on('pm:create', handleCreate);
    addBoundaryType.current = observationType;

    map.pm.enableDraw('Marker', {
      snappable: true,
      snapDistance: 20,
      cursorMarker: true,
    });

  }, [observationType]);

  const handleCreate = (e: any) => {

    const layer = e.layer;
    const leafletId = layer?._leaflet_id;

    if (null === addBoundaryType.current) {
      return;
    }

    // there is a strange behavior with geoman that triggers the onCreate event multiple times
    // for the same layer. This is a workaround to prevent adding the same layer multiple times
    if (!leafletId || alreadyAddedLayerIds.current.includes(leafletId)) {
      return;
    }

    if (layer instanceof L.Marker) {
      layer.pm.disable();
      const latLng = layer.getLatLng() as L.LatLng;
      const newGeometry: Point = {
        type: 'Point',
        coordinates: [latLng.lng, latLng.lat],
      };
      onAdd(addBoundaryType.current, newGeometry);
      alreadyAddedLayerIds.current.push(leafletId);
      map.pm.getGeomanLayers().forEach((layer) => {
        layer.remove();
      });
      return;
    }
  };

  if (null === observationType) {
    map.pm.disableDraw();
    return null;
  }

  return (
    <FeatureGroup>
      <GeomanControls
        key={observationType}
        options={{
          position: 'topleft',
          drawText: false,
          drawMarker: false,
          drawCircle: false,
          cutPolygon: false,
          drawRectangle: false,
          drawPolygon: false,
          drawCircleMarker: false,
          drawPolyline: false,
          editMode: false,
          dragMode: false,
          rotateMode: false,
          removalMode: false,
        }}
        globalOptions={{
          continueDrawing: false,
          editable: false,
          draggable: false,
        }}
      />
    </FeatureGroup>
  );
};


export default DrawObservationLayer;
