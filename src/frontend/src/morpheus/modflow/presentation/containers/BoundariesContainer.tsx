import React, {useMemo, useRef, useState} from 'react';
import {Button} from 'semantic-ui-react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider, Map} from 'common/components/Map';
import {MapRef} from 'common/components/Map/Map';

import {DataGrid, DropdownComponent, SearchInput, SectionTitle} from 'common/components';
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
import {useDateTimeFormat, useNavigate} from 'common/hooks';
import ImportShapefileModal from './ImportShapefileModal';
import Widget from 'common/components/Section/Widget';


const BoundariesContainer = () => {
  const {projectId, propertyId: boundaryId, subPropertyId: observationId} = useParams();

  const {spatialDiscretization, fetchGridGeometry} = useSpatialDiscretization(projectId as string);
  const {timeDiscretization} = useTimeDiscretization(projectId as string);
  const navigate = useNavigate();
  const {
    boundaries,
    fetchAffectedCellsGeometry,
    onAddBoundary,
    onCloneBoundary,
    onCloneBoundaryObservation,
    onRemoveBoundaries,
    onRemoveBoundaryObservation,
    onUpdateBoundaryAffectedCells,
    onUpdateBoundaryAffectedLayers,
    onUpdateBoundaryGeometry,
    onUpdateBoundaryInterpolation,
    onUpdateBoundaryMetadata,
    onUpdateBoundaryObservation,
    onDisableBoundary,
    onEnableBoundary,
  } = useBoundaries(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {formatISODate} = useDateTimeFormat('UTC');

  const mapRef: IMapRef = useRef(null);
  const [addBoundaryOnMap, setAddBoundaryOnMap] = useState<IBoundaryType | null>(null);

  const selectedBoundaryAndObservation: ISelectedBoundaryAndObservation | undefined = useMemo(() => {
    if (!boundaries.length) {
      return undefined;
    }

    if (!boundaryId) {
      return undefined;
    }

    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (!boundary) {
      return undefined;
    }

    if (!observationId) {
      return {boundary, observationId: boundary.observations[0].observation_id};
    }

    if (!(boundary.observations.find((o) => o.observation_id === observationId))) {
      return {boundary, observationId: boundary.observations[0].observation_id};
    }

    return {boundary, observationId};

  }, [boundaryId, observationId, boundaries]);

  const handleSelectBoundaryAndObservation = (selected: ISelectedBoundaryAndObservation | null) => {
    if (!selected) {
      return navigate(`/projects/${projectId}/model/boundary-conditions`);
    }

    if (!selected.observationId) {
      return navigate(`/projects/${projectId}/model/boundary-conditions/${selected.boundary.id}`);
    }

    navigate(`/projects/${projectId}/model/boundary-conditions/${selected.boundary.id}/observations/${selected.observationId}`);
  };

  if (!spatialDiscretization || !boundaries || !layers || !timeDiscretization) {
    return null;
  }

  const handleAddBoundary = async (type: IBoundaryType, geometry: any) => {
    setAddBoundaryOnMap(null);
    const newBoundaryId = await onAddBoundary(type, geometry);
    if (newBoundaryId) {
      navigate(`/projects/${projectId}/model/boundary-conditions/${newBoundaryId}`);
    }
  };

  const handleChangeBoundaryGeometry = async (bId: IBoundaryId, geometry: Point | LineString | Polygon) => {
    await onUpdateBoundaryGeometry(bId, geometry);
  };

  const handleChangeBoundaryObservationGeometry = async (bId: IBoundaryId, obsId: IObservationId, geometry: Point) => {
    const boundary = boundaries.find((b) => b.id === bId);
    if (!boundary) {
      return;
    }
    const observation = boundary.observations.find((o) => o.observation_id === obsId);
    if (!observation) {
      return;
    }
    await onUpdateBoundaryObservation(bId, boundary.type, {...observation, geometry});
  };

  const dropdownItems = [
    {text: 'Constant head', action: () => setAddBoundaryOnMap('constant_head')},
    {text: 'Drain', action: () => setAddBoundaryOnMap('drain')},
    {text: 'Evapotranspiration', action: () => setAddBoundaryOnMap('evapotranspiration')},
    {text: 'Flow and head', action: () => setAddBoundaryOnMap('flow_and_head')},
    {text: 'General head', action: () => setAddBoundaryOnMap('general_head')},
    {text: 'Lake', action: () => setAddBoundaryOnMap('lake')},
    {text: 'Recharge', action: () => setAddBoundaryOnMap('recharge')},
    {text: 'River', action: () => setAddBoundaryOnMap('river')},
    {text: 'Well', action: () => setAddBoundaryOnMap('well')},
  ];

  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <SectionTitle title={'Boundary conditions'}/>
          <Widget>
            <SearchInput
              search={''}
              onChange={(search) => console.log(search)}
              placeholder={'Search boundaries'}
            >
              <ImportShapefileModal
                trigger={
                  <Button
                    text={'Import'}
                    icon='plus'
                    content={'Add new boundary'}
                    disabled={isReadOnly}
                  />
                }
              />
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
          <LeafletMapProvider mapRef={mapRef}>
            <BoundariesAccordion
              boundaries={boundaries}
              layers={layers}
              formatDateTime={formatISODate}
              selectedBoundaryAndObservation={selectedBoundaryAndObservation}
              onSelectBoundaryAndObservation={handleSelectBoundaryAndObservation}
              onCloneBoundary={onCloneBoundary}
              onCloneBoundaryObservation={onCloneBoundaryObservation}
              onDisableBoundary={onDisableBoundary}
              onEnableBoundary={onEnableBoundary}
              onUpdateBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
              onUpdateBoundaryInterpolation={onUpdateBoundaryInterpolation}
              onUpdateBoundaryMetadata={onUpdateBoundaryMetadata}
              onRemoveBoundaries={onRemoveBoundaries}
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
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization.geometry} fill={true}/>
          <DrawBoundaryLayer boundaryType={addBoundaryOnMap} onAddBoundary={handleAddBoundary}/>
          <BoundariesLayer
            boundaries={boundaries}
            selectedBoundaryAndObservation={selectedBoundaryAndObservation}
            onSelectBoundaryAndObservation={handleSelectBoundaryAndObservation}
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
