import React, {useRef, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {BoundariesContent} from '../components/BoundariesLayers';
import {useParams} from "react-router-dom";
import useSpatialDiscretization from "../../application/useSpatialDiscretization";
import useProjectPermissions from "../../application/useProjectPermissions";
import {IMapRef, LeafletMapProvider} from "common/components/Map";
import BoundariesMap from "../components/ModelBoundaries/BoundariesMap";
import {DataGrid, SearchInput, SectionTitle} from "common/components";
import useBoundaries from "../../application/useBoundaries";
import {IBoundaryType} from "../../types/Boundaries.type";


const BoundariesContainer = () => {

  const {projectId} = useParams();
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {boundaries, onAddBoundary} = useBoundaries(projectId as string);
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const mapRef: IMapRef = useRef(null);

  const [addBoundary, setAddBoundary] = useState<IBoundaryType | null>(null);

  if (!spatialDiscretization || !boundaries) {
    return null;
  }

  const handleAddBoundary = (type: IBoundaryType, geometry: any) => {
    onAddBoundary(type, geometry);
    setAddBoundary(null)
  }

  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <SectionTitle title={'Boundary conditions'}/>
          <SearchInput
            dropDownText={'Add new boundary'}
            dropdownItems={[
              {text: 'Constant head', action: () => setAddBoundary('constant_head')},
              {text: 'Drain', action: () => setAddBoundary('drain')},
              {text: 'Evapotranspiration', action: () => setAddBoundary('evapotranspiration')},
              {text: 'Flow and head', action: () => setAddBoundary('flow_and_head')},
              {text: 'General head', action: () => setAddBoundary('general_head')},
              {text: 'Lake', action: () => setAddBoundary('lake')},
              {text: 'Recharge', action: () => setAddBoundary('recharge')},
              {text: 'River', action: () => setAddBoundary('river')},
              {text: 'Well', action: () => setAddBoundary('well')},
            ]}
            onChangeSearch={(search) => console.log(search)}
            searchPlaceholder={'Search boundaries'}
            isReadOnly={isReadOnly}
          />
          <LeafletMapProvider mapRef={mapRef}>
            <BoundariesContent/>
          </LeafletMapProvider>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <BoundariesMap
          spatialDiscretization={spatialDiscretization}
          mapRef={mapRef}
          addBoundary={addBoundary}
          onAddBoundary={handleAddBoundary}
        />
      </BodyContent>
    </>
  );
};

export default BoundariesContainer;
