import React, {useEffect, useState} from 'react';
import {ContentWrapper, Grid, ImageRenderer, Loader, Navbar, SectionTitle, Tab, TabPane} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';
import useAssets from '../../application/useAssets';
import {MenuItem, Radio} from 'semantic-ui-react';
import {AssetButtonsGroup, AssetTable} from '../components/Asset';
import {IAsset, IAssetData, IAssetRasterData, IAssetShapefileData, IRasterAsset, IShapefileAsset} from '../../types';
import JSZip from 'jszip';
import {Map, GeoJsonLayer} from 'common/components/Map';
import {GeoJSON} from 'geojson';

interface IProps {
  basePath: string;
}

const isRasterAsset = (asset: IAsset | null): asset is IRasterAsset => 'geo_tiff' === asset?.type;
const isShapeAsset = (asset: IAsset | null): asset is IShapefileAsset => 'shapefile' === asset?.type;

const isRasterAssetData = (data: IAssetData | null): data is IAssetRasterData => 'geo_tiff' === data?.type;
const isShapeAssetData = (data: IAssetData | null): data is IAssetShapefileData => 'shapefile' === data?.type;

const AssetsPage = ({}: IProps) => {
  const {projectId} = useParams();
  const navigateTo = useNavigate();
  const location = useLocation();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);
  const {assets, loading, deleteAsset, uploadAsset, fetchAssetData} = useAssets(projectId as string);

  const [selectedAssetType, setSelectedAssetType] = useState<'shape' | 'raster' | 'csv'>('raster');
  const [rasterAssets, setRasterAssets] = useState<IAsset[]>([]);
  const [shapeAssets, setShapeAssets] = useState<IAsset[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);
  const [selectedAssetData, setSelectedAssetData] = useState<IAssetData | null>(null);

  useEffect(() => {
    setRasterAssets(assets.filter((item) => isRasterAsset(item)));
    setShapeAssets(assets.filter((item) => isShapeAsset(item)));
  }, [assets]);

  useEffect(() => {
    if (!selectedAsset) {
      return setSelectedAssetData(null);
    }

    fetchAssetData(selectedAsset.asset_id).then((data) => data && setSelectedAssetData(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  const handleUploadSelectedRasterFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.name.endsWith('.tif') || file.name.endsWith('.tiff') || file.name.endsWith('.geotiff')) {
        await uploadAsset(file);
      }
    }
  };

  const handleUploadSelectedShapeFiles = async (files: File[]) => {
    // Check if the file is a zip file and return this file directly
    const zipFile = files.find((file) => file.name.endsWith('.zip'));
    if (zipFile) {
      uploadAsset(zipFile);
    }

    // if no zip file is found, compress the files and upload the zip file
    if (!zipFile) {
      const zip = new JSZip();
      files.forEach((file) => zip.file(`${file.name}`, file));
      const zipContent = await zip.generateAsync({type: 'blob'});
      const file = new File([zipContent], 'shapefile.zip', {type: 'application/zip'});
      await uploadAsset(file);
    }
  };

  const renderData = (asset: IAsset | null, data: IAssetData | null) => {

    if (loading) {
      return <Loader
        style={{marginTop: '50px'}}
        inline={'centered'}
        size={'large'}
        active={true}
      />;
    }

    if (!asset || !data) {
      return null;
    }

    if (asset.type !== data.type) {
      return null;
    }

    if (isRasterAssetData(data)) {
      return <ImageRenderer data={data.data}/>;
    }

    if (isShapeAssetData(selectedAssetData)) {
      return (
        <Map>
          <GeoJsonLayer geoJson={selectedAssetData.data as GeoJSON}/>
        </Map>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
      />
      <ModflowContainer>
        <ContentWrapper>
          <Grid.Grid style={{paddingTop: '50px', minHeight: 'calc(100vh - 200px)'}}>
            <Grid.Column width={10}>
              <SectionTitle title='Assets' style={{marginBottom: '30px'}}/>
              <Tab
                variant='primary'
                menu={{pointing: true}}
                panes={[
                  {
                    menuItem: <MenuItem key='model_domain' onClick={() => setSelectedAssetType('raster')}>Raster File</MenuItem>,
                    render: () => <TabPane attached={false}>
                      <AssetTable
                        fileType={selectedAssetType}
                        assets={rasterAssets}
                        loading={loading}
                        deleteAsset={deleteAsset}
                        isReadOnly={isReadOnly}
                        selectedAsset={isRasterAsset(selectedAsset) ? selectedAsset : null}
                        onSelectAsset={setSelectedAsset}
                      />
                      <AssetButtonsGroup
                        acceptFiles={'.geotiff,.tif,.tiff'}
                        buttonContent={'Upload Raster Files'}
                        isReadOnly={isReadOnly}
                        loading={loading}
                        onSelectFiles={handleUploadSelectedRasterFiles}
                      />
                    </TabPane>,
                  },
                  {
                    menuItem: <MenuItem key='affected_cells' onClick={() => setSelectedAssetType('shape')}>Shape File</MenuItem>,
                    render: () => <TabPane attached={false}>
                      <AssetTable
                        fileType={selectedAssetType}
                        assets={shapeAssets}
                        loading={loading}
                        deleteAsset={deleteAsset}
                        isReadOnly={isReadOnly}
                        selectedAsset={isShapeAsset(selectedAsset) ? selectedAsset : null}
                        onSelectAsset={setSelectedAsset}
                      />
                      <AssetButtonsGroup
                        acceptFiles={'.zip,.shp,.shx,.dbf,.prj,.cpg,.qmd,.sbn,.sbx,.shx'}
                        buttonContent={'Upload Shapefiles'}
                        isReadOnly={isReadOnly}
                        loading={loading}
                        onSelectFiles={handleUploadSelectedShapeFiles}
                      />
                    </TabPane>,
                  },
                ]}
              />
            </Grid.Column>

            {/* Preview */}
            <Grid.Column width={6} style={{display: 'flex', flexDirection: 'column'}}>
              <SectionTitle title='Preview'/>
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <p style={{fontWeight: '600', padding: '10px'}}>{selectedAsset?.file.file_name}</p>
                {isRasterAsset(selectedAsset) &&
                  <div style={{display: 'flex', gap: 10, margin: 10}}>
                    {new Array(selectedAsset.metadata.n_bands).fill(0).map((_, index) => (
                      <Radio
                        key={index}
                        label={`Band ${index + 1}`}
                        value={`band_${index + 1}`}
                        checked={0 === index}
                      />
                    ))}
                  </div>}
              </div>

              {renderData(selectedAsset, selectedAssetData)}

            </Grid.Column>
          </Grid.Grid>
        </ContentWrapper>
      </ModflowContainer>
    </>
  );
};


export default AssetsPage;
