import React, {useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {Map, SetupContent} from '../components/ModelSetup';
import {useParams} from 'react-router-dom';
import {useModelSetup} from '../../application';
import {ILengthUnit} from '../../types';
import {Button, DataGrid} from 'common/components';

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
  const [editDomain, setEditDomain] = useState<boolean>(true);
  const {loading, error, createModel} = useModelSetup(projectId as string);

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

  return (
    <>
      <SidebarContent maxWidth={600}>
        <SetupContent
          gridProperties={gridProperties}
          onEditDomainClick={() => setEditDomain(true)}
          onChange={setGridProperties}
          loading={loading}
        />
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
          {error && <div>{error.message}</div>}
          <Button
            style={{marginLeft: 'auto'}}
            size={'tiny'}
            primary={true}
            disabled={!geometry}
            onClick={handleCreateModel}
            loading={loading}
          >
            {'Create Model'}
          </Button>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map
          polygon={geometry}
          onChange={(polygon: Polygon) => {
            setGeometry(polygon);
            setEditDomain(editDomain);
          }}
          editable={true}
        />
      </BodyContent>
    </>
  );
};

export default ModelSetupContainer;
