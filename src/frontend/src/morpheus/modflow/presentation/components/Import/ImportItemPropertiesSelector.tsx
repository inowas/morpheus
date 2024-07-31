import React, {useEffect, useState} from 'react';
import uniq from 'lodash.uniq';

import {ISpatialDiscretization, ITimeDiscretization} from '../../../types';
import {Button, Form, Grid, Icon, Label, Pagination, Popup, PopupContent, Segment, Table} from 'semantic-ui-react';
import {Feature, LineString, Point, Polygon} from 'geojson';
import {IImportItem, IImportItemType, IImportItemValue} from '../../../types/Import.type';
import {createDefaultImportItemValueByType, hasMultipleAffectedLayers} from './helpers';
import PreviewMapLayer from './PreviewMapLayer';
import ImportDataTable, {IExtendedImportItemValue} from './ImportDataTable';
import {Map} from 'common/components/Map';
import {TimeSeriesDataChart} from 'common/components';


interface IProps {
  type: IImportItemType;
  features: Feature[];
  layerNames: string[];
  spatialDiscretization: ISpatialDiscretization;
  timeDiscretization: ITimeDiscretization;
  onChangeImportItems: (importItem: IImportItem[]) => void;
  formatISODate: (date: string) => string;
  parseDate: (date: string) => string;
}

const createDefaultImportItems = (type: IImportItemType, features: Feature[], timeDiscretization: ITimeDiscretization) => {
  const items: IImportItem[] = [];
  features.forEach((feature, idx) => {
    const item: IImportItem = {
      name: `Item ${idx + 1}`,
      type: type,
      geometry: feature.geometry as Point | LineString | Polygon,
      affected_layers: [0],
      tags: [],
      interpolation: 'forward_fill',
      data: timeDiscretization.stress_periods.map((sp) => createDefaultImportItemValueByType(type, sp.start_date_time)),
    };

    items.push(item);
  });

  return items;
};

