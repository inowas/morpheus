import React, {useEffect, useState} from 'react';
import {ILayerPropertyValues} from '../../../types/Layers.type';
import {Button, InfoTitle} from 'common/components';
import {Marker, Popup} from 'react-leaflet';

interface IProps {
  values: ILayerPropertyValues | null;
  onSubmit: (layerPropertyValues: ILayerPropertyValues) => void;
  unit?: string;
  readOnly: boolean;
}

const LayerPropertyValues = ({values, onSubmit, readOnly, unit}: IProps) => {

  const [layerPropertyValuesLocal, setLayerPropertyValuesLocal] = useState<ILayerPropertyValues | null>(values);

  useEffect(() => {
    setLayerPropertyValuesLocal(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);


  return (
    <>
      <div>
        <InfoTitle
          title='Zones'
          description='You can upload or draw Polygones on map to provide one value for a specific area.'
        />
        <div>No zones specified</div>
        <Button size={'tiny'}>Choose file</Button>
      </div>
      <div style={{marginTop: 20}}>
        <InfoTitle
          title='Raster'
          description='You can upload a raster file to provide values for the specified property for each cell of the model.'
        />
        <Button size={'tiny'}>Choose file</Button>
      </div>
      <div style={{marginTop: 20}}>
        <InfoTitle
          title='Layer default value'
          description='A confined layer is a layer that is confined by impermeable layers above and below. A convertible layer is a layer that can be converted to a confined layer by setting the vertical conductance to zero.'
        />
        <input
          type="number"
          value={layerPropertyValuesLocal?.value || 0}
          onChange={(e) => {
            if (layerPropertyValuesLocal) {
              setLayerPropertyValuesLocal({...layerPropertyValuesLocal, value: Number(e.target.value)});
            }
          }}
          disabled={readOnly}
        />{unit}
      </div>

      <Marker position={[51.101887, 13.743875]}>
        <Popup>
          A pretty CSS3 popup.
        </Popup>
      </Marker>

      {layerPropertyValuesLocal?.value !== values?.value && !readOnly && (
        <button onClick={() => {
          if (layerPropertyValuesLocal) {
            onSubmit(layerPropertyValuesLocal);
          }
        }}
        >Save</button>
      )}
    </>
  );
};

export default LayerPropertyValues;
