import React, {useEffect} from 'react';
import {FeatureCollection, Polygon} from 'geojson';
import {L} from 'common/infrastructure/Leaflet';
import {useMap, FeatureGroup, CircleMarker, GeoJSON} from 'common/infrastructure/React-Leaflet';
import objectHash from 'object-hash';
import {GeomanControls} from 'common/components/Map';

interface IProps {
  items: FeatureCollection;
  modelDomain: Polygon;
  onClickItem: (idx: number) => void;
  onSelectItems: (itemIdx: number[]) => void;
}

const SelectImportItemsMapLayer = ({items, modelDomain, onClickItem, onSelectItems}: IProps) => {

  const map = useMap();

  const handleDrawRectangle = (e: any) => {
    const layer = e.layer;
    const bounds = layer.getBounds();

    const selectedItemIdx = items.features.filter((feature) => {
      if ('Point' === feature.geometry.type) {
        return bounds.contains(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
      }

      return bounds.intersects(L.geoJSON(feature).getBounds());
    }).map((feature) => feature?.properties?.id || -1).filter((id) => -1 !== id);

    onSelectItems(selectedItemIdx);

    map.pm.getGeomanLayers().forEach((l) => l.remove());
  };

  useEffect(() => {
    return () => {
      map.off('pm:create', handleDrawRectangle);
    };
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.on('pm:create', handleDrawRectangle);

    map.fitBounds(L.geoJSON(modelDomain).getBounds());
  }, [map, modelDomain]);


  return (
    <div style={{width: '100%', height: '100%'}}>
      <FeatureGroup>
        {items.features.map((feature) => {
          if ('Point' == feature.geometry.type) {
            return (
              <CircleMarker
                key={objectHash(feature)}
                center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                radius={5}
                color={feature?.properties?.selected ? 'blue' : 'grey'}
                fillColor={feature?.properties?.selected ? 'blue' : 'grey'}
                fillOpacity={0.8}
                eventHandlers={{
                  click: () => {
                    if (feature?.properties?.id) {
                      return onClickItem(feature.properties.id);
                    }
                  },
                }}
                pmIgnore={true}
              />
            );
          }

          return <GeoJSON
            key={objectHash(feature)}
            data={feature}
            style={{
              color: feature?.properties?.selected ? 'blue' : 'grey',
              fillColor: feature?.properties?.selected ? 'blue' : 'grey',
              fillOpacity: 0.8,
            }}
            pmIgnore={true}
            onEachFeature={(f, layer) => {
              layer.on('click', () => {
                if (f?.properties?.id) {
                  return onClickItem(f.properties.id);
                }
              });
            }}
          />;
        })}
        {modelDomain && <GeoJSON
          key={objectHash(modelDomain)}
          data={modelDomain}
          pmIgnore={true}
        />}
      </FeatureGroup>
      <FeatureGroup>
        <GeomanControls
          options={{
            position: 'topleft',
            drawText: false,
            drawMarker: false,
            drawCircle: false,
            cutPolygon: false,
            drawRectangle: true,
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
    </div>
  );
};

export default SelectImportItemsMapLayer;
