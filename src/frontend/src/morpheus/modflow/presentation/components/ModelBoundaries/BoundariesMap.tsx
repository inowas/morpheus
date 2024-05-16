import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

import React, {useEffect, useRef} from 'react';
import {FeatureGroup, LayerGroup, Polygon as LeafletPolygon, useMap} from 'react-leaflet';
import {GeomanControls, IMapRef, Map} from 'common/components/Map';
import {MapRef} from 'common/components/Map/Map';
import {ISpatialDiscretization} from '../../../types';
import {IBoundaryType} from "../../../types/Boundaries.type";
import {LineString, Point, Polygon} from "geojson";


interface IProps {
  spatialDiscretization: ISpatialDiscretization;
  addBoundary: IBoundaryType | null;
  onAddBoundary: (type: IBoundaryType, geometry: Point | Polygon | LineString) => void;
  mapRef: IMapRef
}

const isPointBoundary = (boundary: IBoundaryType | null) => {
  return boundary === 'well';
}

const isLineBoundary = (boundary: IBoundaryType | null) => {
  if (!boundary) {
    return false;
  }
  return ['constant_head', 'drain', 'flow_and_head', 'general_head', 'river'].includes(boundary);
}

const isPolygonBoundary = (boundary: IBoundaryType | null) => {
  if (!boundary) {
    return false;
  }
  return ['recharge', 'evapotranspiration', 'lake'].includes(boundary);
}

const BoundariesMap = ({spatialDiscretization, addBoundary, onAddBoundary}: IProps) => {
  const map = useMap();

  // onCreate handler is executed multiple times for the same layer, so we need to store the leaflet ids as reference
  // this is an ugly workaround, I have opened an issue in the geoman-react repository
  const alreadyAddedLayerIds = useRef<number[]>([]);

  // as it is not possible to pass the boundary type to the onCreate event, we need to store it in a ref
  const addBoundaryType = useRef<IBoundaryType | null>(null);

  useEffect(() => {
    if (!spatialDiscretization) {
      return;
    }

    const layer = L.geoJSON(spatialDiscretization.geometry);
    map.fitBounds(layer.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spatialDiscretization.geometry]);

  useEffect(() => {

    map.on('pm:create', (e) => {
      console.log('pm:create', e)
    });

    if (!addBoundary) {
      return;
    }

    addBoundaryType.current = addBoundary;

    if (isPointBoundary(addBoundary)) {
      map.pm.enableDraw('Marker', {
        snappable: true,
        snapDistance: 20,
        cursorMarker: true,
      });
    }

    if (isLineBoundary(addBoundary)) {
      map.pm.enableDraw('Line', {
        snappable: true,
        snapDistance: 20,
        cursorMarker: true,
      });
    }

    if (isPolygonBoundary(addBoundary)) {
      map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20,
        cursorMarker: true,
      });
    }

    map.pm.getGeomanLayers().forEach((layer) => {
      layer.remove();
    })

  }, [addBoundary]);

  const handleOnMount = () => {
    L.PM.setOptIn(false);
  }

  const handleCreate = (e: any) => {

    const layer = e.layer;
    const leafletId = layer?._leaflet_id;

    if (addBoundaryType.current === null) {
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
      const latLng = layer.getLatLng() as L.LatLng;
      const newGeometry: Point = {
        type: 'Point',
        coordinates: [latLng.lng, latLng.lat],
      };
      onAddBoundary(addBoundaryType.current, newGeometry);
      alreadyAddedLayerIds.current.push(leafletId);
      return;
    }
  };

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

      {addBoundary && (
        <LayerGroup>
          <GeomanControls
            key={Math.random()}
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
            onMount={handleOnMount}
            onCreate={handleCreate}
          />
        </LayerGroup>
      )}
    </FeatureGroup>
  );
};

const BoundariesMapWrapper = (props: IProps) => (
  <Map>
    <MapRef mapRef={props.mapRef}/>;
    <BoundariesMap {...props} />
  </Map>
);

export default BoundariesMapWrapper;
