import React, {useEffect, useState} from 'react';
import {Button, Modal, Step, StepGroup, StepTitle, StepDescription, StepContent, Divider, Segment} from 'common/components';
import ShapeFileAssetList from '../components/Asset/ShapeFileAssetList';
import useAssets from '../../application/useAssets';
import {IAsset, IAssetData, IAssetShapefileData} from '../../types';
import {useParams} from 'react-router-dom';

import ImportItemTypeSelector from '../components/Import/ImportItemTypeSelector';
import ImportItemsUploadSelector from '../components/Import/ImportItemsUploadSelector';
import {FeatureCollection} from 'geojson';
import ImportItemPropertiesSelector from '../components/Import/ImportItemPropertiesSelector';
import {useSpatialDiscretization, useTimeDiscretization} from '../../application';
import useLayers from '../../application/useLayers';
import {IImportItem, IImportItemType} from '../components/Import/Import.type';

import {booleanWithin, booleanCrosses} from '@turf/turf';
import {getBoundarySettings} from '../components/ModelBoundaries/helpers';
import {useDateTimeFormat} from '../../../../common/hooks';


interface IProps {
  trigger: React.ReactElement;
}

interface IImportTypeOption {
  key: string;
  value: IImportItemType;
  text: string;
  disabled: boolean;
}

const getImportTypeOptions = (geometryType: string): IImportTypeOption[] => {

  const boundarySettings = getBoundarySettings();

  const options: IImportTypeOption[] = [];

  boundarySettings.forEach((bt) => {
    options.push({
      key: bt.type,
      value: bt.type,
      text: bt.title,
      disabled: !(geometryType === bt.geometryType || geometryType === 'Multi' + bt.geometryType),
    });
  });

  return options;
};


