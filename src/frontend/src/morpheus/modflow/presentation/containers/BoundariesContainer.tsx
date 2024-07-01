import React, {useEffect, useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider, Map} from 'common/components/Map';
import {MapRef} from 'common/components/Map/Map';
import {DataGrid, SearchInput, SectionTitle} from 'common/components';

import useBoundaries from '../../application/useBoundaries';
import useLayers from '../../application/useLayers';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {IBoundaryId, IBoundaryType, IObservationId, ISelectedBoundaryAndObservation} from '../../types/Boundaries.type';
import BoundariesAccordion from '../components/ModelBoundaries/BoundariesAccordion';
import {useTimeDiscretization} from '../../application';
import {LineString, Point, Polygon} from 'geojson';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import BoundariesLayer from '../components/ModelBoundaries/BoundariesLayer';
import DrawBoundaryLayer from '../components/ModelBoundaries/DrawBoundaryLayer';
import AffectedCellsMapLayer from '../components/ModelSpatialDiscretization/AffectedCellsMapLayer';


const BoundariesContainer = () => {
  const {projectId} = useParams();

  const {spatialDiscretization, fetchGridGeometry} = useSpatialDiscretization(projectId as string);
  const {timeDiscretization} = useTimeDiscretization(projectId as string);
  const {
    boundaries,
    fetchAffectedCellsGeometry,
    onAddBoundary,
    onCloneBoundary,
    onCloneBoundaryObservation,
    onRemoveBoundary,
    onRemoveBoundaryObservation,
    onUpdateBoundaryAffectedCells,
    onUpdateBoundaryAffectedLayers,
    onUpdateBoundaryGeometry,
    onUpdateBoundaryMetadata,
    onUpdateBoundaryObservation,
    onDisableBoundary,
    onEnableBoundary,
  } = useBoundaries(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPrivileges(projectId as string);

  const mapRef: IMapRef = useRef(null);

  const [addBoundaryOnMap, setAddBoundaryOnMap] = useState<IBoundaryType | null>(null);
  const [selectedBoundaryAndObservation, setSelectedBoundaryAndObservation] = useState<ISelectedBoundaryAndObservation | undefined>(undefined);

  useEffect(() => {
    if (!boundaries.length) {
      return;
    }

    if (!selectedBoundaryAndObservation) {
      return setSelectedBoundaryAndObservation({
        boundary: boundaries[0],
        observationId: boundaries[0].observations[0].observation_id,
      });
    }

    // update selectedBoundaryAndObservation
    const boundary = boundaries.find((b) => b.id === selectedBoundaryAndObservation.boundary.id);
    if (!boundary) {
      return setSelectedBoundaryAndObservation({
        boundary: boundaries[0],
        observationId: boundaries[0].observations[0].observation_id,
      });
    }

    const observation = boundary.observations.find((o) => o.observation_id === selectedBoundaryAndObservation.observationId);
    return setSelectedBoundaryAndObservation({
      boundary,
      observationId: observation ? observation.observation_id : boundary.observations[0].observation_id,
    });
  },
  [boundaries],
  );

  if (!spatialDiscretization || !boundaries || !layers || !timeDiscretization) {
    return null;
  }

  const handleAddBoundary = async (type: IBoundaryType, geometry: any) => {
    await onAddBoundary(type, geometry);
    setAddBoundaryOnMap(null);
  };

  const handleChangeBoundaryGeometry = async (boundaryId: IBoundaryId, geometry: Point | LineString | Polygon) => {
    await onUpdateBoundaryGeometry(boundaryId, geometry);
  };

  const handleChangeBoundaryObservationGeometry = async (boundaryId: IBoundaryId, observationId: IObservationId, geometry: Point) => {
    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (!boundary) {
      return;
    }
    const observation = boundary.observations.find((o) => o.observation_id === observationId);
    if (!observation) {
      return;
    }
    await onUpdateBoundaryObservation(boundaryId, boundary.type, {...observation, geometry});
  };

  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <SectionTitle title={'Boundary conditions'}/>
          <SearchInput
            dropDownText={'Add new boundary'}
            dropdownItems={[
              {text: 'Constant head', action: () => setAddBoundaryOnMap('constant_head')},
              {text: 'Drain', action: () => setAddBoundaryOnMap('drain')},
              {text: 'Evapotranspiration', action: () => setAddBoundaryOnMap('evapotranspiration')},
              {text: 'Flow and head', action: () => setAddBoundaryOnMap('flow_and_head')},
              {text: 'General head', action: () => setAddBoundaryOnMap('general_head')},
              {text: 'Lake', action: () => setAddBoundaryOnMap('lake')},
              {text: 'Recharge', action: () => setAddBoundaryOnMap('recharge')},
              {text: 'River', action: () => setAddBoundaryOnMap('river')},
              {text: 'Well', action: () => setAddBoundaryOnMap('well')},
            ]}
            onChangeSearch={(search) => console.log(search)}
            searchPlaceholder={'Search boundaries'}
            isReadOnly={isReadOnly}
          />
          <LeafletMapProvider mapRef={mapRef}>
            <BoundariesAccordion
              boundaries={boundaries}
              layers={layers}
              selectedBoundaryAndObservation={selectedBoundaryAndObservation}
              onSelectBoundaryAndObservation={setSelectedBoundaryAndObservation}
              onCloneBoundary={onCloneBoundary}
              onCloneBoundaryObservation={onCloneBoundaryObservation}
              onDisableBoundary={onDisableBoundary}
              onEnableBoundary={onEnableBoundary}
              onUpdateBoundaryMetadata={onUpdateBoundaryMetadata}
              onUpdateBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
              onRemoveBoundary={onRemoveBoundary}
              onRemoveBoundaryObservation={onRemoveBoundaryObservation}
              onUpdateBoundaryObservation={onUpdateBoundaryObservation}
              timeDiscretization={timeDiscretization}
            />
          </LeafletMapProvider>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map>
          <MapRef mapRef={mapRef}/>;
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization.geometry}/>
          <DrawBoundaryLayer boundaryType={addBoundaryOnMap} onAddBoundary={handleAddBoundary}/>
          <BoundariesLayer
            boundaries={boundaries}
            selectedBoundaryAndObservation={selectedBoundaryAndObservation}
            onSelectBoundaryAndObservation={setSelectedBoundaryAndObservation}
            onChangeBoundaryGeometry={handleChangeBoundaryGeometry}
            onChangeBoundaryObservationGeometry={handleChangeBoundaryObservationGeometry}
            isReadOnly={isReadOnly}
          />
          {selectedBoundaryAndObservation &&
            <AffectedCellsMapLayer
              affectedCells={selectedBoundaryAndObservation.boundary.affected_cells}
              fetchAffectedCellsGeometry={() => fetchAffectedCellsGeometry(selectedBoundaryAndObservation.boundary.id)}
              fetchGridGeometry={fetchGridGeometry}
              onChangeAffectedCells={(affectedCells) => onUpdateBoundaryAffectedCells(selectedBoundaryAndObservation.boundary.id, affectedCells)}
              isReadOnly={isReadOnly}
              expectSingleCell={'well' === selectedBoundaryAndObservation.boundary.type}
            />}
        </Map>
      </BodyContent>
    </>
  );
};

export default BoundariesContainer;
