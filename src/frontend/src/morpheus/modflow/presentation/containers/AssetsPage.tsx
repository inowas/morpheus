import React, {useState} from 'react';
import {ContentWrapper, Grid, Navbar, SectionTitle, Tab, TabPane} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';
import useAssets from '../../application/useAssets';
import {MenuItem, Radio} from 'semantic-ui-react';
import {AssetButtonsGroup, AssetTable} from '../components/Asset';
import MapExample from '../../../../common/components/Map/MapExample';
import AssetsModalContainer from './AssetsModalContainter';
import {FeatureCollection} from 'geojson';

interface IProps {
  basePath: string;
}

const AssetsPage = ({}: IProps) => {
  const {projectId} = useParams();
  const navigateTo = useNavigate();
  const location = useLocation();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);
  const {assets, loading, deleteAsset} = useAssets(projectId as string);

  const [fileType, setFileType] = useState<'Raster' | 'Shape' | 'CSV'>('Raster');
  const [selectedRasterFile, setSelectedRasterFile] = useState<string | null>(null);
  const [selectedShapeFile, setSelectedShapeFile] = useState<string | null>(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState<boolean>(false);


  const getAssetNameById = (id: string | null): string | null => {
    if (!id) return null;
    const foundAsset = assets.find((a) => a.asset_id === id);
    return foundAsset ? foundAsset.file.file_name : null;
  };

  const handleSelectShapeFile = (assetId: string, data: FeatureCollection) => {
    console.warn('ShapeFile selected', assetId, data);
  };

  const handleSelectRasterFile = (assetId: string) => {
    console.warn('RasterFile selected', assetId);
  };


  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
      />
      <ModflowContainer>
        <ContentWrapper style={{paddingTop: '90px', paddingBottom: '60px'}}>
          <Grid.Grid style={{minHeight: '590px'}}>
            <Grid.Column width={11}>
              <SectionTitle title='Assets' style={{marginBottom: '30px'}}/>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[
                  {
                    menuItem: <MenuItem key='model_domain' onClick={() => setFileType('Raster')}>Raster File</MenuItem>,
                    render: () => <TabPane attached={false}>
                      <AssetTable
                        fileType={fileType}
                        assets={assets}
                        loading={loading}
                        deleteAsset={deleteAsset}
                        isReadOnly={isReadOnly}
                        selectedAsset={selectedRasterFile}
                        onAssetSelect={setSelectedRasterFile}
                      />
                      <AssetButtonsGroup
                        isReadOnly={isReadOnly}
                        loading={loading}
                        onUploadFile={setShowFileUploadModal}
                        onDownload={() => console.log('Download selected')}
                        onDelete={() => console.log('Delete selected')}
                      />
                    </TabPane>,
                  },
                  {
                    menuItem: <MenuItem key='affected_cells' onClick={() => setFileType('Shape')}>Shape File</MenuItem>,
                    render: () => <TabPane attached={false}>
                      <AssetTable
                        fileType={fileType}
                        assets={assets}
                        loading={loading}
                        deleteAsset={deleteAsset}
                        isReadOnly={isReadOnly}
                        selectedAsset={selectedShapeFile}
                        onAssetSelect={setSelectedShapeFile}
                      />
                      <AssetButtonsGroup
                        isReadOnly={isReadOnly}
                        loading={loading}
                        onUploadFile={setShowFileUploadModal}
                        onDownload={() => console.log('Download selected')}
                        onDelete={() => console.log('Delete selected')}
                      />

                    </TabPane>,
                  },
                ]}
              />
            </Grid.Column>
            <Grid.Column width={5} style={{display: 'flex', flexDirection: 'column'}}>
              <SectionTitle title='Preview' style={{marginBottom: '30px'}}/>
              {'Shape' === fileType && selectedShapeFile && <p style={{marginBottom: '10px', fontWeight: '600'}}>{getAssetNameById(selectedShapeFile)}</p>}
              {'Raster' === fileType && selectedRasterFile && <p style={{marginBottom: '10px', fontWeight: '600'}}>{getAssetNameById(selectedRasterFile)}</p>}
              <MapExample
                editable={false}
                geojson={{
                  type: 'FeatureCollection',
                  features: [],
                }}
                onChangeGeojson={() => console.log('changed')}
                coords={[51.051772741784625, 13.72531677893111]}
              />

              {'Raster' === fileType && <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                <Radio
                  label="Band 1"
                  value={'band_1'}
                />
                <Radio
                  label="Band 2"
                  value={'band_2'}
                />
                <Radio
                  label="Band 3"
                  value={'band_3'}
                />
              </div>}
            </Grid.Column>
          </Grid.Grid>
        </ContentWrapper>
      </ModflowContainer>
      {showFileUploadModal && !isReadOnly && 'Raster' === fileType &&
        <AssetsModalContainer onClose={() => setShowFileUploadModal(false)} onSelectRasterFile={handleSelectRasterFile}/>}
      {showFileUploadModal && !isReadOnly && 'Shape' === fileType &&
        <AssetsModalContainer onClose={() => setShowFileUploadModal(false)} onSelectShapefile={handleSelectShapeFile}/>}
    </>
  );
};


export default AssetsPage;
