import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider, Map} from 'common/components/Map';
import {MapRef} from 'common/components/Map/Map';
import {DataGrid, SearchInput, SectionTitle} from 'common/components';

import useHeadObservations from '../../application/useHeadObservations';
import useLayers from '../../application/useLayers';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {useTimeDiscretization} from '../../application';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import {useNavigate} from 'common/hooks';
import {IHeadObservation, IObservationType} from '../../types/HeadObservations.type';
import HeadObservationListDetails from '../components/ModelHeadObservations/HeadObservationListDetails';
import DrawObservationLayer from '../components/ModelHeadObservations/DrawObservationLayer';
import {Point} from 'geojson';


const HeadObservationsContainer = () => {
  const {projectId, propertyId: observationId} = useParams();

  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {timeDiscretization} = useTimeDiscretization(projectId as string);
  const {headObservations, onAdd, onClone, onDisable, onRemove, onEnable, onUpdate} = useHeadObservations(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPrivileges(projectId as string);

  const navigate = useNavigate();
  const mapRef: IMapRef = useRef(null);

  const [addObservationOnMap, setAddObservationOnMap] = useState<IObservationType | null>(null);
  const [selectedHeadObservation, setSelectedHeadObservation] = useState<IHeadObservation | null>(null);

  useEffect(() => {
    if (!headObservations) {
      return;
    }

    if (0 === headObservations.length) {
      return;
    }
    setSelectedHeadObservation(headObservations.find((o) => o.id === observationId) || null);
  }, [headObservations, observationId]);

  const handleSelectObservation = async (id: IHeadObservation['id']) => {
    navigate(`/projects/${projectId}/model/head-observations/${id}`);
  };

  const handleAddObservation = async (type: IObservationType, geometry: Point) => {
    setAddObservationOnMap(null);
    const location = await onAdd(type, geometry);
    if (location) {
      navigate(`/projects/${projectId}/model/head-observations/${location}`);
    }
  };

  const handleCloneObservation = async (id: IHeadObservation['id']) => {
    const location = await onClone(id);
    if (location) {
      navigate(`/projects/${projectId}/model/head-observations/${location}`);
    }
  };

  const handleRemoveObservation = async (id: IHeadObservation['id']) => {
    await onRemove(id);
    navigate(`/projects/${projectId}/model/head-observations`);
  };

  const handleChangeObservation = (observation: IHeadObservation) => {
    onUpdate(observation);
  };

  const handleChangeObservationGeometry = (geometry: Point) => {
    if (!selectedHeadObservation) {
      return;
    }

    onUpdate({...selectedHeadObservation, geometry});
  };

  const isDirty = useMemo(() => {
    if (!selectedHeadObservation) {
      return false;
    }
    const original = headObservations.find((o) => o.id === selectedHeadObservation.id);
    return JSON.stringify(original) !== JSON.stringify(selectedHeadObservation);
  }, [headObservations, selectedHeadObservation]);

  if (!spatialDiscretization || !headObservations || !layers || !timeDiscretization) {
    return null;
  }

  return (
    <>
      <SidebarContent maxWidth={700}>
        <LeafletMapProvider mapRef={mapRef}>
          <DataGrid>
            <SectionTitle title={'Boundary conditions'}/>
            <SearchInput
              dropDownText={'Add new head observation'}
              dropdownItems={[
                {text: 'Head Observation', action: () => setAddObservationOnMap('head')},
              ]}
              onChangeSearch={(search) => console.log(search)}
              searchPlaceholder={'Search head observations'}
              isReadOnly={isReadOnly}
            />
            <HeadObservationListDetails
              observations={headObservations}
              selected={observationId || null}
              layers={layers}
              onClone={handleCloneObservation}
              onDisable={onDisable}
              onEnable={onEnable}
              onSelect={handleSelectObservation}
              onChange={handleChangeObservation}
              onRemove={handleRemoveObservation}
              isReadOnly={isReadOnly}
            />
          </DataGrid>
        </LeafletMapProvider>
      </SidebarContent>
      <BodyContent>
        <Map>
          <MapRef mapRef={mapRef}/>;
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization.geometry}/>
          <DrawObservationLayer
            observationType={addObservationOnMap}
            onAdd={(type, geometry) => handleAddObservation(type, geometry)}
          />
        </Map>
      </BodyContent>
    </>
  );
};

export default HeadObservationsContainer;
