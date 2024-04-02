import React, {useEffect, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {SpatialDiscretizationMap, SpatialDiscretizationContent} from '../components/ModelSpatialDiscretization';
import {useParams} from 'react-router-dom';
import {useSpatialDiscretization} from '../../application';
import Error from 'common/components/Error';
import {IGrid} from '../../types';


const SpatialDiscretizationContainer = () => {

  const [geometry, setGeometry] = useState<Polygon | undefined>();
  const [locked, setLocked] = useState<boolean>(false);
  const [editDomain, setEditDomain] = useState<boolean>(false);

  const {projectId} = useParams();
  const {spatialDiscretization, loading, error, updateSpatialDiscretization} = useSpatialDiscretization(projectId);

  useEffect(() => {
    if (spatialDiscretization) {
      setGeometry(spatialDiscretization.geometry);
    }
  }, [spatialDiscretization]);

  if (!projectId) {
    return null;
  }

  if (!spatialDiscretization) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={600}>
        <SpatialDiscretizationContent
          grid={spatialDiscretization.grid}
          onEditDomainClick={() => setEditDomain(true)}
          locked={locked}
          onChangeLock={setLocked}
          onChange={(grid: IGrid) => updateSpatialDiscretization({...spatialDiscretization, grid})}
          loading={loading}
        />
      </SidebarContent>
      <BodyContent>
        <SpatialDiscretizationMap
          polygon={geometry}
          onChange={(polygon: Polygon) => {
            setGeometry(polygon);
            setEditDomain(false);
          }}
          editable={!locked && editDomain}
        />
      </BodyContent>
    </>
  );
};

export default SpatialDiscretizationContainer;
