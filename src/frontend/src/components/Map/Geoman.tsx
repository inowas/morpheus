import React, {useEffect} from 'react';
import GeomanControls from './GeomanControls';
import {FeatureGroup} from 'react-leaflet';
import type {FeatureCollection} from 'geojson';
import * as L from 'leaflet';


interface Props {
  geojson: FeatureCollection
  setGeojson: (geojson: FeatureCollection) => void
}

const Geoman = ({geojson, setGeojson}: Props) => {
  const ref = React.useRef<L.FeatureGroup>(null);
  const handleChange = () => {
    console.log(event, ' handleChange');
    const newGeo: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const layers = ref.current?.getLayers();
    if (layers) {
      layers.forEach((layer) => {
        if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
          const {lat, lng} = layer.getLatLng();
          newGeo.features.push({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          });
        } else if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Rectangle ||
          layer instanceof L.Polyline
        ) {
          const properties = layer.feature?.properties ?? {}; // Provide a default empty object
          newGeo.features.push({
            properties,
            ...layer.toGeoJSON(),

          });
        }
      });
    }
    setGeojson(newGeo);
  };

  useEffect(() => {
    if (0 === ref.current?.getLayers().length && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            ref.current?.addLayer(layer);
          }
        }
      });
    }
    console.log(geojson);
  }, [geojson]);


  return (
    <FeatureGroup ref={ref}>
      <GeomanControls
        key={geojson.features.length}
        options={{
          position: 'topleft',
          drawText: false,
          drawMarker: false,
          drawCircle: false,
          cutPolygon: false,
          drawRectangle: !(0 < geojson.features.length),
          drawPolygon: !(0 < geojson.features.length),
          drawCircleMarker: false,
          drawPolyline: false,
          editMode: false,
        }}
        globalOptions={{
          // continueDrawing: true,
          // editable: false,
        }}
        // onMount={() => L.PM.setOptIn(true)}
        // onUnmount={() => L.PM.setOptIn(false)}
        eventDebugFn={console.log}
        onCreate={handleChange}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={handleChange}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  );
};

export default Geoman;
