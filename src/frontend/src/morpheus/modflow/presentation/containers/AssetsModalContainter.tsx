import React, {useEffect, useState} from 'react';
import {Modal, RasterFileInput} from 'common/components';
import useProjectPermissions from '../../application/useProjectPermissions';
import useAssets from '../../application/useAssets';
import {Button, Container, Grid, GridColumn, Header, List, Segment} from 'semantic-ui-react';
import {useParams} from 'react-router-dom';
import {IAssetId} from '../../types';

interface IProps {
  onSelectRasterFile: (assetId: IAssetId) => void;
  onClose: () => void;
}

const AssetsModalContainer = ({onClose, onSelectRasterFile}: IProps) => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {assets, loading, uploadAsset} = useAssets(projectId as string);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    if (0 < assets.length && !selectedAssetId) {
      setSelectedAssetId(assets[0].asset_id);
    }
  }, [assets, selectedAssetId]);

  if (isReadOnly) {
    return null;
  }

  const handleSelectAsset = (assetId: IAssetId) => {
    setSelectedAssetId(assetId);
  };

  const handleRasterFileUpload = async (file: File) => {
    const assetId = await uploadAsset(file, 'Raster File');
    if (assetId) {
      setSelectedAssetId(assetId);
    }
  };

  return (
    <Modal.Modal
      size={'large'} closeIcon={true}
      open={true} onClose={onClose}
      dimmer={'blurring'}
      closeOnEscape={false}
      closeOnDimmerClick={false}
    >
      {loading && <Segment loading={true}/>}
      <Modal.Header>
        Assets
        <RasterFileInput readOnly={isReadOnly} onSubmit={handleRasterFileUpload}/>
      </Modal.Header>
      <Modal.Content>
        <Segment
          size={'large'} raised={true}
          loading={loading}
        >
          <Grid divided={true}>
            <GridColumn width={4}>
              <List divided={true} relaxed={true}>
                {assets.map((asset) => (
                  <List.Item
                    key={asset.asset_id}
                    onClick={() => setSelectedAssetId(asset.asset_id)}
                    style={{cursor: 'pointer', backgroundColor: selectedAssetId === asset.asset_id ? '#f9f9f9' : 'white'}}
                  >
                    {selectedAssetId === asset.asset_id ? <List.Icon name='file'/> : <List.Icon name='file outline'/>}
                    <List.Header>{asset.file.file_name}</List.Header>
                    <List.Description>{asset.type}</List.Description>
                  </List.Item>))}
              </List>
            </GridColumn>
            <GridColumn width={12}>
              <Container>
                <Header as={'h2'}>Asset Details</Header>
                <p>Asset ID: {selectedAssetId}</p>
              </Container>
            </GridColumn>
          </Grid>
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive={true}
          content={'Submit'}
          disabled={!selectedAssetId}
          onClick={() => {
            if (selectedAssetId) {
              onSelectRasterFile(selectedAssetId);
              onClose();
            }
          }}
        />
        <Button content={'Close'} onClick={onClose}/>
      </Modal.Actions>
    </Modal.Modal>
  );
};


export default AssetsModalContainer;
