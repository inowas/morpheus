import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as L from 'leaflet';
import {LatLngTuple} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-smooth-wheel-zoom';
import html2canvas from 'html2canvas';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';

import React, {useEffect, useRef} from 'react';

interface IProps {
  center?: LatLngTuple;
  zoom?: number;
  children: React.ReactNode[] | React.ReactNode;
}

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
        const snapshotOptions = {
          hideElementsWithSelectors: ['.leaflet-control-container'],
          position: 'topright',
          screenName: 'Map',
          hidden: true,
        };
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

  const captureScreenshot = () => {
    const container = containerRef.current;
    if (container) {
      html2canvas(container, {
        useCORS: true, // Enable CORS
      }).then(canvas => {
        // Convert canvas to image and download
        const link = document.createElement('a');
        link.download = 'map_screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };


  return (
    <div ref={containerRef} style={{height: '100%', width: '100%'}}>
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        style={{height: '100%', width: '100%'}}
        scrollWheelZoom={false}
        wheelDebounceTime={100}
      >
        <MapRef mapRef={mapRef}/>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"/>
        {children}
      </MapContainer>
      <button
        onClick={captureScreenshot}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
        }}
      >Capture Screenshot
      </button>
    </div>
  );
};

export default Map;
