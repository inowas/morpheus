import React, {useEffect, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Feature, FeatureCollection, GeoJSON, MultiPolygon, Polygon} from 'geojson';
import {SpatialDiscretizationContent, SpatialDiscretizationMap} from '../components/ModelSpatialDiscretization';
import {useParams} from 'react-router-dom';
import {useAssets, useSpatialDiscretization} from '../../application';
import Error from 'common/components/Error';
import {AffectedCells, IAffectedCells, IGrid} from '../../types';
import {Button, DataGrid} from 'common/components';


const SpatialDiscretizationContainer = () => {

  const [affectedCellsGeometry, setAffectedCellsGeometry] = useState<Feature<Polygon | MultiPolygon> | null>();
  const [gridGeometry, setGridGeometry] = useState<FeatureCollection | null>();
  const [modelGeometry, setModelGeometry] = useState<Polygon | undefined>();
  const [affectedCells, setAffectedCells] = useState<IAffectedCells | undefined>();
  const [grid, setGrid] = useState<IGrid | undefined>();
  const [locked, setLocked] = useState<boolean>(false);
  const [editModelGeometry, setEditModelGeometry] = useState<boolean>(false);
  const [editAffectedCells, setEditAffectedCells] = useState<boolean>(false);

  const [shapeFileGeoJson, setShapeFileGeoJson] = useState<GeoJSON | undefined>();

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

  const {uploadAsset, fetchAssetData} = useAssets(projectId as string);

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
  }, [spatialDiscretization?.grid]);

  useEffect(() => {
    if (spatialDiscretization?.affected_cells) {
      fetchAffectedCellsGeometry().then(setAffectedCellsGeometry);
    }
  }, [spatialDiscretization?.affected_cells]);

  const handleSubmit = async () => {
    if (projectId && modelGeometry && grid) {
      if (spatialDiscretization?.geometry !== modelGeometry) {
        updateGeometry(modelGeometry);
      }
      setEditModelGeometry(false);

      if (affectedCells && spatialDiscretization?.affected_cells !== affectedCells) {
        updateAffectedCells(affectedCells);
      }

      setEditAffectedCells(false);

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

  if (!modelGeometry || !grid || !spatialDiscretization) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  const handleShapeFileInputChange = async (file: File) => {
    // upload shape file to server
    // when successfully uploaded, get shape file metadata from server
    // load shapefile data from server as geojson and show in a modal
    // select polygon geometry in the model and return it as model geometry
    // put this logic in a child component
    const assetId = await uploadAsset(file, 'shapefile');

    if (!assetId) {
      return;
    }

    const geojson = await fetchAssetData(assetId) as unknown as GeoJSON | undefined;
    if (!geojson) {
      return;
    }

    console.log(geojson);

    setShapeFileGeoJson(geojson);
  };

  return (
    <>
      <SidebarContent maxWidth={600}>
        <SpatialDiscretizationContent
          grid={grid}
          onEditAffectedCellsClick={() => setEditAffectedCells(true)}
          onEditModelGeometryClick={() => setEditModelGeometry(true)}
          readOnly={locked}
          onChangeLock={setLocked}
          onChange={setGrid}
          onShapeFileInputChange={handleShapeFileInputChange}
        />
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
          <Button
            style={{marginLeft: 'auto'}}
            size={'tiny'}
            disabled={locked}
            onClick={() => {
              setModelGeometry(spatialDiscretization.geometry);
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
          editAffectedCells={editAffectedCells}
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
          grid={gridGeometry || undefined}
          onChangeModelGeometry={(polygon: Polygon) => {
            setModelGeometry(polygon);
            setEditModelGeometry(false);
          }}
          editModelGeometry={!locked && editModelGeometry}
        />
      </BodyContent>
    </>
  );
};

export default SpatialDiscretizationContainer;
