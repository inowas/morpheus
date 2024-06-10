import React, {useEffect, useMemo, useState} from 'react';
import * as turf from '@turf/turf';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';

import {FeatureGroup, GeoJSON, useMap, useMapEvents} from 'common/infrastructure/React-Leaflet';
import cloneDeep from 'lodash.clonedeep';
import {AffectedCells, IAffectedCells} from "../../../types";


interface IProps {
  affectedCells: IAffectedCells;
  editAffectedCells: boolean;
  affectedCellsGeometry?: Feature<Polygon | MultiPolygon>;
  gridGeometry?: FeatureCollection;
  onChangeAffectedCells: (affectedCells: IAffectedCells) => void;
}

const emptyFeatureCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const AffectedCellsLayer = ({
                              affectedCells,
                              affectedCellsGeometry,
                              editAffectedCells,
                              gridGeometry,
                              onChangeAffectedCells,
                            }: IProps) => {

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

    return feature;

  }, [affectedCellsGeometry, gridGeometry]);

  const handleChangeAffectedCell = (row: number, col: number, active: boolean) => {
    if (!affectedCells) {
      return;
    }
    const newAffectedCells = AffectedCells.fromObject(affectedCells);
    newAffectedCells.setActive(row, col, active);
    onChangeAffectedCells(newAffectedCells.toObject() as IAffectedCells);
  }

  useMapEvents({
    click: function (e) {

      if (!affectedCellsGeometry || !gridGeometry || !editAffectedCells) {
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
            handleChangeAffectedCell(row, col, true);
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
          handleChangeAffectedCell(row, col, false);
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
          handleChangeAffectedCell(row, col, false);
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
        handleChangeAffectedCell(row, col, true);
      }
    },
  });

  return (
    <>
      <FeatureGroup>
        {gridGeometry && <GeoJSON
          key={JSON.stringify(gridGeometry)}
          data={gridGeometry}
          style={{fill: false, color: 'grey', weight: 0.5, opacity: editAffectedCells ? 0.5 : 0.1}}
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

export default AffectedCellsLayer;