import React, {useEffect, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {SpatialDiscretizationMap, SpatialDiscretizationContent} from '../components/ModelSpatialDiscretization';
import {useParams} from 'react-router-dom';
import {useSpatialDiscretization} from '../../application';
import Error from 'common/components/Error';
import {IGrid} from '../../types';
import {Button, DataGrid} from 'common/components';


const SpatialDiscretizationContainer = () => {

  const [geometry, setGeometry] = useState<Polygon | undefined>();
  const [grid, setGrid] = useState<IGrid | undefined>();
  const [locked, setLocked] = useState<boolean>(false);
  const [editDomain, setEditDomain] = useState<boolean>(false);

  const {projectId} = useParams();
  const {spatialDiscretization, loading, error, updateGeometry, updateGrid} = useSpatialDiscretization(projectId as string);

  useEffect(() => {
    if (spatialDiscretization?.geometry) {
      setGeometry(spatialDiscretization.geometry);
    }
  }, [spatialDiscretization?.geometry]);

  useEffect(() => {
    if (spatialDiscretization?.grid) {
      setGrid(spatialDiscretization.grid);
    }
  }, [spatialDiscretization?.grid]);

  const handleSubmit = async () => {
    if (projectId && geometry && grid) {
      if (spatialDiscretization?.geometry !== geometry) {
        updateGeometry(geometry);
      }

      if (grid.n_cols === spatialDiscretization?.grid.n_cols && grid.n_rows === spatialDiscretization?.grid.n_rows && grid.rotation === spatialDiscretization?.grid.rotation && grid.length_unit === spatialDiscretization?.grid.length_unit) {
        return;
      }
      updateGrid({
        n_cols: grid.n_cols,
        n_rows: grid.n_rows,
        rotation: grid.rotation,
        length_unit: grid.length_unit,
      });
    }
  };

  if (!projectId) {
    return null;
  }

  if (!geometry || !grid || !spatialDiscretization) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={600}>
        <SpatialDiscretizationContent
          grid={grid}
          onEditDomainClick={() => setEditDomain(true)}
          readOnly={locked}
          onChangeLock={setLocked}
          onChange={setGrid}
        />
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
          <Button
            style={{marginLeft: 'auto'}}
            size={'tiny'}
            disabled={locked}
            onClick={() => {
              setGeometry(spatialDiscretization.geometry);
              setGrid(spatialDiscretization.grid);
            }}
          >
            {'Reset'}
          </Button>
          <Button
            primary={true}
            size={'tiny'}
            disabled={locked}
            onClick={handleSubmit}
            loading={loading}
          >
            {'Apply'}
          </Button>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <SpatialDiscretizationMap
          polygon={geometry}
          onChange={(polygon: Polygon) => {
            console.log(polygon);
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
