import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet-map.less';
import 'leaflet-smooth-wheel-zoom';

import {LatLngExpression, LatLngTuple} from 'leaflet';
import {MapContainer, Polygon, TileLayer, useMap} from 'react-leaflet';

import type {FeatureCollection} from 'geojson';
import GeomanExample from './GeomanExample';
import React, {useEffect, useRef} from 'react';

interface IProps {
  style?: React.CSSProperties;
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
    }

    if ('MultiPolygon' === feature.geometry.type) {
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

interface IMapEffectProps {
  mapRef: React.MutableRefObject<null | L.Map>;
}

const MapRef = ({mapRef}: IMapEffectProps) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      mapRef.current = map;
    }
    return () => {
      mapRef.current = null;
    };
  }, [map]);

  return null;
};

const MapExample = ({coords, geojson, onChangeGeojson, editable, style}: IProps) => {
  const redOptions = {color: 'red'};
  const polygonCoordinates = getPolygonCoordinates(geojson);

  const mapRef = useRef<null | L.Map>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const resizeObserver = new ResizeObserver(() => {
      const map = mapRef.current;
      if (map) {
        map.invalidateSize();
      }
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);


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
    <div ref={containerRef} style={{height: '100%', width: '100%', ...style}}>
      <MapContainer
        center={coords}
        zoom={13}
        style={{height: '100%', width: '100%'}}
        scrollWheelZoom={false}
        wheelDebounceTime={100}
      >
        <MapRef mapRef={mapRef}/>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"/>
        {editable ? <GeomanExample geojson={geojson} onChangeGeojson={onChangeGeojson}/> : (
          polygonCoordinates.map((coordinates, index) => (
            <Polygon
              key={index}
              positions={coordinates[0]}
              pathOptions={redOptions}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default MapExample;
