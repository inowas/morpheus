import React, {useEffect, useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useParams} from 'react-router-dom';
import {IMapRef, LeafletMapProvider} from 'common/components/Map';
import {DataGrid, SearchInput, SectionTitle} from 'common/components';

import useBoundaries from '../../application/useBoundaries';
import useLayers from "../../application/useLayers";
import useProjectPermissions from '../../application/useProjectPermissions';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {IBoundaryType} from '../../types/Boundaries.type';
import {BoundariesMap} from '../components/ModelBoundaries';
import BoundariesAccordion from "../components/ModelBoundaries/BoundariesAccordion";
import {ISelectedBoundary} from "../components/ModelBoundaries/types/SelectedBoundary.type";

const BoundariesContainer = () => {
  const {projectId, propertyId: boundaryId} = useParams();

  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {boundaries, onAddBoundary, onCloneBoundary, onRemoveBoundary, onUpdateBoundaryAffectedLayers, onUpdateBoundaryMetadata} = useBoundaries(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {isReadOnly} = useProjectPermissions(projectId as string);

  const mapRef: IMapRef = useRef(null);

  const [addBoundaryOnMap, setAddBoundaryOnMap] = useState<IBoundaryType | null>(null);
  const [selectedBoundary, setSelectedBoundary] = useState<ISelectedBoundary | undefined>(undefined);

  useEffect(() => {
    if (boundaries.length && boundaryId && selectedBoundary?.boundary.id !== boundaryId) {
      const boundary = boundaries.find((b) => b.id === boundaryId);
      if (boundary) {
        return setSelectedBoundary({
          boundary: boundary,
          observationId: boundary.observations[0].observation_id,
        });
      }
    }

    if (boundaries.length && !boundaryId) {
      const boundary = boundaries[0];
      setSelectedBoundary({
        boundary: boundary,
        observationId: boundary.observations[0].observation_id,
      });
    }
  }, [boundaryId, boundaries]);

  if (!spatialDiscretization || !boundaries || !layers) {
    return null;
  }

  const handleAddBoundary = async (type: IBoundaryType, geometry: any) => {
    await onAddBoundary(type, geometry);
    setAddBoundaryOnMap(null)
  }

  const handleChangeSelectedBoundary = (selected: ISelectedBoundary) => {
    setSelectedBoundary(selected);
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
              selectedBoundary={selectedBoundary}
              onChangeSelectedBoundary={handleChangeSelectedBoundary}
              onCloneBoundary={onCloneBoundary}
              onUpdateBoundaryMetadata={onUpdateBoundaryMetadata}
              onUpdateBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
              onRemoveBoundary={onRemoveBoundary}
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
