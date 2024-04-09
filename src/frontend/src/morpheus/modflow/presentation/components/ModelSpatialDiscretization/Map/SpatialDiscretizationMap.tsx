import * as L from 'leaflet';
import * as turf from '@turf/turf';

import React, {useEffect, useMemo, useRef, useState} from 'react';

import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import {FeatureGroup, GeoJSON, Polygon as LeafletPolygon, useMap, useMapEvents} from 'react-leaflet';
import {GeomanControls} from 'common/components/Map';
import cloneDeep from 'lodash.clonedeep';


interface Props {
  editAffectedCells?: boolean
  affectedCellsGeometry?: Feature<Polygon | MultiPolygon>;
  onChangeAffectedCell?: (row: number, col: number, active: boolean) => void
  gridGeometry?: FeatureCollection
  editModelGeometry?: boolean
  modelGeometry?: Polygon
  onChangeModelGeometry: (polygon: Polygon) => void
}

const emptyFeatureCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const SpatialDiscretizationMap = ({
  editAffectedCells,
  affectedCellsGeometry,
  gridGeometry,
  modelGeometry,
  onChangeModelGeometry,
  editModelGeometry,
  onChangeAffectedCell,
}: Props) => {
  const editModelGeometryRef = useRef<L.FeatureGroup>(L.featureGroup());
  const map = useMap();

  const [newActiveCellGeometries, setNewActiveCellGeometries] = useState<FeatureCollection>(emptyFeatureCollection);
  const [newInactiveCellGeometries, setNewInactiveCellGeometries] = useState<FeatureCollection>(emptyFeatureCollection);

  useEffect(() => {
    setNewActiveCellGeometries(emptyFeatureCollection);
    setNewInactiveCellGeometries(emptyFeatureCollection);
  }, [affectedCellsGeometry, gridGeometry]);

  const affectedCellsLayerGeometry = useMemo(() => {
    if (!affectedCellsGeometry || !gridGeometry) {
      return;
    }

    const boundingBox = gridGeometry.features.find((f: Feature) => {
      return 'Polygon' === f.geometry.type && 'bounding_box' === f.properties?.type;
    });

    if (!boundingBox || 'Polygon' !== boundingBox.geometry.type) {
      return;
    }

    const feature = cloneDeep(boundingBox as Feature<Polygon>);
    if ('Polygon' === affectedCellsGeometry.geometry.type) {
      feature.geometry.coordinates.push(affectedCellsGeometry.geometry.coordinates[0]);
    }

    if ('MultiPolygon' === affectedCellsGeometry.geometry.type) {
      affectedCellsGeometry.geometry.coordinates.forEach((coordinates) => {
        feature.geometry.coordinates.push(coordinates[0]);
      });
    }

    console.log({boundingBox, affectedCellsGeometry, feature, gridGeometry});

    return feature;

  }, [affectedCellsGeometry, gridGeometry]);

  useMapEvents({
    click: function (e) {

      if (editModelGeometry) {
        return;
      }

      if (!editAffectedCells) {
        return;
      }

      if (!affectedCellsGeometry || !gridGeometry || !onChangeAffectedCell) {
        return;
      }

      const clickedPoint = turf.point([e.latlng.lng, e.latlng.lat]);

      const colGeometry = gridGeometry.features.find((f: Feature) => {
        if ('Polygon' === f.geometry.type && 'col' === f.properties?.type) {
          const polygon = turf.polygon(f.geometry.coordinates);
          return turf.booleanPointInPolygon(clickedPoint, polygon);
        }
      });

      const rowGeometry = gridGeometry.features.find((f: Feature) => {
        if ('Polygon' === f.geometry.type && 'row' === f.properties?.type) {
          const polygon = turf.polygon(f.geometry.coordinates);
          return turf.booleanPointInPolygon(clickedPoint, polygon);
        }
      });

      if (colGeometry && 'Polygon' === colGeometry.geometry.type && rowGeometry && 'Polygon' === rowGeometry.geometry.type) {
        const intersection = turf.intersect(
          turf.polygon(colGeometry.geometry.coordinates),
          turf.polygon(rowGeometry.geometry.coordinates),
        );

        if (!intersection) {
          return;
        }

        const col = colGeometry?.properties?.col as number;
        const row = rowGeometry?.properties?.row as number;
        intersection.properties = {row: row, col: col};

        const center = turf.centerOfMass(intersection);
        const isActiveAndWillBeDeactivated = turf.booleanPointInPolygon(center, affectedCellsGeometry);

        if (isActiveAndWillBeDeactivated) {
          // remove if it is already inactive, else add
          const isAlreadyInListAndMustBeRemoved = newInactiveCellGeometries.features.find((f) => {
            return f.properties?.row === row && f.properties?.col === col;
          });

          if (isAlreadyInListAndMustBeRemoved) {
            setNewInactiveCellGeometries({
              type: 'FeatureCollection',
              features: newInactiveCellGeometries.features.filter((f) => f.properties?.row !== row || f.properties?.col !== col),
            });
            onChangeAffectedCell(row, col, true);
            return;
          }

          // add only if not present yet
          setNewInactiveCellGeometries({
            type: 'FeatureCollection',
            features: [
              ...newInactiveCellGeometries.features,
              intersection,
            ],
          });
          onChangeAffectedCell(row, col, false);
          return;
        }

        // remove if it is already active, else add
        const isAlreadyInListAndMustBeRemoved = newActiveCellGeometries.features.find((f) => {
          return f.properties?.row === row && f.properties?.col === col;
        });

        if (isAlreadyInListAndMustBeRemoved) {
          setNewActiveCellGeometries({
            type: 'FeatureCollection',
            features: newActiveCellGeometries.features.filter((f) => f.properties?.row !== row || f.properties?.col !== col),
          });
          onChangeAffectedCell(row, col, false);
          return;
        }

        // add only if not present yet
        setNewActiveCellGeometries({
          type: 'FeatureCollection',
          features: [
            ...newActiveCellGeometries.features,
            intersection,
          ],
        });
        onChangeAffectedCell(row, col, true);
      }
    },
  });


  useEffect(() => {
    if (!modelGeometry) {
      return;
    }

    const layer = L.geoJSON(modelGeometry);
    map.fitBounds(layer.getBounds());
  }, [modelGeometry]);


  const handleChange = () => {
    const featureGroup = editModelGeometryRef.current as L.FeatureGroup;
    const layers = featureGroup.getLayers();

    if (0 === layers.length) {
      return;
    }

    if (1 < layers.length) {
      throw new Error('More than one layer in FeatureGroup');
    }

    const layer = layers[0] as L.Layer;
    if (layer instanceof L.Polygon) {
      const feature = layer.toGeoJSON();
      if (feature.geometry && 'Polygon' === feature.geometry.type) {
        onChangeModelGeometry(feature.geometry as Polygon);
        map.fitBounds(layer.getBounds());
      }
    }
  };

  console.log(affectedCellsLayerGeometry?.geometry.coordinates);

  return (
    <>
      <FeatureGroup ref={editModelGeometryRef}>
        {editModelGeometry && <GeomanControls
          key={modelGeometry ? 'edit' : 'create'}
          options={{
            position: 'topleft',
            drawText: false,
            drawMarker: false,
            drawCircle: false,
            cutPolygon: false,
            drawRectangle: false,
            drawPolygon: !modelGeometry,
            drawCircleMarker: false,
            drawPolyline: false,
            editMode: !!modelGeometry,
            removalMode: false,
          }}
          globalOptions={{
            continueDrawing: false,
            editable: true,
            draggable: true,
          }}
          onMount={() => L.PM.setOptIn(false)}
          onUnmount={() => L.PM.setOptIn(true)}
          onUpdate={handleChange}
          map={map}
        />}
        {modelGeometry && <LeafletPolygon
          key={editModelGeometry ? 'edit' : 'view'}
          positions={modelGeometry.coordinates[0].map((c) => [c[1], c[0]])}
          fill={false}
          weight={editModelGeometry ? 2 : 1}
          opacity={editModelGeometry ? 1 : 0.5}
        />}
      </FeatureGroup>


      <FeatureGroup>
        {gridGeometry && <GeoJSON
          key={JSON.stringify(gridGeometry)}
          data={gridGeometry}
          style={{fill: false, color: 'grey', weight: 0.5, opacity: editModelGeometry ? 0.1 : 0.5}}
          pmIgnore={true}
        />}
      </FeatureGroup>

      <FeatureGroup>
        {affectedCellsLayerGeometry && <GeoJSON
          key={JSON.stringify(affectedCellsLayerGeometry)}
          data={affectedCellsLayerGeometry}
          style={{
            weight: 0,
            fillOpacity: editAffectedCells ? 0.5 : 0.15,
            fillColor: 'grey',
          }}
          pmIgnore={true}
        />}

        {affectedCellsLayerGeometry && <GeoJSON
          key={`new_active_cell_geometries_${newActiveCellGeometries.features.length}`}
          data={newActiveCellGeometries}
          style={{
            weight: 0,
            fillOpacity: 0.6,
            fillColor: 'white',
          }}
          pmIgnore={true}
        />}

        {affectedCellsLayerGeometry && <GeoJSON
          key={`new_inactive_cell_geometries_${newInactiveCellGeometries.features.length}`}
          data={newInactiveCellGeometries}
          style={{
            weight: 0,
            fillOpacity: 0.4,
            fillColor: 'grey',
          }}
          pmIgnore={true}
        />}
      </FeatureGroup>
    </>
  );
};

export default SpatialDiscretizationMap;
