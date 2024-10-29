import React, {useEffect, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {useParams, useSearchParams} from 'react-router-dom';
import {useAssets, useSpatialDiscretization} from '../../application';
import Error from 'common/components/Error';
import {IGrid} from '../../types';
import {DataGrid, LockButton, Section, SectionTitle} from 'common/components';
import ModelDomain from '../components/ModelSpatialDiscretization/ModelDomain';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import {Map} from 'common/components/Map';

import ModelGrid from '../components/ModelSpatialDiscretization/ModelGrid';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import AffectedCellsMapLayer from '../components/ModelSpatialDiscretization/AffectedCellsMapLayer';
import GridRotationMapLayer from '../components/ModelSpatialDiscretization/GridRotationMapLayer';


const SpatialDiscretizationContainer = () => {

  const [modelGeometry, setModelGeometry] = useState<Polygon | undefined>();
  const [grid, setGrid] = useState<IGrid | undefined>();
  const [locked, setLocked] = useState<boolean>(false);

  const {projectId} = useParams();
  const [searchParams] = useSearchParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);

  const getInitialEditMode = () => {
    if (locked) {
      return 'locked';
    }

    if (isReadOnly) {
      return 'readOnly';
    }

    return 'geometry';
  };

  const [editMode, setEditMode] = useState<'geometry' | 'affected_cells' | 'locked' | 'grid' | 'readOnly'>(getInitialEditMode());

  const {
    spatialDiscretization,
    loading,
    error,
    updateAffectedCells,
    updateGeometry,
    updateGrid,
    fetchAffectedCellsGeometry,
    fetchGridGeometry,
  } = useSpatialDiscretization(projectId as string);

  const {processShapefile} = useAssets(projectId as string);


  useEffect(() => {
    if (spatialDiscretization?.geometry) {
      setModelGeometry(spatialDiscretization.geometry);
    }
  }, [spatialDiscretization?.geometry]);

  useEffect(() => {
    if (spatialDiscretization?.grid) {
      setGrid(spatialDiscretization.grid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spatialDiscretization?.grid]);

  const handleSubmitGeometry = async () => {
    if (!projectId || !modelGeometry) {
      return;
    }

    if (JSON.stringify(modelGeometry) !== JSON.stringify(spatialDiscretization?.geometry)) {
      updateGeometry(modelGeometry);
    }
  };

  const handleSubmitGrid = async () => {
    if (!projectId || !grid) {
      return;
    }

    if (JSON.stringify(grid) !== JSON.stringify(spatialDiscretization?.grid)) {
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

  if (!modelGeometry || !grid || !spatialDiscretization || !spatialDiscretization.affected_cells) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  const sidebarVisible = 'false' !== searchParams.get('sidebar');

  return (
    <>
      <SidebarContent maxWidth={700} defaultOpen={sidebarVisible}>
        <DataGrid>
          <SectionTitle
            title={'Model geometry'}
          >
            <LockButton
              title={locked ? 'Locked' : 'Unlocked'}
              onClick={() => !isReadOnly && setLocked(!locked)}
              locked={locked}
            />
          </SectionTitle>

          <Section
            title={'Model domain'}
            collapsable={true}
            open={false}
          >
            <ModelDomain
              isDirty={JSON.stringify(modelGeometry) !== JSON.stringify(spatialDiscretization.geometry)}
              isLoading={loading}
              isLocked={locked}
              onChangeGeometry={setModelGeometry}
              onReset={() => setModelGeometry(spatialDiscretization.geometry)}
              onSubmit={handleSubmitGeometry}
              processShapefile={processShapefile}
              readOnly={isReadOnly}
            />
          </Section>

          <Section
            title={'Model grid'}
            collapsable={true}
            open={true}
          >
            <ModelGrid
              grid={grid}
              onChange={setGrid}
              isDirty={JSON.stringify(grid) !== JSON.stringify(spatialDiscretization.grid)}
              isLoading={loading}
              isLocked={locked}
              onReset={() => setGrid(spatialDiscretization.grid)}
              onSubmit={handleSubmitGrid}
              readOnly={isReadOnly}
            />
          </Section>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map>
          <ModelGeometryMapLayer
            modelGeometry={modelGeometry}
            onChangeModelGeometry={setModelGeometry}
            editModelGeometry={'geometry' === editMode}
          />
          <AffectedCellsMapLayer
            affectedCells={spatialDiscretization.affected_cells}
            fetchAffectedCellsGeometry={fetchAffectedCellsGeometry}
            fetchGridGeometry={fetchGridGeometry}
            onChangeAffectedCells={updateAffectedCells}
            isReadOnly={isReadOnly}
            inverted={true}
            showAffectedCellsByDefault={true}
          />

          {spatialDiscretization.grid.rotation !== grid.rotation && (
            <GridRotationMapLayer modelGeometry={modelGeometry} rotation={grid.rotation}/>
          )}
        </Map>
      </BodyContent>
    </>
  );
};

export default SpatialDiscretizationContainer;
