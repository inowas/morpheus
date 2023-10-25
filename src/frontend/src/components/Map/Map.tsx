import React from 'react';
import {FeatureGroup, LayersControl, MapContainer, Polygon, Popup, TileLayer} from 'react-leaflet';
import {LatLngExpression, LatLngTuple} from 'leaflet';
import Geoman from './Geoman';

import type {FeatureCollection} from 'geojson';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';

interface IProps {
  editable: boolean;
  coords: LatLngTuple;
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}

const getPolygonCoordinates = (geoJSON: FeatureCollection): LatLngExpression[][] => {
  const polygonCoordinates: LatLngExpression[][] = [];
  for (const feature of geoJSON.features) {
    if ('Polygon' === feature.geometry.type) {
      const coordinates: LatLngExpression[] = feature.geometry.coordinates[0].map((coord) => [
        coord[1],
        coord[0],
      ]);
      polygonCoordinates.push(coordinates);
    }
  }
  return polygonCoordinates;
};

const Map = ({coords, geojson, setGeojson, editable}: IProps) => {
  const redOptions = {color: 'red'};
  const polygonCoordinates = getPolygonCoordinates(geojson);
  console.log(geojson);

  return (
    <MapContainer
      center={coords} zoom={13}
      style={{height: '100vh', width: '100%'}}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />
      {editable ? (
        <Geoman geojson={geojson} setGeojson={setGeojson}/>
      ) : (
        <LayersControl position="bottomright">
          {polygonCoordinates.map((coordinates, index) => (
            <LayersControl.Overlay
              checked={true}
              key={index}
              name={`Feature group ${index + 1}`}
            >
              <FeatureGroup pathOptions={{color: 'purple'}}>
                <Popup>Popup in FeatureGroup</Popup>
                <Polygon positions={coordinates} pathOptions={redOptions}/>
              </FeatureGroup>
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      )}
    </MapContainer>
  );
};

export default Map;
