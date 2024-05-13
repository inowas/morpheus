import React, {useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {useParams} from 'react-router-dom';
import {useAssets, useModelSetup} from '../../application';
import {IError, ILengthUnit} from '../../types';
import {Button, DataGrid, SectionTitle, Tab} from 'common/components';
import {Accordion, AccordionContent} from '../components/Content';
import {TabPane} from 'semantic-ui-react';
import ShapeFileInput from '../../../../common/components/ShapeFileInput';
import SetupGridProperties from '../components/ModelSetup/SetupGridProperties';
import ModelSetupMap from '../components/ModelSetup/Map';
import useProjectPermissions from '../../application/useProjectPermissions';

interface ICreateGrid {
  n_cols: number;
  n_rows: number;
  rotation: number;
  length_unit: ILengthUnit;
}

const defaultGrid: ICreateGrid = {
  n_cols: 100,
  n_rows: 50,
  rotation: 0,
  length_unit: 'meters' as ILengthUnit,
};

const ModelSetupContainer = () => {

  const {projectId} = useParams();
  const [gridProperties, setGridProperties] = useState<ICreateGrid>(defaultGrid);
  const [geometry, setGeometry] = useState<Polygon | undefined>();
  const {loading, error: serverError, createModel} = useModelSetup(projectId as string);
  const [shapeFileError, setShapeFileError] = useState<IError | null>(null);
  const {isReadOnly} = useProjectPermissions(projectId as string);

  const {processShapefile} = useAssets(projectId as string);
  const handleCreateModel = async () => {
    if (!geometry) {
      return;
    }
    try {
      await createModel({
        geometry: geometry,
        grid_properties: gridProperties,
        length_unit: gridProperties.length_unit,
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (!projectId) {
    return null;
  }

  const handleSubmitShapeFile = async (zipFile: File) => {
    setShapeFileError(null);
    try {
      const assetShapefileData = await processShapefile(zipFile);
      const geoJson = assetShapefileData.data;
      if ('Polygon' === geoJson.type) {
        setGeometry(geoJson);
      }

      if ('Feature' === geoJson.type && 'Polygon' === geoJson.geometry.type) {
        return setGeometry(geoJson.geometry as Polygon);
      }

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
      <SidebarContent maxWidth={600}>
        <DataGrid>
          <SectionTitle title={'Model Geometry'}/>
          <Accordion defaultActiveIndex={[0, 1]} exclusive={false}>
            <AccordionContent title={'Model domain'}>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[{
                  menuItem: 'Upload File',
                  render: () => <TabPane attached={false}>
                    <ShapeFileInput onSubmit={handleSubmitShapeFile} readOnly={isReadOnly}/>
                    {shapeFileError && !isReadOnly && <div>{shapeFileError.message}</div>}
                  </TabPane>,
                }]}
              />
            </AccordionContent>
            <AccordionContent title={'Model grid'}>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[{
                  menuItem: 'Grid Properties',
                  render: () => <TabPane attached={false}>
                    <SetupGridProperties
                      gridProperties={gridProperties}
                      onChange={setGridProperties}
                      readOnly={isReadOnly}
                    />
                  </TabPane>,
                }]}
              />
            </AccordionContent>
          </Accordion>
        </DataGrid>
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
          {serverError && <div>{serverError.message}</div>}
          {!isReadOnly && <Button
            style={{marginLeft: 'auto'}}
            size={'tiny'}
            primary={true}
            disabled={!geometry}
            onClick={handleCreateModel}
            loading={loading}
          >
            {'Create Model'}
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
