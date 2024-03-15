import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-map.less';
import 'leaflet-smooth-wheel-zoom';

import {LatLngExpression, LatLngTuple} from 'leaflet';
import {MapContainer, Polygon, TileLayer} from 'react-leaflet';

import type {FeatureCollection} from 'geojson';
import Geoman from './Geoman';
import React, {useRef} from 'react';

interface IProps {
  editable: boolean;
  coords: LatLngTuple;
  geojson: FeatureCollection;
  onChangeGeojson: (geojson: FeatureCollection) => void;
}

const getPolygonCoordinates = (geoJSON: FeatureCollection): LatLngExpression[][][] => {
  const polygonCoordinates: LatLngExpression[][][] = [];
  for (const feature of geoJSON.features) {
    if ('Polygon' === feature.geometry.type) {
      const coordinates: LatLngExpression[] = feature.geometry.coordinates[0].map((coord) => [
        coord[1],
        coord[0],
        coord[2] || 0, // Add a default value for the third element if it's not present
      ]);
      polygonCoordinates.push([coordinates]);
    } else if ('MultiPolygon' === feature.geometry.type) {
      const multiPolygonCoordinates: LatLngExpression[][][] = feature.geometry.coordinates.map((polygonCoords) => {
        const coordinates: LatLngExpression[] = polygonCoords[0].map((coord) => [
          coord[1],
          coord[0],
          coord[2] || 0, // Add a default value for the third element if it's not present
        ]);
        return [coordinates];
      });
      polygonCoordinates.push(...multiPolygonCoordinates);
    }
  }
  return polygonCoordinates;
};

const Map = ({coords, geojson, onChangeGeojson, editable}: IProps) => {
  const redOptions = {color: 'red'};
  const polygonCoordinates = getPolygonCoordinates(geojson);

  const mapRef = useRef(null);


  // const geoOptions = {
  //   position: 'topleft',
  //   drawText: false,
  //   drawMarker: false,
  //   drawCircle: false,
  //   cutPolygon: false,
  //   drawRectangle: !(0 < geojson.features.length),
  //   drawPolygon: !(0 < geojson.features.length),
  //   drawCircleMarker: false,
  //   drawPolyline: false,
  //   editMode: false,}
  // }

  return (
    <MapContainer
      ref={mapRef}
      center={coords}
      zoom={13}
      style={{height: '100vh', width: '100%'}}
      scrollWheelZoom={false}
      wheelDebounceTime={100}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"/>
      {editable ? <Geoman geojson={geojson} onChangeGeojson={onChangeGeojson}/> : (
        polygonCoordinates.map((coordinates, index) => (
          <Polygon
            key={index}
            positions={coordinates[0]}
            pathOptions={redOptions}
          />
        ))
      )}
    </MapContainer>
  );
};

export default Map;
