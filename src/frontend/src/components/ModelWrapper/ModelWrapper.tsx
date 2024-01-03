import React, {useState} from 'react';

import DatePicker from 'react-datepicker';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';

import styles from './ModelWrapper.module.less';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-tabs/style/react-tabs.css';

import {Dropdown, Form, FormFieldProps, Icon, List, Radio, TextArea} from 'semantic-ui-react';
import {DataGrid, DataRow, DataSidebar, ModelSidebar, UploadFile} from 'components/ModelWrapper';
import {Button, Map} from 'components';
import type {FeatureCollection} from 'geojson';


interface IProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  showModelSidebar?: boolean;
  headerHeight?: number;
}

const GEOJSON: FeatureCollection = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [
              13.737521,
              51.05702,
            ],
            [
              13.723092,
              51.048919,
            ],
            [
              13.736491,
              51.037358,
            ],
            [
              13.751779,
              51.04773,
            ],
            [
              13.737521,
              51.05702,
            ],
          ],
        ],
      },
    },
  ],
};

const listParametrs = [
  {title: 'Layer confinement, calculation, reweting', active: false},
  {title: 'Top elevation(m a.s.l.)', active: true},
  {title: 'Bottom elevation(m a.s.l.)', active: false},
  {title: 'Hydraulic conductivity along rows(m/d)', active: false},
  {title: 'Horizontal hydraulic anisotropy(-)', active: false},
  {title: 'Vertical hydraulic conductivity(m/d)', active: false},
  {title: 'Specific storage(-)', active: false},
  {title: 'Specific yield(1/m)', active: false},
  {title: 'Starting head, strt(m a.s.l.)', active: false},
  {title: 'iBound(-)', active: false},
];

const options = [
  {key: '1', text: 'React', value: 'React'},
  {key: '2', text: 'Python', value: 'Python'},
  {key: '3', text: 'Ezousa', value: 'Ezousa'},
  {key: '4', text: 'Simulation', value: 'Simulation'},
  {key: '5', text: 'Data', value: 'Data'},
];

const lengthUnitOptions = [
  {key: '1', text: 'Meter', value: 'Meter'},
  {key: '2', text: 'Foot', value: 'Foot'},
  {key: '3', text: 'Kilometer', value: 'Kilometer'},
  {key: '4', text: 'Mile', value: 'Mile'},
  {key: '5', text: 'Yard', value: 'Yard'},
  {key: '6', text: 'Inch', value: 'Inch'},
];

const timeUnitOptions = [
  {key: '1', text: 'Year', value: 'Year'},
  {key: '2', text: 'Month', value: 'Month'},
  {key: '3', text: 'Day', value: 'Day'},
  {key: '4', text: 'Hour', value: 'Hour'},
  {key: '5', text: 'Minute', value: 'Minute'},
  {key: '6', text: 'Second', value: 'Second'},
];

