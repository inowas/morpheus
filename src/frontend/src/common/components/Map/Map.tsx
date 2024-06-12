import {L, LatLngTuple} from 'common/infrastructure/Leaflet';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';

import React, {useEffect, useRef} from 'react';
import {createLeafletContext, LeafletContext} from '@react-leaflet/core';

interface IProps {
  center?: LatLngTuple;
  zoom?: number;
  children?: React.ReactNode[] | React.ReactNode;
  mapRef?: IMapRef;
}

export type IMapRef = React.MutableRefObject<null | L.Map>;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

interface IMapFromMapRef {
  mapRef: IMapRef;
  children: React.ReactNode;
}

const LeafletMapProvider = ({mapRef, children}: IMapFromMapRef) => {
  const map = mapRef.current;
  if (!map) {
    return null;
  }

  return (
    <LeafletContext.Provider value={createLeafletContext(mapRef.current!)}>
      {children}
    </LeafletContext.Provider>
  );
};


const defaultCenter: LatLngTuple = [51.05, 13.71];
const defaultZoom = 13;

const Map = ({center, zoom, children}: IProps) => {
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

  return (
    <div ref={containerRef} style={{height: '100%', width: '100%'}}>
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        style={{height: '100%', width: '100%'}}
        scrollWheelZoom={false}
        wheelDebounceTime={100}
      >
        <MapRef mapRef={mapRef}/>;
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"/>
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;

export {LeafletMapProvider, MapRef};
