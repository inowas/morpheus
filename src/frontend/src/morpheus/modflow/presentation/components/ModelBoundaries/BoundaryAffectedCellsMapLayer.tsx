import React, {useEffect, useState} from 'react';
import * as turf from '@turf/turf';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';

import {FeatureGroup, GeoJSON, useMapEvents} from 'common/infrastructure/React-Leaflet';
import {AffectedCells, IAffectedCells} from "../../../types";
import objectHash from "object-hash";


interface IProps {
  affectedCells: IAffectedCells;
  editAffectedCells: boolean;
  fetchAffectedCellsGeometry: () => Promise<Feature<Polygon | MultiPolygon> | null>;
  fetchGridGeometry: () => Promise<FeatureCollection | null>;
  onChangeAffectedCells: (affectedCells: IAffectedCells) => void;
}

const emptyFeatureCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const BoundaryAffectedCellsMapLayer = ({affectedCells, editAffectedCells, fetchAffectedCellsGeometry, fetchGridGeometry, onChangeAffectedCells}: IProps) => {

  const [newActiveCellGeometries, setNewActiveCellGeometries] = useState<FeatureCollection>(emptyFeatureCollection);
  const [newInactiveCellGeometries, setNewInactiveCellGeometries] = useState<FeatureCollection>(emptyFeatureCollection);

  const [gridGeometry, setGridGeometry] = useState<FeatureCollection | null>();
  const [affectedCellsGeometry, setAffectedCellsGeometry] = useState<Feature<Polygon | MultiPolygon> | null>();

  useEffect(() => {
    fetchGridGeometry().then(setGridGeometry);
  }, [fetchGridGeometry]);

  useEffect(() => {
    fetchAffectedCellsGeometry().then(setAffectedCellsGeometry);
  }, [fetchAffectedCellsGeometry]);


  useEffect(() => {
    setNewActiveCellGeometries(emptyFeatureCollection);
    setNewInactiveCellGeometries(emptyFeatureCollection);
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
          key={objectHash(gridGeometry)}
          data={gridGeometry}
          style={{fill: false, color: 'grey', weight: 0.2, opacity: 0.4}}
          pmIgnore={true}
        />}
      </FeatureGroup>
      <FeatureGroup>
        {affectedCellsGeometry && <GeoJSON
          key={objectHash(affectedCellsGeometry)}
          data={affectedCellsGeometry}
          style={{
            weight: 0,
            fillOpacity: editAffectedCells ? 0.5 : 0.15,
            fillColor: 'grey',
          }}
          pmIgnore={true}
        />}

        {affectedCellsGeometry && <GeoJSON
          key={`newInactiveCellGeometries-${objectHash(newInactiveCellGeometries)}`}
          data={newInactiveCellGeometries}
          style={{
            weight: 0,
            fillOpacity: 0.6,
            fillColor: 'white',
          }}
          pmIgnore={true}
        />}

        {affectedCellsGeometry && <GeoJSON
          key={`newActiveCellGeometries-${objectHash(newActiveCellGeometries)}`}
          data={newActiveCellGeometries}
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

export default BoundaryAffectedCellsMapLayer;
