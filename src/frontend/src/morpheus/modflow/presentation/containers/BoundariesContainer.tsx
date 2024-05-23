import React, {useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider} from 'common/components/Map';
import {Accordion, DataGrid, SearchInput, SectionTitle} from 'common/components';

import useBoundaries from '../../application/useBoundaries';
import useLayers from "../../application/useLayers";
import useProjectPermissions from '../../application/useProjectPermissions';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {IBoundaryType, availableBoundaries, IBoundary} from '../../types/Boundaries.type';
import {BoundariesMap, BoundariesSection} from '../components/ModelBoundaries';

const getPanelDetails = (boundaries: IBoundary[]) => availableBoundaries.map((b) => ({
  title: b.title,
  type: b.type,
  boundaries: boundaries.filter((boundary) => boundary.type === b.type),
  canManageObservations: ['constant_head', 'drain', 'flow_and_head', 'general_head', 'river'].includes(b.type)
})).filter((panel) => 0 < panel.boundaries.length)

const BoundariesContainer = () => {

  const {projectId} = useParams();
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {boundaries, onAddBoundary, onCloneBoundary, onUpdateBoundary, onRemoveBoundary} = useBoundaries(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const mapRef: IMapRef = useRef(null);

  const [addBoundaryOnMap, setAddBoundaryOnMap] = useState<IBoundaryType | null>(null);


  if (!spatialDiscretization || !boundaries || !layers) {
    return null;
  }

  const handleAddBoundary = async (type: IBoundaryType, geometry: any) => {
    await onAddBoundary(type, geometry);
    setAddBoundaryOnMap(null)
  }

  const handleCloneBoundaries = async (ids: IBoundary['id'][]) => {
    for (const id of ids) {
      await onCloneBoundary(id);
    }
  }

  const onRemoveBoundaries = async (ids: IBoundary['id'][]) => {
    console.log('onRemoveBoundaries', ids)
    for (const id of ids) {
      await onRemoveBoundary(id);
    }
  }

  const onUpdateBoundaries = async (boundaries: IBoundary[]) => {
    for (const boundary of boundaries) {
      await onUpdateBoundary(boundary);
    }
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
            <Accordion
              defaultActiveIndex={0}
              className='accordionPrimary'
              exclusive={true}
              panels={getPanelDetails(boundaries).map((panel) => ({
                key: panel.type,
                title: {
                  content: <span>{`${panel.title} (${panel.boundaries.length})`}</span>,
                  icon: false,
                },
                content: {
                  content: (
                    <BoundariesSection
                      boundaries={panel.boundaries}
                      type={panel.type}
                      onCloneBoundaries={handleCloneBoundaries}
                      onRemoveBoundaries={onRemoveBoundaries}
                      onUpdateBoundaries={onUpdateBoundaries}
                      isReadOnly={false}
                      canManageObservations={panel.canManageObservations}
                      layers={layers}
                    />
                  )
                }
              }))}
            />
          </LeafletMapProvider>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <BoundariesMap
          spatialDiscretization={spatialDiscretization}
          mapRef={mapRef}
          addBoundary={addBoundaryOnMap}
          onAddBoundary={handleAddBoundary}
        />
      </BodyContent>
    </>
  );
};

export default BoundariesContainer;
