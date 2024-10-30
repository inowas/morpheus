import {L, LatLngTuple} from 'common/infrastructure/Leaflet';
import {LayersControl, MapContainer, TileLayer, useMap} from 'react-leaflet';

import React, {useEffect, useRef} from 'react';
import {createLeafletContext, LeafletContext} from '@react-leaflet/core';

interface IProps {
  boxZoom?: boolean;
  center?: LatLngTuple;
  doubleClickZoom?: boolean;
  dragging?: boolean;
  touchZoom?: boolean;
  scrollWheelZoom?: boolean;
  zoom?: number;
  zoomControl?: boolean;
  children?: React.ReactNode[] | React.ReactNode;
  mapRef?: IMapRef;
  style?: React.CSSProperties;
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

const Map = ({center, zoom, children, boxZoom = true, dragging = true, zoomControl = true, doubleClickZoom = true, scrollWheelZoom = true, touchZoom = true, style}: IProps) => {
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
        style={{height: '100%', width: '100%', ...style}}
        preferCanvas={true}
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        zoomControl={zoomControl}
        wheelDebounceTime={100}
        boxZoom={boxZoom}
        dragging={dragging}
        doubleClickZoom={doubleClickZoom}
        touchZoom={touchZoom}
        scrollWheelZoom={scrollWheelZoom}
      >
        <MapRef mapRef={mapRef}/>;

        {/*More providers here: https://leaflet-extras.github.io/leaflet-providers/preview/*/}
        {/*<TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"/>*/}

        <LayersControl position="bottomright" collapsed={false}>
          <LayersControl.BaseLayer name="Topo" checked={true}>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {children}
      </MapContainer>
    </div>
  );
};

export default Map;

export {LeafletMapProvider, MapRef};
