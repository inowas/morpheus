import React, {useRef} from 'react';
import {BodyContent, SidebarContent} from '../components';
import {BoundariesContent} from '../components/BoundariesLayers';
import {useParams} from "react-router-dom";
import useSpatialDiscretization from "../../application/useSpatialDiscretization";
import useProjectPermissions from "../../application/useProjectPermissions";
import {IMapRef, LeafletMapProvider} from "common/components/Map";
import BoundariesMap from "../components/ModelBoundaries/BoundariesMap";
import {DataGrid, SearchInput, SectionTitle} from "common/components";
import useBoundaries from "../../application/useBoundaries";


const BoundariesContainer = () => {

  const {projectId} = useParams();
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {boundaries} = useBoundaries(projectId as string);
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const mapRef: IMapRef = useRef(null);

  if (!spatialDiscretization || !boundaries) {
    return null;
  }

  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <SectionTitle title={'Boundary conditions'}/>
          <SearchInput
            onSearch={(searchText) => console.log(searchText)}
            buttonText={'Add new boundary'}
          />
          <LeafletMapProvider mapRef={mapRef}>
            <BoundariesContent/>
          </LeafletMapProvider>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <BoundariesMap spatialDiscretization={spatialDiscretization} mapRef={mapRef}/>
      </BodyContent>
    </>
  );
};

export default BoundariesContainer;