const ModelWrapper: React.FC<IProps> = ({children, headerHeight, showModelSidebar = true, ...props}) => {
  const [listItems, setListItems] = useState(listParametrs);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleRadioChange = (e: React.FormEvent<HTMLInputElement>, {value}: FormFieldProps) => {
    setSelectedOption(value as string);
    console.log(`Selected option: ${value}`);
  };
  const hendleDateChange = (name: string, date: Date) => {
    return 'startDate' === name ? setStartDate(date) : setEndDate(date);
  };
  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  const dataExample = () => {
    return <>
      <DataGrid>
        <DataRow title={'Model layers'}>
          <h2>Hello world box 1</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, nulla?</p>
        </DataRow>

        <DataRow
          title={'Grid properties'}
          btnTitle={'Upload JSON'}
          onClick={() => {
            console.log('handleUpdateJson');
          }}
        />

        <DataRow
          subTitle={'Grid resolution'}
          btnTitle={'Refine grid'}
          onClick={() => {
            console.log('handleUpdateJson');
          }}
        >
          <h2>Hello world box 1</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, nulla?</p>
        </DataRow>

        <DataRow
          subTitle={'Grid rotation'}
        >
          <h2>Hello world box 1</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, nulla?</p>
        </DataRow>

      </DataGrid>
      <DataGrid>
        <DataRow subTitle={'Shallow aquifer layer'}/>
      </DataGrid>
      <DataGrid multiRows={true}>
        <div className={styles.column}>
          <h3 className={`${styles.headline} h4`}>Layer parameters</h3>
          <List className={styles.list}>
            {listItems.map((item, index) => (
              <List.Item
                key={index}
                as="a"
                className={`${styles.item} ${item.active ? styles.active : ''}`}
                onClick={() => handleItemClick(index)}
              >
                {item.title}
              </List.Item>
            ))}
          </List>
        </div>
        <div className={styles.column}>
          <h4 className={`${styles.headline} h6`}>Layer confinement</h4>
          <div className={styles.radioGroup}>
            <Radio
              className={styles.radio}
              label="Confined"
              value="confined"
              checked={true}
            />
            <Radio
              className={styles.radio}
              label="Convertible"
              value="convertible"
            />
            <Radio
              className={styles.radio}
              label="Convertible (unless THICKSTRT)"
              value="thickStart"
            />

          </div>
          <h4 className={`${styles.headline} h6`}>Layer average calculation</h4>
          <div className={styles.radioGroup}>
            <Radio
              className={styles.radio}
              label="harmonic mean"
              value="harmonicMean"
              checked={true}
            />
            <Radio
              className={styles.radio}
              label="logarythmic mean"
              value="logarythmicMean"
            />
            <Radio
              className={styles.radio}
              label="arithmetic mean (saturated thickness) and logarithmic mean (hydraulic conductivity)"
              value="arithmetic"
            />

          </div>
          <h4 className={`${styles.headline} h6`}>Layer rewetting capability</h4>
          <div className={`${styles.radioGroup} ${styles.radioGroupRow}`}>
            <Radio
              className={styles.radio}
              label="yes"
              value="yes"
              checked={true}
            />
            <Radio
              className={styles.radio}
              label="no"
              value="no"
            />
          </div>
        </div>
      </DataGrid>
    </>;
  };

  const dataCreate = () => {

    return <>
      <DataGrid multiRows={true}>
        <DataRow title={'Create model'}>
          <Form.Field className={styles.field}>
            <label className={'h4'}>Model name<span className="required">*</span></label>
            <input type="text"/>
          </Form.Field>
          <Form.Field className={styles.field}>
            <label className={'h4'}>Model description<span className="required">*</span></label>
            <TextArea type="textarea"/>
          </Form.Field>
          <Form.Field className={styles.field}>
            <label className={'h4'}>Model Keywords</label>
            <Dropdown
              name="selectedKeywords"
              placeholder="Select keywords"
              fluid={true}
              multiple={true}
              selection={true}
              options={options}
            />
          </Form.Field>
          <Form.Field className={styles.field}>
            <h3 className={'h4'}>Model dates<span className="required">*</span></h3>
            <div className={'dateInputWrapper gridTwoColumns '}>
              <div className={'rowTwoColumns'}>
                <label>Start date</label>
                <div className={'divider'}>
                  <DatePicker
                    name="startDate"
                    className={'dateInput'}
                    selected={startDate}
                    dateFormat="dd.MM.yyyy"
                    onChange={(date: Date) => hendleDateChange('startDate', date)}
                  />
                  <Icon className={'dateIcon'} name="calendar outline"/>
                </div>
              </div>
              <div className={'rowTwoColumns'}>
                <label>Date to</label>
                <div className={'divider'}>
                  <DatePicker
                    name="endDate"
                    className={'dateInput'}
                    selected={endDate}
                    dateFormat="dd.MM.yyyy"
                    onChange={(date: Date) => hendleDateChange('endDate', date)}
                  />
                  <Icon className={'dateIcon'} name="calendar outline"/>
                </div>
              </div>
            </div>
          </Form.Field>
          <Form.Field className={styles.field}>
            <h3 className={'h4'}>Model units<span className="required">*</span></h3>
            <div className="gridTwoColumns">
              <div className={'rowTwoColumns'}>
                <label>Length unit</label>
                <Dropdown
                  placeholder="meters"
                  selection={true}
                  options={lengthUnitOptions}
                />
              </div>
              <div className={'rowTwoColumns'}>
                <label>Time unit</label>
                <Dropdown
                  placeholder="days"
                  selection={true}
                  options={timeUnitOptions}
                />
              </div>
            </div>
          </Form.Field>
          <Button primary={true}>Create model</Button>
        </DataRow>
        <DataRow title={'Model geometry'}>
          <div className={styles.tabsWrapper}>
            <h2 className="h4">Add model domain</h2>
            <Tabs>
              <TabList>
                <Tab>Drow on map</Tab>
                <Tab>Upload file</Tab>
              </TabList>
              <TabPanel>
                <Button primary={true} size={'small'}>Drow on map</Button>
              </TabPanel>
              <TabPanel>
                <UploadFile/>
              </TabPanel>
            </Tabs>
          </div>
        </DataRow>
      </DataGrid>
    </>;
  };

  return (
    <div
      className={styles.modelWrapper}
      style={{height: `calc(100vh - ${headerHeight}px)`}}
    >
      {showModelSidebar && <ModelSidebar/>}
      <div className={styles.modelContent}>
        <DataSidebar>
          {dataCreate()}
          {dataExample()}
        </DataSidebar>
        <div className={styles.modelMap}>
          <Map
            editable={true}
            geojson={GEOJSON}
            setGeojson={(geojson) => {
              console.log(geojson);
            }}
            coords={[51.051772741784625, 13.72531677893111]}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelWrapper;
