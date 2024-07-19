import React, {useMemo, useState} from 'react';
import {ITimeDiscretization} from '../../../types';
import {Form, Grid, Segment} from 'semantic-ui-react';
import {FeatureCollection, LineString, Point, Polygon} from 'geojson';
import {IImportItem, IImportItemType} from '../../../types/Import.type';

interface IProps {
  type: IImportItemType;
  onAssignProperties: (importItem: IImportItem[]) => void;
  timeDiscretization: ITimeDiscretization;
  layerNames: string[];
  data: FeatureCollection;
}


const ImportItemPropertiesSelector = ({data, layerNames, onAssignProperties, type, timeDiscretization}: IProps) => {

  const [selectedPropertyForName, setSelectedPropertyForName] = useState<string | null>(null);
  const [defaultValueForName, setDefaultValueForName] = useState<string>('No name');

  const [selectedPropertyForValue, setSelectedPropertyForValue] = useState<string | null>(null);
  const [defaultValueForValue, setDefaultValueForValue] = useState<number>(0);

  const [selectedPropertyForLayer, setSelectedPropertyForLayer] = useState<string | null>(null);
  const [selectedLayerOption, setSelectedLayerOption] = useState<'zero_based' | 'one_based' | 'selected_layer'>('one_based');
  const [selectedLayerName, setSelectedLayerName] = useState<string>(layerNames[0]);

  const availableProperties = useMemo(() => {
    if (!data || 0 === data.features.length) {
      return [];
    }

    const feature = data.features[0];
    return Object.keys(feature.properties || {});
  }, [data]);


  const handleClickAssignProperties = () => {
    const boundaries: IImportItem[] = [];

    data.features.forEach((f) => {
      const properties = f.properties || {};
      const name = properties[selectedPropertyForName || ''] || defaultValueForName;
      console.log('name', name, properties, selectedPropertyForName);
      const value = parseFloat(properties[selectedPropertyForValue || '']) || defaultValueForValue;
      boundaries.push({
        type: type,
        name: name,
        geometry: f.geometry as Point | LineString | Polygon,
        affected_layers: [0],
        data: [{
          date_time: timeDiscretization.start_date_time,
          pumping_rate: value,
        }],
      });
    });

    onAssignProperties(boundaries);
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Segment>
            <h3>Data Info</h3>
            <p>Boundary Type: {type}</p>
            <p>Number of features: {data.features.length}</p>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Form>
              <Form.Group>
                <Form.Select
                  label={'Select property for name'}
                  options={availableProperties.map((p) => ({key: p, text: p, value: p}))}
                  value={selectedPropertyForName || ''}
                  onChange={(e, {value}) => setSelectedPropertyForName(value as string)}
                />
                <Form.Input
                  label={'Default name'}
                  value={defaultValueForName}
                  onChange={(e, {value}) => setDefaultValueForName(value as string)}
                ></Form.Input>
              </Form.Group>
              <Form.Group>
                <Form.Select
                  label={'Select property for layer'}
                  options={availableProperties.map((p) => ({key: p, text: p, value: p}))}
                  value={selectedPropertyForLayer || ''}
                  onChange={(e, {value}) => setSelectedPropertyForLayer(value as string)}
                />
                <Form.Select
                  label={'Layer option'}
                  options={[
                    {key: 'zero_based', text: 'Zero based', value: 'zero_based'},
                    {key: 'one_based', text: 'One based', value: 'one_based'},
                    {key: 'selected_layer', text: 'Selected Layer', value: 'selected_layer'},
                  ]}
                  value={selectedLayerOption}
                  onChange={(e, {value}) => setSelectedLayerOption(value as 'zero_based' | 'one_based')}
                />
                {'selected_layer' === selectedLayerOption && (
                  <Form.Select
                    label={'Select layer name'}
                    options={layerNames.map((ln) => ({key: ln, text: ln, value: ln}))}
                    value={selectedLayerName}
                    onChange={(e, {value}) => setSelectedLayerName(value as string)}
                  />
                )}
              </Form.Group>
              <Form.Group>
                <Form.Input
                  disabled={true}
                  label={'Date time'}
                  value={timeDiscretization.start_date_time}
                />
                <Form.Select
                  label={'Select property for value'}
                  options={availableProperties.map((p) => ({key: p, text: p, value: p}))}
                  value={selectedPropertyForValue || ''}
                  onChange={(e, {value}) => setSelectedPropertyForValue(value as string)}
                />
                <Form.Input
                  label={'Default value'}
                  type={'number'}
                  value={defaultValueForValue}
                  onChange={(e, {value}) => setDefaultValueForValue(parseFloat(value))}
                ></Form.Input>
              </Form.Group>
              <Form.Button
                onClick={handleClickAssignProperties}
                content={'Assign properties'}
              />
            </Form>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>

  );
};

export default ImportItemPropertiesSelector;
