import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAssets, useSpatialDiscretization} from '../../application';

import useProjectPrivileges from '../../application/useProjectPrivileges';
import {IGrid} from '../../types';
import type {Polygon} from 'geojson';
import {Accordion, AccordionContent, AffectedCellsMapLayer, BodyContent, GridRotationMapLayer, ModelDomain, ModelGeometryMapLayer, ModelGrid, SidebarContent} from '../components';
import {DataGrid, Error, LockButton, Map, Menu, SectionTitle, Tab, TabPane} from 'common/components';


const SpatialDiscretizationContainer = () => {

  const [modelGeometry, setModelGeometry] = useState<Polygon | undefined>();
  const [grid, setGrid] = useState<IGrid | undefined>();
  const [locked, setLocked] = useState<boolean>(false);

  const {projectId} = useParams();
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

  return (
    <>
      <SidebarContent maxWidth={500}>
        <DataGrid>
          <SectionTitle
            title={'Model Geometry'}
          >
            <LockButton
              title={locked ? 'Locked' : 'Unlocked'}
              onClick={() => !isReadOnly && setLocked(!locked)}
              locked={locked}
            />
          </SectionTitle>
          <Accordion defaultActiveIndex={[0, 1]} exclusive={false}>
            <AccordionContent title={'Model domain'}>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[
                  {
                    menuItem: <Menu.MenuItem
                      role='tabitem'
                      as='span'
                      key='model_domain'
                      onClick={() => setEditMode('geometry')}
                    >
                      Model Domain
                    </Menu.MenuItem>,
                    render: () => <TabPane attached={false}>
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
                    </TabPane>,
                  },
                ]}
              />
            </AccordionContent>
            <AccordionContent title={'Model grid'}>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[
                  {
                    menuItem: <Menu.MenuItem
                      role='tabitem'
                      as='span'
                      key='grid_properties'
                    >
                      Grid Properties
                    </Menu.MenuItem>,
                    render: () => <TabPane attached={false}>
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
                    </TabPane>,
                  },
                ]}
              />
            </AccordionContent>
          </Accordion>
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
