import React, {useEffect, useMemo, useState} from 'react';
import {ContentWrapper, FileUploadButton, Grid, ImageRenderer, Loader, Navbar, Section, SectionTitle, Widget} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useAssets from '../../application/useAssets';
import {Radio, Search} from 'semantic-ui-react';
import {AssetTable} from '../components/Asset';
import {IAsset, IAssetData, IAssetRasterData, IAssetShapefileData, IRasterAsset} from '../../types';
import {Map, GeoJsonLayer} from 'common/components/Map';
import {GeoJSON} from 'geojson';
import ProjectTitleContainer from './ProjectTitleContainer';

interface IProps {
  basePath: string;
}

const isRasterAsset = (asset: IAsset | null): asset is IRasterAsset => 'geo_tiff' === asset?.type;
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

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssetData, setSelectedAssetData] = useState<IAssetData | null>(null);
  const [search, setSearch] = useState<string>('');

  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.asset_id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => asset.file.file_name.toLowerCase().includes(search.toLowerCase()));
  }, [assets, search]);

  useEffect(() => {
    if (!selectedAssetId) {
      return setSelectedAssetData(null);
    }

    fetchAssetData(selectedAssetId).then((data) => data && setSelectedAssetData(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssetId]);

  const handleUploadSelectedRasterFiles = async (files: File[]) => {
    for (const file of files) {
      const assetId = await uploadRasterFile(file);
      if (assetId) {
        setSelectedAssetId(assetId);
      }
    }
  };

  const handleUploadSelectedShapeFiles = async (files: File[]) => {
    const assetId = await uploadShapefile(files);
    if (assetId) {
      setSelectedAssetId(assetId);
    }
  };

  const handleSelectAsset = (asset: IAsset) => {
    setSelectedAssetId(asset.asset_id);
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

  console.log(navbarItems);

  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
      >
        <ProjectTitleContainer/>
      </Navbar>
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
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
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
                  <div>
                    <Search
                      placeholder={'Search assets...'}
                      showNoResults={false}
                      value={search}
                      onSearchChange={(_, {value}) => setSearch(value || '')}
                    />
                  </div>
                </div>
              </Widget>
              <Widget>
                <AssetTable
                  assets={filteredAssets}
                  loadingAsset={loadingAsset}
                  loadingList={loadingList}
                  deleteAsset={deleteAsset}
                  updateAssetFileName={updateAssetFileName}
                  isReadOnly={isReadOnly}
                  selectedAsset={selectedAsset}
                  onSelectAsset={handleSelectAsset}
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
