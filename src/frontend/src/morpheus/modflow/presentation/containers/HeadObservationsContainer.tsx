import React, {useEffect, useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider, Map} from 'common/components/Map';
import {MapRef} from 'common/components/Map/Map';
import {DataGrid, DropdownComponent, SearchInput, SectionTitle} from 'common/components';

import useObservations from '../../application/useObservations';
import useLayers from '../../application/useLayers';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {useTimeDiscretization} from '../../application';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import {useDateTimeFormat, useNavigate} from 'common/hooks';
import {IObservation, IObservationType, IObservationId} from '../../types/Observations.type';
import HeadObservationListDetails from '../components/ModelHeadObservations/HeadObservationListDetails';
import DrawObservationLayer from '../components/ModelHeadObservations/DrawObservationLayer';
import {Point} from 'geojson';
import ObservationsLayer from '../components/ModelHeadObservations/ObservationsLayer';
import Widget from 'common/components/Section/Widget';


const HeadObservationsContainer = () => {
  const {projectId, propertyId: observationId} = useParams();

  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {timeDiscretization} = useTimeDiscretization(projectId as string);
  const {observations, onAdd, onClone, onDisable, onRemove, onEnable, onUpdate} = useObservations(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {formatISODate} = useDateTimeFormat('UTC');

  const navigate = useNavigate();
  const mapRef: IMapRef = useRef(null);

  const [addObservationOnMap, setAddObservationOnMap] = useState<IObservationType | null>(null);
  const [selectedHeadObservation, setSelectedHeadObservation] = useState<IObservation | null>(null);

  useEffect(() => {
    if (!observations) {
      return;
    }

    if (0 === observations.length) {
      return;
    }
    setSelectedHeadObservation(observations.find((o) => o.id === observationId) || null);
  }, [observations, observationId]);

  const handleSelectObservation = async (id: IObservationId) => {
    navigate(`/projects/${projectId}/model/head-observations/${id}`);
  };

  const handleAddObservation = async (type: IObservationType, geometry: Point) => {
    setAddObservationOnMap(null);
    const location = await onAdd(type, geometry);
    if (location) {
      navigate(`/projects/${projectId}/model/head-observations/${location}`);
    }
  };

  const handleCloneObservation = async (id: IObservationId) => {
    const location = await onClone(id);
    if (location) {
      navigate(`/projects/${projectId}/model/head-observations/${location}`);
    }
  };

  const handleRemoveObservation = async (id: IObservationId) => {
    await onRemove(id);
    navigate(`/projects/${projectId}/model/head-observations`);
  };

  const handleChangeObservation = (observation: IObservation) => {
    onUpdate(observation);
  };

  if (!spatialDiscretization || !observations || !layers || !timeDiscretization) {
    return null;
  }

  const dropdownItems = [
    {text: 'Head Observation', action: () => setAddObservationOnMap('head')},
  ];

  return (
    <>
      <SidebarContent maxWidth={700}>
        <LeafletMapProvider mapRef={mapRef}>
          <DataGrid>
            <SectionTitle
              title={'Observations'}
            />
            <Widget>
              <SearchInput
                search={''}
                onChange={(search) => console.log(search)}
                placeholder={'Search observations'}
              >
                <DropdownComponent.Dropdown
                  data-testid='test-search-component'
                  text={'Draw on map'}
                  icon='pencil'
                  floating={true}
                  labeled={true}
                  button={true}
                  className='icon'
                  disabled={isReadOnly}
                >
                  <DropdownComponent.Menu>
                    {dropdownItems.map((item, key) => (
                      <DropdownComponent.Item key={key} onClick={item.action}>{item.text}</DropdownComponent.Item>
                    ))}
                  </DropdownComponent.Menu>
                </DropdownComponent.Dropdown>
              </SearchInput>
            </Widget>
            <Widget>
              <HeadObservationListDetails
                observations={observations}
                selected={selectedHeadObservation || null}
                layers={layers}
                onClone={handleCloneObservation}
                onDisable={onDisable}
                onEnable={onEnable}
                onSelect={handleSelectObservation}
                onChange={handleChangeObservation}
                onRemove={handleRemoveObservation}
                isReadOnly={isReadOnly}
                timeDiscretization={timeDiscretization}
                formatDateTime={formatISODate}
              />
            </Widget>
          </DataGrid>
        </LeafletMapProvider>
      </SidebarContent>
      <BodyContent>
        <Map>
          <MapRef mapRef={mapRef}/>;
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization.geometry} fill={true}/>
          <DrawObservationLayer
            observationType={addObservationOnMap}
            onAdd={(type, geometry) => handleAddObservation(type, geometry)}
          />
          <ObservationsLayer
            observations={observations}
            selected={selectedHeadObservation || undefined}
            onSelect={(observation) => handleSelectObservation(observation.id)}
            onChange={handleChangeObservation}
            isReadOnly={isReadOnly}
          />
        </Map>
      </BodyContent>
    </>
  );
};

export default HeadObservationsContainer;
