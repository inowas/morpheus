import React, {useEffect, useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider} from 'common/components/Map';
import {DataGrid, SearchInput, SectionTitle} from 'common/components';

import useBoundaries from '../../application/useBoundaries';
import useLayers from "../../application/useLayers";
import useProjectPermissions from '../../application/useProjectPermissions';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {IBoundaryId, IBoundaryType, IObservationId, ISelectedBoundaryAndObservation} from '../../types/Boundaries.type';
import {BoundariesMap} from '../components/ModelBoundaries';
import BoundariesAccordion from "../components/ModelBoundaries/BoundariesAccordion";
import {useDateTimeFormat} from "../../../../common/hooks";
import {useTimeDiscretization} from "../../application";
import {LineString, Point, Polygon} from "geojson";

const BoundariesContainer = () => {
  const {projectId, propertyId: boundaryId} = useParams();

  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {timeDiscretization} = useTimeDiscretization(projectId as string);
  const {
    boundaries,
    onAddBoundary,
    onCloneBoundary,
    onRemoveBoundary,
    onUpdateBoundaryAffectedLayers,
    onUpdateBoundaryGeometry,
    onUpdateBoundaryMetadata,
    onUpdateBoundaryObservation
  } = useBoundaries(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPermissions(projectId as string);

  const mapRef: IMapRef = useRef(null);

  const [addBoundaryOnMap, setAddBoundaryOnMap] = useState<IBoundaryType | null>(null);
  const [selectedBoundaryAndObservation, setSelectedBoundaryAndObservation] = useState<ISelectedBoundaryAndObservation | undefined>(undefined);


  useEffect(() => {
    if (!boundaries.length) {
      return;
    }

    if (!boundaryId) {
      const boundary = boundaries[0];
      setSelectedBoundaryAndObservation({
        boundary,
        observationId: boundary.observations[0].observation_id
      });
    }

    if (boundaryId && selectedBoundaryAndObservation?.boundary.id !== boundaryId) {
      const boundary = boundaries.find((b) => b.id === boundaryId);
      if (boundary) {
        return setSelectedBoundaryAndObservation({
          boundary,
          observationId: boundary.observations[0].observation_id
        });
      }
    }

  }, [boundaryId, boundaries]);

  if (!spatialDiscretization || !boundaries || !layers || !timeDiscretization) {
    return null;
  }

  const handleAddBoundary = async (type: IBoundaryType, geometry: any) => {
    await onAddBoundary(type, geometry);
    setAddBoundaryOnMap(null)
  }

  const handleChangeBoundaryGeometry = async (boundaryId: IBoundaryId, geometry: Point | LineString | Polygon) => {
    await onUpdateBoundaryGeometry(boundaryId, geometry);
  }

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
  }

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
              onUpdateBoundaryMetadata={onUpdateBoundaryMetadata}
              onUpdateBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
              onRemoveBoundary={onRemoveBoundary}
              onUpdateBoundaryObservation={onUpdateBoundaryObservation}
              timeDiscretization={timeDiscretization}
            />
          </LeafletMapProvider>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <BoundariesMap
          boundaries={boundaries}
          spatialDiscretization={spatialDiscretization}
          addBoundary={addBoundaryOnMap}
          onAddBoundary={handleAddBoundary}
          onChangeBoundaryGeometry={handleChangeBoundaryGeometry}
          onChangeBoundaryObservationGeometry={handleChangeBoundaryObservationGeometry}
          mapRef={mapRef}
          selectedBoundary={selectedBoundaryAndObservation}
          isReadOnly={isReadOnly}
        />
      </BodyContent>
    </>
  );
};

export default BoundariesContainer;