const ImportItemPropertiesSelector = ({features, layerNames, onChangeImportItems, type, spatialDiscretization, timeDiscretization, formatISODate, parseDate}: IProps) => {

  const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);

  const [selectedAttributeForName, setSelectedAttributeForName] = useState<string | null>(null);
  const [selectedAttributesForLayer, setSelectedAttributesForLayer] = useState<string[] | null>(null);
  const [selectedDefaultLayers, setSelectedDefaultLayers] = useState<number[]>([0]);

  const [stressPeriodValues, setStressPeriodValues] = useState<IExtendedImportItemValue[]>(
    timeDiscretization.stress_periods.map((sp, idx) => {
      if (0 === idx) {
        return {...createDefaultImportItemValueByType(type, sp.start_date_time), enabled: true};
      }
      return {...createDefaultImportItemValueByType(type, sp.start_date_time), enabled: false};
    }),
  );

  const [importItems, setImportItems] = useState<IImportItem[]>([]);
  const [selectedImportItemInPreview, setSelectedImportItemInPreview] = useState<number>(0);

  useEffect(() => {
    if (0 === features.length) {
      setAvailableAttributes([]);
      return;
    }

    const keys = Object.keys(features[0].properties || {});

    if (0 === keys.length) {
      setAvailableAttributes([]);
    }

    setAvailableAttributes(keys);
    setImportItems(createDefaultImportItems(type, features, timeDiscretization));
  }, [features, timeDiscretization, type]);

  useEffect(() => {
    if (0 === importItems.length) {
      return;
    }

    setImportItems((prev) => prev.map((item, idx) => {
      const properties = features[idx].properties || {};
      const newName = String(properties[selectedAttributeForName || ''] || `Item ${idx + 1}`);
      return {
        ...item,
        name: newName,
      };
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributeForName, features]);

  useEffect(() => {
    setImportItems((prev) => prev.map((item, idx) => {
      const properties = features[idx].properties || {};
      let affectedLayers = [...selectedDefaultLayers];
      if (selectedAttributesForLayer) {
        affectedLayers = selectedAttributesForLayer.map((p) => {
          const layerIdx = parseInt(properties[p], 10) - 1;
          if (0 > layerIdx) {
            return 0;
          }
          if (layerIdx >= layerNames.length) {
            return layerNames.length - 1;
          }
          return layerIdx;
        });
      }

      affectedLayers = uniq(affectedLayers).toSorted();

      return {
        ...item,
        affected_layers: affectedLayers,
      };
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributesForLayer, selectedDefaultLayers, features]);

  useEffect(() => {
    if (selectedAttributeForName) {
      return;
    }

    setSelectedAttributeForName(availableAttributes[0]);

  }, [availableAttributes]);

  useEffect(() => {
    onChangeImportItems(importItems);
  }, [importItems]);

  const handleChangedStressPeriodValues = (extendedImportItemValues: IExtendedImportItemValue[]) => {
    setStressPeriodValues(extendedImportItemValues);
    setImportItems((prev) => prev.map((item, idx) => {
      const properties = features[idx].properties || {};

      const newData: IImportItemValue[] = [];

      extendedImportItemValues.forEach((extendedImportItemValue) => {
        const {enabled, ...rest} = extendedImportItemValue;
        if (!enabled) {
          return;
        }

        const keys = Object.keys(rest);
        if (0 === keys.length) {
          return;
        }

        keys.forEach((key) => {
          if (availableAttributes.includes(rest[key])) {
            rest[key] = Number(properties[rest[key]]);
          }
        });

        newData.push(rest);
      });


      return {
        ...item,
        data: newData,
      };
    }));
  };

  const selectedImportItem = importItems[selectedImportItemInPreview] || null;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Property</Table.HeaderCell>
                <Table.HeaderCell>Attribute</Table.HeaderCell>
                <Table.HeaderCell>Default value</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <span style={{fontWeight: 'bold'}}>Name</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Select
                    floating={true}
                    options={availableAttributes.map((p) => ({key: p, text: p, value: p}))}
                    onChange={(e, {value}) => setSelectedAttributeForName(value as string)}
                    clearable={true}
                    value={selectedAttributeForName || ''}
                  />
                </Table.Cell>
                <Table.Cell>{'Item {idx}'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <span style={{fontWeight: 'bold'}}>Layers</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Select
                    floating={true}
                    options={availableAttributes.map((p) => ({key: p, text: p, value: p}))}
                    onChange={(e, data) => {
                      const value = data.value as string | string[];
                      if (!value) {
                        setSelectedAttributesForLayer(null);
                        return;
                      }
                      if (Array.isArray(value)) {
                        setSelectedAttributesForLayer(value);
                        return;
                      }

                      setSelectedAttributesForLayer([value]);
                    }}
                    clearable={true}
                    multiple={hasMultipleAffectedLayers(type)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Form.Select
                    floating={true}
                    value={hasMultipleAffectedLayers(type) ? selectedDefaultLayers : selectedDefaultLayers[0]}
                    options={layerNames.map((l, idx) => ({key: idx, text: l, value: idx}))}
                    onChange={(e, data) => {
                      const value = data.value as null | number | number[];
                      if (!value) {
                        setSelectedDefaultLayers([0]);
                        return;
                      }
                      if (Array.isArray(value)) {
                        setSelectedDefaultLayers(value);
                        return;
                      }
                      setSelectedDefaultLayers([value]);
                    }}
                    multiple={hasMultipleAffectedLayers(type)}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={8}>

          <Segment tertiary={true}>
            <Label
              as={'h3'}
              color={'blue'}
              attached={'top right'}
            >
              Preview
            </Label>
            {selectedImportItem && (
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Table style={{backgroundColor: 'transparent'}}>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>
                            <span style={{fontWeight: 'bold'}}>Name</span>
                          </Table.Cell>
                          <Table.Cell>
                            {selectedImportItem.name}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <span style={{fontWeight: 'bold'}}>Type</span>
                          </Table.Cell>
                          <Table.Cell>
                            {selectedImportItem.type}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <span style={{fontWeight: 'bold'}}>Tags</span>
                          </Table.Cell>
                          <Table.Cell>
                            {selectedImportItem.tags.join(', ')}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <span style={{fontWeight: 'bold'}}>Layers</span>
                          </Table.Cell>
                          <Table.Cell>
                            {selectedImportItem.affected_layers.map((l) => layerNames[l]).join(', ')}
                          </Table.Cell>
                        </Table.Row>
                        {Object.keys(selectedImportItem.data[0]).filter((key) => 'date_time' !== key).map((key) => (
                          <Table.Row key={key}>
                            <Table.Cell>
                              <span style={{fontWeight: 'bold'}}>{key}</span>
                            </Table.Cell>
                            <Table.Cell>
                              <Popup
                                trigger={<Button icon={'chart line'} size={'mini'}/>} pinned={true}
                                on={'hover'}
                                popper={<div style={{filter: 'none'}}></div>}
                                content={
                                  <PopupContent style={{width: 400, filter: 'none'}}>
                                    <TimeSeriesDataChart
                                      data={selectedImportItem.data.map((d) => ({date_time: d.date_time, [key]: d[key] as number}))}
                                      dateTimes={[...timeDiscretization.stress_periods.map((sp) => sp.start_date_time), timeDiscretization.end_date_time]}
                                      formatDateTime={formatISODate}
                                      type={selectedImportItem.interpolation as 'linear' | 'forward_fill'}
                                    />
                                  </PopupContent>
                                }
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))
                        }
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Map
                      zoomControl={false} dragging={false}
                      boxZoom={false} doubleClickZoom={false}
                      scrollWheelZoom={false} touchZoom={false}
                      style={{border: '1px solid black'}}
                    >
                      <PreviewMapLayer item={selectedImportItem.geometry} modelDomain={spatialDiscretization.geometry}/>
                    </Map>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
            <div style={{display: 'flex', justifyContent: 'center', margin: 10}}>
              <Pagination
                size={'mini'}
                secondary={true}
                boundaryRange={1}
                siblingRange={1}
                firstItem={null}
                lastItem={null}
                defaultActivePage={1}
                ellipsisItem={{content: <Icon name='ellipsis horizontal'/>, icon: true}}
                prevItem={{content: <Icon name='angle left'/>, icon: true}}
                nextItem={{content: <Icon name='angle right'/>, icon: true}}
                totalPages={importItems.length}
                onPageChange={(e, {activePage}) => setSelectedImportItemInPreview(activePage as number - 1)}
                style={{margin: 'auto', textAlign: 'center', alignItems: 'center'}}
              />
            </div>
          </Segment>
        </Grid.Column>
        <Grid.Column width={16}>
          <p>Stress period values</p>
          <ImportDataTable
            type={type}
            values={stressPeriodValues}
            onChangeValues={handleChangedStressPeriodValues}
            formatISODate={formatISODate}
            parseDate={parseDate}
            attributes={availableAttributes}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ImportItemPropertiesSelector;
