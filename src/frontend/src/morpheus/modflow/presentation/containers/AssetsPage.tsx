import React, {useEffect, useState} from 'react';
import {ContentWrapper, FileUploadButton, Grid, ImageRenderer, Loader, Navbar, Section, SectionTitle, Widget} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useAssets from '../../application/useAssets';
import {Radio, Search} from 'semantic-ui-react';
import {AssetTable} from '../components/Asset';
import {IAsset, IAssetData, IAssetRasterData, IAssetShapefileData, IRasterAsset, IShapefileAsset} from '../../types';
import {Map, GeoJsonLayer} from 'common/components/Map';
import {GeoJSON} from 'geojson';
import fileNameInput from '../components/Asset/AssetTable/FileNameInput';

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
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);
  const {
    assets,
    loadingAsset,
    loadingData,
    loadingList,
    uploadingAsset,
    deleteAsset,
    uploadShapefile,
    uploadRasterFile,
    fetchAssetData,
    updateAssetFileName,
    error,
  } = useAssets(projectId as string);

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
      await uploadRasterFile(file);
    }
  };

  const handleUploadSelectedShapeFiles = async (files: File[]) => {
    await uploadShapefile(files);
  };

  const renderData = (asset: IAsset | null, data: IAssetData | null) => {
    if (loadingData) {
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
          <SectionTitle
            style={{marginTop: '20px'}}
            title={'Assets'}
            as={'h1'}
          />
          <Grid.Grid style={{minHeight: 'calc(100vh - 200px)'}}>
            <Grid.Column width={10}>
              <Widget>
                <FileUploadButton
                  acceptFiles={'.geotiff,.tif,.tiff'}
                  buttonContent={'Upload raster files'}
                  isReadOnly={isReadOnly}
                  loading={uploadingAsset}
                  onSelectFiles={handleUploadSelectedRasterFiles}
                />
                <FileUploadButton
                  acceptFiles={'.zip,.shp,.shx,.dbf,.prj,.cpg,.qmd,.sbn,.sbx,.shx'}
                  buttonContent={'Upload shapefiles'}
                  isReadOnly={isReadOnly}
                  loading={uploadingAsset}
                  onSelectFiles={handleUploadSelectedShapeFiles}
                />
              </Widget>
              <Widget>
                <AssetTable
                  fileType={selectedAssetType}
                  assets={assets}
                  loadingAsset={loadingAsset}
                  loadingList={loadingList}
                  deleteAsset={deleteAsset}
                  updateAssetFileName={updateAssetFileName}
                  isReadOnly={isReadOnly}
                  selectedAsset={selectedAsset}
                  onSelectAsset={setSelectedAsset}
                />
              </Widget>
            </Grid.Column>

            {/* Preview */}
            <Grid.Column width={6}>
              <Section
                title={'Preview'}
                collapsable={false}
              >
                <div style={{height: '420px', overflow: 'auto', marginTop: '20px'}}>
                  {renderData(selectedAsset, selectedAssetData)}
                </div>
                {isRasterAsset(selectedAsset) &&
                  <div style={{display: 'flex', gap: '20', margin: '0'}}>
                    {new Array(selectedAsset.metadata.n_bands).fill(0).map((_, index) => (
                      <Radio
                        key={index}
                        label={`Band ${index + 1}`}
                        value={`band_${index + 1}`}
                        checked={0 === index}
                      />
                    ))}
                  </div>}
              </Section>
            </Grid.Column>
          </Grid.Grid>
        </ContentWrapper>
      </ModflowContainer>
    </>
  );
};


export default AssetsPage;
