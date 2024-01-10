import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import styles from './ModelWrapper.module.less';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import {Dropdown, Form, Icon, List, Radio, Tab, TabPane, TextArea} from 'semantic-ui-react';
import {DataGrid, DataRow, DataSidebar, ModelSidebar} from 'components/ModelWrapper';
import {Button, Map} from 'components';
import type {FeatureCollection} from 'geojson';
import UploadFile from './UploadFile';
import Slider from 'rc-slider';

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

const ModelWrapper: React.FC<IProps> = ({children, headerHeight, showModelSidebar = false, ...props}) => {
  const [listItems, setListItems] = useState(listParametrs);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  //TODO: MODEL SIDEBAR LIST
  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  const hendleDateChange = (name: string, date: Date) => {
    return 'startDate' === name ? setStartDate(date) : setEndDate(date);
  };


  //TODO: Checkbox for grid type
  const [gridType, setGridType] = useState<'gridSize' | 'cellSize'>('gridSize');
  const handleGridTypeChange = (value: 'gridSize' | 'cellSize') => {
    setGridType(value);
  };

  //TODO: Slider for grid rotation
  const [gridRotation, setGridRotation] = useState({
    rotationAngle: 12000,
    intersection: 0,
  });

  const handleRotationChange = (newValue: number | number[]) => {
    const newRotationAngle = Array.isArray(newValue) ? newValue[0] : newValue;
    setGridRotation({...gridRotation, rotationAngle: newRotationAngle});
  };

  const handleIntersectionChange = (newValue: number | number[]) => {
    const newIntersection = Array.isArray(newValue) ? newValue[0] : newValue;
    setGridRotation({...gridRotation, intersection: newIntersection});
  };

  const createModel = () => {
    const panes = [
      {menuItem: 'Drow on map', render: () => <TabPane><Button primary={true} size={'small'}>Drow on map</Button></TabPane>},
      {menuItem: 'Upload file', render: () => <TabPane><UploadFile/></TabPane>},
    ];
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
            <div className={'dateInputWrapper fieldGrid '}>
              <div className="fieldRow">
                <label className="labelSmall">Start date</label>
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
              <div className="fieldRow">
                <label className="labelSmall">Date to</label>
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
            <div className="fieldGrid">
              <div className="fieldRow">
                <label className="labelSmall">Length unit</label>
                <Dropdown
                  placeholder="meters"
                  selection={true}
                  options={lengthUnitOptions}
                />
              </div>
              <div className="fieldRow">
                <label className="labelSmall">Time unit</label>
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
            <Tab panes={panes} className={'tabs'}/>
          </div>
        </DataRow>
      </DataGrid>
      <div style={{marginTop: 'auto', paddingTop: '20px'}}><span className="required">*</span>Mandatory fields</div>
    </>;
  };

  const gridProperties = () => {

    return <>
      <DataGrid>
        <DataRow title={'Model Grid'}/>
        <DataRow subTitle={'Grid resolution'}>
          <DataGrid multiRows={true}>
            <div>
              <Radio
                style={{marginBottom: '14px', fontSize: '16px', fontWeight: '600'}}
                label="Set by grid size"
                value="gridSize"
                checked={'gridSize' === gridType}
                onChange={() => handleGridTypeChange('gridSize')}
              />
              <div className="fieldGrid">
                <div className="fieldRow">
                  <Form.Field className={styles.field}>
                    <label className="labelSmall">
                      <Icon className={'dateIcon'} name="info circle"/>
                      Number of rows
                    </label>
                    <input
                      type="number"
                      defaultValue={59}
                      step={0.5}
                      disabled={'cellSize' === gridType}
                    />
                  </Form.Field>
                </div>
                <div className="fieldRow">
                  <Form.Field className={styles.field}>
                    <label className="labelSmall">
                      <Icon className={'dateIcon'} name="info circle"/>
                      Time unit
                    </label>
                    <input
                      type="number"
                      defaultValue={112}
                      step={0.5}
                      disabled={'cellSize' === gridType}
                    />
                  </Form.Field>
                </div>
              </div>
            </div>
            <div>
              <Radio
                style={{marginBottom: '14px', fontSize: '16px', fontWeight: '600'}}
                label="Set by cell size"
                value="cellSize"
                checked={'cellSize' === gridType}
                onChange={() => handleGridTypeChange('cellSize')}
              />
              <div className="fieldGrid">
                <div className="fieldRow">
                  <Form.Field className={styles.field}>
                    <label className="labelSmall">
                      <Icon className={'dateIcon'} name="info circle"/>
                      Number of rows
                    </label>
                    <input
                      type="number"
                      defaultValue={101.5}
                      step={0.5}
                      disabled={'gridSize' === gridType}
                    />
                  </Form.Field>
                </div>
                <div className="fieldRow">
                  <Form.Field className={styles.field}>
                    <label className="labelSmall">
                      <Icon className={'dateIcon'} name="info circle"/>
                      Time unit
                    </label>
                    <input
                      type="number"
                      defaultValue={101.1}
                      step={0.5}
                      disabled={'gridSize' === gridType}
                    />
                  </Form.Field>
                </div>
              </div>
            </div>
          </DataGrid>
        </DataRow>
        {/*// ButtonGroup*/}
        <DataRow subTitle={'Edit active cells'}>
          <div className={styles.buttonGroup} style={{display: 'flex', gap: '15px'}}>
            <Button
              primary={true} size={'small'}
            >
              {'Single selection'}
            </Button>
            <Button
              primary={true} size={'small'}
            >
              {'Multiple selection'}
            </Button>
          </div>
        </DataRow>
        {/*// SliderGroup*/}
        <DataRow subTitle={'Grid rotation'}>
          <div className="fieldGridSlider">
            <div className="field">
              <label className="labelSmall">
                <Icon className={'dateIcon'} name="info circle"/>
                Rotation angle (°)
              </label>
              <input
                name="rotationAngle"
                type="number"
                value={gridRotation.rotationAngle}
                onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                step={1}
              />
            </div>
            <Slider
              className="fieldSlider"
              min={0}
              max={24000}
              step={100}
              value={gridRotation.rotationAngle}
              onChange={handleRotationChange}
            />
          </div>
          <div className="fieldGridSlider">
            <div className="field">
              <label className="labelSmall">
                <Icon className={'dateIcon'} name="info circle"/>
                Intersection
              </label>
              <input
                name="intersection"
                type="number"
                value={gridRotation.intersection}
                onChange={(e) => handleIntersectionChange(parseInt(e.target.value))}
                step={1}
              />
            </div>
            <Slider
              className="fieldSlider"
              min={0}
              max={24000}
              step={100}
              value={gridRotation.intersection}
              onChange={handleIntersectionChange}
            />
          </div>
        </DataRow>
        {/*// ButtonGroup*/}
        <DataRow subTitle={'Grid refinement'} className="borderBottom">
          <div className={styles.buttonGroup}>
            <Button
              primary={true} size={'small'}
            >
              {'Upload GeoJSON'}
            </Button>
            <Button
              primary={true} size={'small'}
            >
              {'Local refinement on map'}
            </Button>
          </div>
          <span className="required">*Download GeoJSON template</span>
        </DataRow>
        {/*// ButtonGroup*/}
        <DataRow>
          <div className={styles.buttonGroupRight}>
            <Button>
              {'Undo'}
            </Button>
            <Button
              primary={true}
            >
              {'Calculate cells'}
            </Button>
          </div>
        </DataRow>
      </DataGrid>
    </>;
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

  return (
    <div
      className={styles.modelWrapper}
      style={{height: `calc(100vh - ${headerHeight}px)`}}
    >
      <ModelSidebar showModelSidebar={showModelSidebar}/>
      <div className={styles.modelContent}>
        <DataSidebar>
          {children ? children : null}
          {/*{gridProperties()}*/}
          {/*{createModel()}*/}
          {/*{dataExample()}*/}
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
