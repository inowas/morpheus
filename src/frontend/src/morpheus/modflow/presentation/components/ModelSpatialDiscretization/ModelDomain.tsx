import React, {useState} from 'react';
import {ShapeFileInput, DataGrid, Button} from 'common/components';
import {GeoJSON, Polygon} from 'geojson';

interface IProps {
  isDirty: boolean;
  isLoading: boolean;
  isLocked: boolean;
  onChangeGeometry: (polygon: Polygon) => void;
  onReset: () => void;
  onSubmit: () => void;
  processShapefile: (zipFile: File) => Promise<GeoJSON>;
  readOnly: boolean;
}

const ModelDomain = ({onChangeGeometry, onSubmit, onReset, isDirty, isLocked, isLoading, processShapefile, readOnly}: IProps) => {

  const [shapeFileError, setShapeFileError] = useState<string | undefined>(undefined);

  const handleSubmitShapeFile = async (zipFile: File) => {
    setShapeFileError(undefined);
    try {
      const geoJson = await processShapefile(zipFile);
      if ('Polygon' === geoJson.type) {
        return onChangeGeometry(geoJson as Polygon);
      }

      if ('Feature' === geoJson.type && 'Polygon' === geoJson.geometry.type) {
        return onChangeGeometry(geoJson.geometry as Polygon);
      }

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
          style={{marginLeft: 'auto'}}
          size={'tiny'}
          disabled={!isDirty}
          onClick={onReset}
        >
          {'Reset'}
        </Button>
        <Button
          primary={true}
          size={'tiny'}
          disabled={!isDirty}
          onClick={onSubmit}
          loading={isLoading}
        >
          {'Apply'}
        </Button>
      </DataGrid>
    );
  };

  return (
    <>
      <ShapeFileInput
        onSubmit={handleSubmitShapeFile}
        error={shapeFileError}
        readOnly={readOnly}
      />
      {renderButtons()}
    </>
  );
};

export default ModelDomain;
