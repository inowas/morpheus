import React, {useEffect, useRef} from 'react';
import {FeatureGroup, useMap} from 'common/infrastructure/React-Leaflet';
import {L} from 'common/infrastructure/Leaflet';
import {GeomanControls} from 'common/components/Map';
import {IBoundaryType} from '../../../types/Boundaries.type';
import {LineString, Point, Polygon} from 'geojson';

interface IProps {
  boundaryType: IBoundaryType | null;
  onAddBoundary: (type: IBoundaryType, geometry: Point | Polygon | LineString) => void;
}

const isPointBoundary = (boundaryType: IBoundaryType | null) => {
  return 'well' === boundaryType;
};

const isLineBoundary = (boundaryType: IBoundaryType | null) => {
  if (!boundaryType) {
    return false;
  }
  return ['constant_head', 'drain', 'flow_and_head', 'general_head', 'river'].includes(boundaryType);
};

const isPolygonBoundary = (boundaryType: IBoundaryType | null) => {
  if (!boundaryType) {
    return false;
  }
  return ['recharge', 'evapotranspiration', 'lake'].includes(boundaryType);
};

const DrawBoundaryLayer = ({boundaryType, onAddBoundary}: IProps) => {

  const map = useMap();

  // onCreate handler is executed multiple times for the same layer, so we need to store the leaflet ids as reference
  // this is an ugly workaround, I have opened an issue in the geoman-react repository
  const alreadyAddedLayerIds = useRef<number[]>([]);

  // as it is not possible to pass the boundary type to the onCreate event, we need to store it in a ref
  const addBoundaryType = useRef<IBoundaryType | null>(null);

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

    // Attention: L.Polygon is inherited from L.Polyline
    // Because of this, the order of the if statements is important !!
    if (layer instanceof L.Polygon) {
      layer.pm.disable();
      const latLngs = layer.getLatLngs() as L.LatLng[][];
      const newGeometry: Polygon = {
        type: 'Polygon',
        coordinates: latLngs.map((latLng) => latLng.map((ll) => [ll.lng, ll.lat])),
      };

      onAddBoundary(addBoundaryType.current, newGeometry);
      alreadyAddedLayerIds.current.push(leafletId);
      return;
    }

    if (layer instanceof L.Polyline) {
      layer.pm.disable();
      const latLngs = layer.getLatLngs() as L.LatLng[];
      const newGeometry: LineString = {
        type: 'LineString',
        coordinates: latLngs.map((ll) => [ll.lng, ll.lat]),
      };
      onAddBoundary(addBoundaryType.current, newGeometry);
      alreadyAddedLayerIds.current.push(leafletId);
      return;
    }

    if (layer instanceof L.Marker) {
      layer.pm.disable();
      const latLng = layer.getLatLng() as L.LatLng;
      const newGeometry: Point = {
        type: 'Point',
        coordinates: [latLng.lng, latLng.lat],
      };
      onAddBoundary(addBoundaryType.current, newGeometry);
      alreadyAddedLayerIds.current.push(leafletId);
      map.pm.getGeomanLayers().forEach((l) => {
        l.remove();
      });
      return;
    }
  };

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
    if (!boundaryType) {
      map.pm.disableDraw();
      map.off('pm:create', handleCreate);
      map.pm.getGeomanLayers().forEach((layer) => {
        layer.remove();
      });
      return;
    }

    map.on('pm:create', handleCreate);
    addBoundaryType.current = boundaryType;

    if (isPointBoundary(boundaryType)) {
      map.pm.enableDraw('Marker', {
        snappable: true,
        snapDistance: 20,
        cursorMarker: true,
      });
    }

    if (isLineBoundary(boundaryType)) {
      map.pm.enableDraw('Line', {
        snappable: true,
        snapDistance: 20,
        cursorMarker: true,
      });
    }

    if (isPolygonBoundary(boundaryType)) {
      map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20,
        cursorMarker: true,
      });
    }
  }, [boundaryType]);

  if (null === boundaryType) {
    map.pm.disableDraw();
    return null;
  }

  return (
    <FeatureGroup>
      <GeomanControls
        key={boundaryType}
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


export default DrawBoundaryLayer;
