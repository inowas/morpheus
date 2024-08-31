import React, {useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {useParams} from 'react-router-dom';
import {useAssets, useModelSetup} from '../../application';
import {IError, ILengthUnit} from '../../types';
import {Button, DataGrid, Section, SectionTitle} from 'common/components';
import ShapeFileInput from '../../../../common/components/ShapeFileInput';
import ModelSetupMap from '../components/ModelSetup/Map';
import useProjectPrivileges from '../../application/useProjectPrivileges';

interface ICreateGrid {
  n_cols: number;
  n_rows: number;
  rotation: number;
  length_unit: ILengthUnit;
}

const defaultGrid: ICreateGrid = {
  n_cols: 100,
  n_rows: 100,
  rotation: 0,
  length_unit: 'meters' as ILengthUnit,
};

const ModelSetupContainer = () => {

  const {projectId} = useParams();
  const [geometry, setGeometry] = useState<Polygon | undefined>();
  const {loading, error: serverError, createModel} = useModelSetup(projectId as string);
  const [shapeFileError, setShapeFileError] = useState<IError | null>(null);
  const {isReadOnly} = useProjectPrivileges(projectId as string);

  const {processShapefile} = useAssets(projectId as string);
  const handleCreateModel = async () => {
    if (!geometry) {
      return;
    }
    try {
      await createModel({
        geometry: geometry,
        grid_properties: defaultGrid,
        length_unit: defaultGrid.length_unit,
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (!projectId) {
    return null;
  }

  const handleSubmitShapeFiles = async (files: File[]) => {
    setShapeFileError(null);
    try {
      const assetShapefileData = await processShapefile(files);
      const geoJson = assetShapefileData.data;

      if ('FeatureCollection' === geoJson.type) {
        const polygon = geoJson.features.find((f) => 'Polygon' === f.geometry.type);
        if (polygon) {
          return setGeometry(polygon.geometry as Polygon);
        }
      }

      setShapeFileError({
        code: 400,
        message: 'No polygon found in shapefile.',
      });
    } catch (e) {
      console.log(e);
      setShapeFileError({
        code: 400,
        message: 'Error processing shapefile.',
      });
    }
  };

  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <SectionTitle title={'Model geometry'}/>
          <Section
            title={'Model domain'} collapsable={true}
            open={true}
          >
            <ShapeFileInput onSubmit={handleSubmitShapeFiles} readOnly={isReadOnly}/>
            {shapeFileError && !isReadOnly && <div>{shapeFileError.message}</div>}
          </Section>
        </DataGrid>
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '15px', marginRight: '13px'}}>
          {serverError && <div>{serverError.message}</div>}
          {!isReadOnly &&
            <Button
              style={{marginLeft: 'auto'}}
              size={'tiny'}
              primary={true}
              labelPosition={'left'}
              icon={'plus'}
              disabled={!geometry}
              onClick={handleCreateModel}
              loading={loading}
              content={'Create model'}
            >
            </Button>}
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <ModelSetupMap
          polygon={geometry as Polygon}
          onChange={(polygon: Polygon) => {
            setGeometry(polygon);
          }}
          editable={!isReadOnly}
        />
      </BodyContent>
    </>
  );
};

export default ModelSetupContainer;