const ImportShapefileModal = ({trigger}: IProps) => {

  const {projectId} = useParams();
  const {shapeFiles, loading, uploadAsset, fetchAssetData} = useAssets(projectId as string);

  const {formatISODate, parseDate} = useDateTimeFormat();

  // Step 1
  const [selectedShapefile, setSelectedShapefile] = useState<IAsset | null>(null);
  const [selectedShapefileData, setSelectedShapefileData] = useState<IAssetShapefileData | null>(null);
  const [selectedGeometryType, setSelectedGeometryType] = useState<string | null>(null);

  // Step 2
  const [importItemType, setImportItemType] = useState<IImportItemType | null>(null);
  const [availableImportFeatures, setAvailableImportFeatures] = useState<FeatureCollection>({type: 'FeatureCollection', features: []});

  // Step 3
  const [importItems, setImportItems] = useState<IImportItem[]>([]);
  const [excludedItemIdx, setExcludedItemIdx] = useState<number[]>([]);

  const [activeStep, setActiveStep] = useState<number>(0);

  const {timeDiscretization} = useTimeDiscretization(projectId as string);
  const {layers} = useLayers(projectId as string);
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);

  const [open, setOpen] = useState<boolean>(false);

  const isAssetShapefileData = (data: IAssetData): data is IAssetShapefileData => (data && 'shapefile' === data.type);
  const isValidStep = (step: number): boolean => {
    if (0 === step) {
      return !!selectedShapefile;
    }

    if (1 === step) {
      return !!importItemType;
    }

    if (2 === step) {
      return !!importItems.length;
    }

    if (3 === step) {
      return true;
    }

    return false;

  };

  const handleSelectShapefile = async (shapefile: IAsset) => {
    if ('shapefile' !== shapefile.type) {
      return;
    }

    const data = await fetchAssetData(shapefile.asset_id);
    if (data && isAssetShapefileData(data)) {
      setSelectedShapefile(shapefile);
      setSelectedShapefileData(data);

      const feature = data.data?.features?.find((f) => f.geometry.type);
      if (!feature) {
        return;
      }

      setSelectedGeometryType(feature.geometry.type);
    }
  };

  useEffect(() => {
    if (shapeFiles.length && !selectedShapefile) {
      handleSelectShapefile(shapeFiles[0]);
    }
  }, [shapeFiles]);


  const handleShapeFileUpload = async (file: File) => {
    const assetId = await uploadAsset(file, 'Raster File');
    const asset = shapeFiles.find((a) => a.asset_id === assetId);
    if (asset) {
      await handleSelectShapefile(asset);
    }
  };

  const handleChangeImportItemType = (type: IImportItemType) => {
    setImportItemType(type);
    if (!spatialDiscretization || !selectedShapefileData) {
      return;
    }

    setAvailableImportFeatures({
      type: 'FeatureCollection',
      features: selectedShapefileData.data.features.filter(
        (f) => {
          if (f.geometry.type !== selectedGeometryType) {
            return false;
          }

          return booleanWithin(f, spatialDiscretization.geometry) || booleanCrosses(f, spatialDiscretization.geometry);
        }),
    });
  };

  const handleClickPrevious = () => {
    if (0 === activeStep) {
      return;
    }

    setActiveStep(activeStep - 1);
  };

  const handleClickNext = () => {
    if (!isValidStep(activeStep)) {
      return;
    }

    const nextStep = activeStep + 1;
    if (1 === nextStep) {
      const newImportItemType = getBoundarySettings().find((bt) => selectedGeometryType === bt.geometryType || selectedGeometryType === 'Multi' + bt.geometryType)?.type || 'well';
      setImportItemType(newImportItemType);

      if (!spatialDiscretization || !selectedShapefileData) {
        return;
      }

      setAvailableImportFeatures({
        type: 'FeatureCollection',
        features: selectedShapefileData.data.features.filter(
          (f) => {
            if (f.geometry.type !== selectedGeometryType) {
              return false;
            }

            if ('MultiPolygon' === f.geometry.type || 'Polygon' === f.geometry.type) {
              return booleanWithin(f, spatialDiscretization.geometry) || booleanCrosses(f, spatialDiscretization.geometry);
            }

            if ('LineString' === f.geometry.type || 'MultiLineString' === f.geometry.type) {
              return booleanWithin(f, spatialDiscretization.geometry) || booleanCrosses(f, spatialDiscretization.geometry);
            }


            if ('Point' === f.geometry.type) {
              return booleanWithin(f, spatialDiscretization.geometry);
            }

            if ('MultiPoint' === f.geometry.type) {
              return booleanWithin(f, spatialDiscretization.geometry);
            }
          }),
      });
    }

    if (3 === activeStep) {
      // Upload
      return;
    }

    setActiveStep(activeStep + 1);
  };

  const renderSteps = () => (
    <StepGroup ordered={true} widths={4}>
      <Step completed={!!selectedShapefile} active={0 == activeStep}>
        <StepContent>
          <StepTitle>Select Shapefile</StepTitle>
          <StepDescription>Choose or upload a shapefile</StepDescription>
        </StepContent>
      </Step>

      <Step completed={!!importItemType} active={1 == activeStep}>
        <StepContent>
          <StepTitle>BoundaryType</StepTitle>
          <StepDescription>Choose boundary type</StepDescription>
        </StepContent>
      </Step>

      <Step completed={!!importItems.length} active={2 == activeStep}>
        <StepContent>
          <StepTitle>Assign attributes</StepTitle>
          <StepDescription>Assign attributes to props</StepDescription>
        </StepContent>
      </Step>

      <Step completed={false} active={3 == activeStep}>
        <StepContent>
          <StepTitle>Upload</StepTitle>
          <StepDescription>Select and upload</StepDescription>
        </StepContent>
      </Step>
    </StepGroup>
  );

  const renderContent = () => {

    if (!spatialDiscretization || !timeDiscretization || !layers) {
      return null;
    }

    if (0 === activeStep) {
      return (
        <Segment.Segment raised={true}>
          <ShapeFileAssetList
            assets={shapeFiles}
            selectedAsset={selectedShapefile || null}
            assetData={selectedShapefileData || null}
            onChangeSelectedAsset={handleSelectShapefile}
            loading={loading}
            isReadOnly={false}
            onFileUpload={handleShapeFileUpload}
            modelDomain={spatialDiscretization.geometry}
          />
        </Segment.Segment>
      );
    }

    if (1 === activeStep) {
      return (
        <Segment.Segment raised={true}>
          {selectedShapefileData &&
            <ImportItemTypeSelector
              type={importItemType}
              typeOptions={getImportTypeOptions(selectedGeometryType || '')}
              onChange={handleChangeImportItemType}
              data={availableImportFeatures}
              modelDomain={spatialDiscretization.geometry}
            />
          }
        </Segment.Segment>
      );
    }

    if (2 === activeStep) {

      if (!importItemType || !availableImportFeatures) {
        return null;
      }

      return (
        <Segment.Segment raised={true}>
          {availableImportFeatures && <ImportItemPropertiesSelector
            features={availableImportFeatures.features}
            type={importItemType}
            layerNames={layers.map((l) => l.name)}
            spatialDiscretization={spatialDiscretization}
            timeDiscretization={timeDiscretization}
            onChangeImportItems={setImportItems}
            formatISODate={formatISODate}
            parseDate={parseDate}
          />}
        </Segment.Segment>
      );
    }

    if (3 === activeStep) {
      return (
        <Segment.Segment raised={true}>
          <ImportItemsUploadSelector
            items={importItems}
            excludedIdx={excludedItemIdx}
            onChangeExcludedIdx={setExcludedItemIdx}
          />
        </Segment.Segment>
      );
    }

    return null;
  };

  return (
    <>
      {React.cloneElement(trigger, {onClick: () => setOpen(true)})}
      {open && (
        <Modal.Modal
          open={true}
          onClose={() => setOpen(false)}
          dimmer={'blurring'}
          size={'large'}
          closeOnDimmerClick={false}
          closeOnEscape={false}
          closeOnDocumentClick={false}
          centered={false}
          closeIcon={true}
        >
          <Modal.Header>Import Boundaries and Observations</Modal.Header>
          <Modal.Content>
            {renderSteps()}
            <Divider/>
            {renderContent()}
          </Modal.Content>
          <Modal.Actions>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              content={'Previous'}
              disabled={0 === activeStep}
              onClick={handleClickPrevious}
            />
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              content={'Next'}
              disabled={!isValidStep(activeStep)}
              onClick={handleClickNext}
            />
          </Modal.Actions>
        </Modal.Modal>
      )}
    </>
  );
};

export default ImportShapefileModal;
