import React, {useEffect, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import SpatialDiscretizationMap from '../components/ModelSpatialDiscretization/SpatialDiscretizationMap';
import {useParams} from 'react-router-dom';
import {useAssets, useSpatialDiscretization} from '../../application';
import Error from 'common/components/Error';
import {AffectedCells, IAffectedCells, IGrid} from '../../types';
import {DataGrid, SectionTitle, Tab, TabPane} from 'common/components';
import {Accordion, AccordionContent} from '../components/Content';
import ModelDomain from '../components/ModelSpatialDiscretization/ModelDomain';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {Header, MenuItem} from 'semantic-ui-react';
import ModelAffectedCells from '../components/ModelSpatialDiscretization/ModelAffectedCells';
import ModelGrid from '../components/ModelSpatialDiscretization/ModelGrid';


const SpatialDiscretizationContainer = () => {

  const [affectedCellsGeometry, setAffectedCellsGeometry] = useState<Feature<Polygon | MultiPolygon> | null>();
  const [gridGeometry, setGridGeometry] = useState<FeatureCollection | null>();
  const [modelGeometry, setModelGeometry] = useState<Polygon | undefined>();
  const [affectedCells, setAffectedCells] = useState<IAffectedCells | undefined>();
  const [grid, setGrid] = useState<IGrid | undefined>();
  const [locked, setLocked] = useState<boolean>(false);

  const [editMode, setEditMode] = useState<'geometry' | 'affected_cells' | 'locked' | 'grid'>(locked ? 'locked' : 'geometry');

  const {projectId} = useParams();
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
    if (spatialDiscretization?.affected_cells) {
      setAffectedCells(spatialDiscretization.affected_cells);
    }
  }, [spatialDiscretization?.affected_cells]);

  useEffect(() => {
    if (spatialDiscretization?.geometry) {
      setModelGeometry(spatialDiscretization.geometry);
    }
  }, [spatialDiscretization?.geometry]);

  useEffect(() => {
    if (spatialDiscretization?.grid) {
      setGrid(spatialDiscretization.grid);
      fetchGridGeometry().then(setGridGeometry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spatialDiscretization?.grid]);

  useEffect(() => {
    if (spatialDiscretization?.affected_cells) {
      fetchAffectedCellsGeometry().then(setAffectedCellsGeometry);
    }
    // eslint-disable-next-line
  }, [spatialDiscretization?.affected_cells]);

  const handleSubmitAffectedCells = async () => {
    if (!projectId || !affectedCells) {
      return;
    }

    if (JSON.stringify(affectedCells) !== JSON.stringify(spatialDiscretization?.affected_cells)) {
      updateAffectedCells(affectedCells);
    }
  };

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

  if (!modelGeometry || !grid || !spatialDiscretization) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={650}>
        <DataGrid>
          <SectionTitle
            title={'Model Geometry'}
            faIcon={<FontAwesomeIcon icon={locked ? faLock : faUnlock}/>}
            faIconText={locked ? 'Locked' : 'Unlocked'}
            faIconOnClick={() => setLocked(!locked)}
          />
          <Accordion defaultActiveIndex={[0, 1]} exclusive={false}>
            <AccordionContent title={'Model domain'}>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[
                  {
                    menuItem: <MenuItem key='model_domain' onClick={() => setEditMode('geometry')}><Header as='h4'>Model Domain</Header></MenuItem>,
                    render: () => <TabPane attached={false}>
                      <ModelDomain
                        isDirty={JSON.stringify(modelGeometry) !== JSON.stringify(spatialDiscretization.geometry)}
                        isLoading={loading}
                        isLocked={locked}
                        onChangeGeometry={setModelGeometry}
                        onReset={() => setModelGeometry(spatialDiscretization.geometry)}
                        onSubmit={handleSubmitGeometry}
                        processShapefile={processShapefile}
                      />
                    </TabPane>,
                  },
                  {
                    menuItem: <MenuItem key='affected_cells' onClick={() => setEditMode('affected_cells')}><Header as='h4'>Affected Cells</Header></MenuItem>,
                    render: () => <TabPane attached={false}>
                      {affectedCells && spatialDiscretization.affected_cells &&
                        <ModelAffectedCells
                          isDirty={!AffectedCells.fromObject(affectedCells).isEqual(AffectedCells.fromObject(spatialDiscretization.affected_cells))}
                          isLoading={loading}
                          isLocked={locked}
                          onReset={() => setAffectedCells(spatialDiscretization.affected_cells)}
                          onSubmit={handleSubmitAffectedCells}
                        />}
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
                    menuItem: 'Grid Properties',
                    render: () => <TabPane attached={false}>
                      <ModelGrid
                        grid={grid}
                        onChange={setGrid}
                        isDirty={JSON.stringify(grid) !== JSON.stringify(spatialDiscretization.grid)}
                        isLoading={loading}
                        isLocked={locked}
                        onReset={() => setGrid(spatialDiscretization.grid)}
                        onSubmit={handleSubmitGrid}
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
        <SpatialDiscretizationMap
          editAffectedCells={'affected_cells' === editMode}
          affectedCellsGeometry={affectedCellsGeometry || undefined}
          onChangeAffectedCell={(row: number, col: number, active: boolean) => {
            if (!affectedCells) {
              return;
            }
            const newAffectedCells = AffectedCells.fromObject(affectedCells);
            newAffectedCells.setActive(row, col, active);
            setAffectedCells(newAffectedCells.toObject() as IAffectedCells);
          }}
          modelGeometry={modelGeometry}
          gridGeometry={gridGeometry || undefined}
          onChangeModelGeometry={(polygon: Polygon) => setModelGeometry(polygon)}
          editModelGeometry={'geometry' === editMode}
        />
      </BodyContent>
    </>
  );
};

export default SpatialDiscretizationContainer;
