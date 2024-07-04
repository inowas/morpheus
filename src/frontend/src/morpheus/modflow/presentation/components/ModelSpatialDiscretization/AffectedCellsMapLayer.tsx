import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as turf from '@turf/turf';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';

import {FeatureGroup, GeoJSON, useMapEvents} from 'common/infrastructure/React-Leaflet';
import {AffectedCells, IAffectedCells} from '../../../types';
import objectHash from 'object-hash';
import AffectedCellsMapLayerControl from './AffectedCellsMapLayerControl';
import cloneDeep from 'lodash.clonedeep';


interface IProps {
  affectedCells: IAffectedCells;
  fetchAffectedCellsGeometry: () => Promise<Feature<Polygon | MultiPolygon> | null>;
  fetchGridGeometry: () => Promise<FeatureCollection | null>;
  onChangeAffectedCells: (affectedCells: IAffectedCells) => void;
  isReadOnly: boolean;
  inverted?: boolean;
  showAffectedCellsByDefault?: boolean;
  expectSingleCell?: boolean;
}

const emptyFeatureCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const AffectedCellsMapLayer = ({
  affectedCells,
  fetchAffectedCellsGeometry,
  fetchGridGeometry,
  onChangeAffectedCells,
  isReadOnly,
  inverted = false,
  showAffectedCellsByDefault = false,
  expectSingleCell = false,
}: IProps) => {

  const [newActiveCellGeometries, setNewActiveCellGeometries] = useState<FeatureCollection>(emptyFeatureCollection);
  const [newInactiveCellGeometries, setNewInactiveCellGeometries] = useState<FeatureCollection>(emptyFeatureCollection);

  const [gridGeometry, setGridGeometry] = useState<FeatureCollection | null>();
  const [affectedCellsGeometry, setAffectedCellsGeometry] = useState<Feature<Polygon | MultiPolygon> | null>();

  const [showAffectedCells, setShowAffectedCells] = useState<boolean>(showAffectedCellsByDefault);
  const [editAffectedCells, setEditAffectedCells] = useState<boolean>(false);
  const [affectedCellsLocal, setAffectedCellsLocal] = useState<IAffectedCells>(affectedCells);


  // we need a ref here to keep the affectedCellsLocal in sync when executing the handleChangeAffectedCells
  // passing the handler to the ModelAffectedCellsMapLayerControl component sends the wrong values because of closure issues
  // The approach useRef ensures that you always have access to the most recent state value without needing to worry about the closure issues
  const affectedCellsRef = useRef<IAffectedCells>(affectedCells);
  const expectSingleCellRef = useRef<boolean>(expectSingleCell);
  const onChangeAffectedCellsRef = useRef<(affectedCells: IAffectedCells) => void>(onChangeAffectedCells);

  useEffect(() => {
    expectSingleCellRef.current = expectSingleCell;
  }, [expectSingleCell]);

  useEffect(() => {
    if (affectedCells) {
      setAffectedCellsLocal(AffectedCells.fromObject(affectedCells).toObject() as IAffectedCells);
      setNewActiveCellGeometries(emptyFeatureCollection);
      setNewInactiveCellGeometries(emptyFeatureCollection);
      onChangeAffectedCellsRef.current = onChangeAffectedCells;
      fetchGridGeometry().then(setGridGeometry);
      fetchAffectedCellsGeometry().then(setAffectedCellsGeometry);
    }
  }, [affectedCells]);

  useEffect(() => {
    affectedCellsRef.current = affectedCellsLocal;
  }, [affectedCellsLocal]);

  // A Polygon feature is created with the second coordinates array (the hole) of the affected cells
  const affectedCellsLayerGeometry = useMemo(() => {

    if (!inverted) {
      return affectedCellsGeometry;
    }

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

  }, [affectedCellsGeometry, gridGeometry, inverted]);

  // this function cannot use the affectedCellsLocal state because it is not updated in time
  // here only refs and setter used to keep the state in sync
  const handleChangeAffectedCell = (row: number, col: number, active: boolean) => {
    if (!affectedCellsLocal) {
      return;
    }

    const newAffectedCells = AffectedCells.fromObject(affectedCellsRef.current);
    if (expectSingleCellRef.current) {
      if (!active) {
        return;
      }

      setNewActiveCellGeometries(prevState => ({
        type: 'FeatureCollection',
        features: prevState.features.filter((f) => f.properties?.row === row && f.properties?.col === col),
      }));

      if (affectedCellsLayerGeometry) {
        setNewInactiveCellGeometries({...emptyFeatureCollection, features: [affectedCellsLayerGeometry]});
      }

      newAffectedCells.setActiveOnlyOneCell(row, col);
      setAffectedCellsLocal(newAffectedCells.toObject() as IAffectedCells);
      return;
    }

    newAffectedCells.setActive(row, col, active);
    setAffectedCellsLocal(newAffectedCells.toObject() as IAffectedCells);
  };

  const handleChangeEditAffectedCells = (edit: boolean) => {
    if (!edit) {
      onChangeAffectedCellsRef.current(affectedCellsRef.current);
    }

    setEditAffectedCells(edit);
  };

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
        {gridGeometry && showAffectedCells && <GeoJSON
          key={objectHash(gridGeometry)}
          data={gridGeometry}
          style={{fill: false, color: 'grey', weight: 0.2, opacity: 0.4}}
          pmIgnore={true}
        />}
      </FeatureGroup>
      <FeatureGroup>
        {affectedCellsLayerGeometry && showAffectedCells && <GeoJSON
          key={objectHash(affectedCellsLayerGeometry)}
          data={affectedCellsLayerGeometry}
          style={{
            weight: 0,
            fillOpacity: editAffectedCells ? 0.5 : 0.15,
            fillColor: 'grey',
          }}
          pmIgnore={true}
        />}

        {affectedCellsLayerGeometry && showAffectedCells && <GeoJSON
          key={`newInactiveCellGeometries-${objectHash(newInactiveCellGeometries)}`}
          data={newInactiveCellGeometries}
          style={{
            weight: 0,
            fillOpacity: 0.6,
            fillColor: inverted ? 'grey' : 'white',
          }}
          pmIgnore={true}
        />}

        {affectedCellsLayerGeometry && showAffectedCells && <GeoJSON
          key={`newActiveCellGeometries-${objectHash(newActiveCellGeometries)}`}
          data={newActiveCellGeometries}
          style={{
            weight: 0,
            fillOpacity: 0.4,
            fillColor: inverted ? 'white' : 'grey',
          }}
          pmIgnore={true}
        />}
      </FeatureGroup>
      <AffectedCellsMapLayerControl
        showAffectedCells={showAffectedCells}
        onChangeShowAffectedCells={setShowAffectedCells}
        editAffectedCells={editAffectedCells}
        onChangeEditAffectedCells={handleChangeEditAffectedCells}
        isReadOnly={isReadOnly}
      />
    </>
  );
};

export default AffectedCellsMapLayer;
