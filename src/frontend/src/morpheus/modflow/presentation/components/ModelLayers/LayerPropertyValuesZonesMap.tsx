import React from 'react';
import type {GeoJsonObject, MultiPolygon, Polygon} from 'geojson';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import * as L from 'leaflet';
import {GeomanControls} from 'common/components/Map';
import {IAffectedCells} from '../../../types';

interface IZone {
  zone_id?: string;
  name: string;
  affected_cells?: IAffectedCells;
  geometry: Polygon | MultiPolygon;
  value: number;
}

interface IGeoJsonFeature extends GeoJsonObject {
  type: 'Feature';
  properties: {
    key: number;
    zone_id?: string;
    name: string;
    value: number;
  };
  geometry: Polygon | MultiPolygon;
}

interface IProps {
  zones: IZone[];
  onChange: (zones: IZone[]) => void;
  readOnly: boolean;
}


const LayerPropertyValuesZonesMap = ({zones, onChange, readOnly}: IProps) => {

  const handleChange = (e: any) => {
    const layer = e.layer as L.Polygon;

    // Security check
    if (!(layer instanceof L.Polygon)) {
      return;
    }

    const feature = layer.feature as IGeoJsonFeature;
    const zoneId = feature.properties.zone_id;
    const latLngs = layer.getLatLngs() as L.LatLng[][];

    const newGeometry: Polygon = {
      type: 'Polygon',
      coordinates: latLngs.map((latLng) => latLng.map((ll) => [ll.lng, ll.lat])),
    };

    onChange(zones.map((zone, idx) => {
      if (zone.zone_id === zoneId) {
        return {...zone, geometry: newGeometry, affected_cells: undefined};
      }
      return zone;
    }));
  };

  const handleCreate = (e: any) => {
    const layer = e.layer as L.Polygon;
    if (!(layer instanceof L.Polygon)) {
      return;
    }

    const latLngs = layer.getLatLngs() as L.LatLng[][];
    const newGeometry: Polygon = {
      type: 'Polygon',
      coordinates: latLngs.map((latLng) => latLng.map((ll) => [ll.lng, ll.lat])),
    };

    const newZone: IZone = {
      name: `New Zone ${zones.length + 1}`,
      geometry: newGeometry,
      value: 1,
    };

    onChange([...zones, newZone]);
  };

  const getZoneFeatureFromZone = (zone: IZone, key: number): IGeoJsonFeature => ({
    'type': 'Feature',
    'properties': {
      'key': key,
      'zone_id': zone.zone_id,
      'name': zone.name,
      'value': zone.value,
    },
    'geometry': zone.geometry,
  });

  return (
    <FeatureGroup key={JSON.stringify(zones)}>
      {!readOnly && <GeomanControls
        key={Math.random()}
        options={{
          position: 'topleft',
          drawText: false,
          drawMarker: false,
          drawCircle: false,
          cutPolygon: false,
          drawRectangle: false,
          drawPolygon: true,
          drawCircleMarker: false,
          drawPolyline: false,
          editMode: true,
          dragMode: false,
          rotateMode: false,
          removalMode: false,
        }}
        globalOptions={{
          continueDrawing: false,
          editable: true,
          draggable: true,
        }}
        onMount={() => L.PM.setOptIn(false)}
        //onUnmount={() => L.PM.setOptIn(true)}
        onUpdate={handleChange}
        onCreate={handleCreate}
      />}

      {zones.map((zone, idx) => {
        return (
          <GeoJSON
            key={JSON.stringify(zone)}
            data={getZoneFeatureFromZone(zone, idx)}
            eventHandlers={{
              click: () => {
                console.log('click');
              },
            }}
            pathOptions={{
              weight: 2,
              color: 'red',
              fillOpacity: 0,
            }}
          />
        );
      })}
    </FeatureGroup>
  );
};

export default LayerPropertyValuesZonesMap;
