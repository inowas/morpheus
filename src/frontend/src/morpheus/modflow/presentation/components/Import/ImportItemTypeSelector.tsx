import React from 'react';
import {Form, Grid, Segment} from 'semantic-ui-react';
import {Map} from 'common/components/Map';
import {IImportItemType} from './Import.type';
import {FeatureCollection, Polygon} from 'geojson';
import ImportShapefileDataLayer from './ImportShapefileDataLayer';

interface IProps {
  type: IImportItemType | null;
  typeOptions: {
    key: string;
    text: string;
    value: IImportItemType;
    disabled: boolean;
  }[];
  onChange: (type: IImportItemType) => void;
  data: FeatureCollection;
  modelDomain: Polygon;
}


const ImportItemTypeSelector = ({data, type, typeOptions, onChange, modelDomain}: IProps) => (
  <Grid>
    <Grid.Row>
      <Grid.Column width={6}>
        <Segment>
          <Form>
            <Form.Group grouped={true}>
              <Form.Field>
                <label>Import as</label>
                {typeOptions.map((t) =>
                  <label
                    key={t.key}
                    style={{display: 'block'}}
                  >
                    <input
                      type={'radio'}
                      key={t.key}
                      value={t.value}
                      checked={type === t.value}
                      onChange={() => onChange(t.value)}
                      disabled={t.disabled}
                      style={{margin: 5}}
                    />
                    <span style={{color: t.disabled ? 'grey' : 'black'}}>
                      {t.text}
                    </span>
                  </label>,
                )}
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>
      </Grid.Column>
      <Grid.Column width={10}>
        <Segment style={{height: '100%', border: 'none', boxShadow: 'none', padding: 0}}>
          <Map>
            <ImportShapefileDataLayer data={data} modelDomain={modelDomain}/>
          </Map>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default ImportItemTypeSelector;
