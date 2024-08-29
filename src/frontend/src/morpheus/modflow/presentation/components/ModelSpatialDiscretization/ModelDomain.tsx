import React, {useState} from 'react';
import {ShapeFileInput, DataGrid, Button} from 'common/components';
import {Polygon} from 'geojson';
import {IAssetShapefileData} from '../../../types';

interface IProps {
  isDirty: boolean;
  isLoading: boolean;
  isLocked: boolean;
  onChangeGeometry: (polygon: Polygon) => void;
  onReset: () => void;
  onSubmit: () => void;
  processShapefile: (files: File[]) => Promise<IAssetShapefileData>;
  readOnly: boolean;
}

const ModelDomain = ({onChangeGeometry, onSubmit, onReset, isDirty, isLocked, isLoading, processShapefile, readOnly}: IProps) => {

  const [shapeFileError, setShapeFileError] = useState<string | undefined>(undefined);

  const handleSubmitShapeFiles = async (files: File[]) => {
    setShapeFileError(undefined);
    try {
      const data = await processShapefile(files);
      const geoJson = data.data;

      if ('FeatureCollection' === geoJson.type) {
        const feature = geoJson.features.find((f) => 'Polygon' === f.geometry.type);
        if (feature) {
          return onChangeGeometry(feature.geometry as Polygon);
        }
      }
      setShapeFileError('No polygon found in shapefile.');
    } catch (e) {
      setShapeFileError('Error processing shapefile. Please try again.');
    }
  };

  const renderButtons = () => {
    if (isLocked || readOnly) {
      return null;
    }

    return (
      <DataGrid style={{display: 'flex', gap: '10px'}}>
        <Button
          secondary={true}
          labelPosition={'left'}
          style={{marginLeft: 'auto'}}
          size={'tiny'}
          icon={'remove'}
          content={'Cancel'}
          disabled={!isDirty}
          onClick={onReset}
        >
        </Button>
        <Button
          primary={true}
          labelPosition={'left'}
          size={'tiny'}
          icon={'save'}
          content={'Save'}
          disabled={!isDirty}
          onClick={onSubmit}
          loading={isLoading}
        >
        </Button>
      </DataGrid>
    );
  };

  return (
    <>
      <ShapeFileInput
        onSubmit={handleSubmitShapeFiles}
        error={shapeFileError}
        readOnly={readOnly}
      />
      {renderButtons()}
    </>
  );
};

export default ModelDomain;
