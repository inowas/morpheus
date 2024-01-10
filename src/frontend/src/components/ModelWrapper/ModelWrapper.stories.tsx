import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import DatePicker from 'react-datepicker';
import Slider from 'rc-slider';
import {Button, Header, IPageWidth, ModelWrapper} from 'components';
import {DataGrid, DataRow, UploadFile} from 'components/ModelWrapper';
import {Dropdown, Form, Icon, Radio, Tab, TabPane, TextArea} from 'semantic-ui-react';
import styles from './ModelWrapper.module.less';
import '../../morpheus/morpheus.less';
import '../rc-slider.css';

const navbarItems2 = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'filters', label: 'Filters', admin: false, to: '/tools'},
  {name: 'documentation', label: 'Documentation', admin: false, to: '/modflow'},
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

const pageSize: IPageWidth = 'auto';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Modflow/ModelWrapper',
  component: ModelWrapper,
} as Meta<typeof ModelWrapper>;


export const ModelWrapperCreateModel: StoryFn<typeof ModelWrapper> = () => {
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const showModelSidebar = false;
  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };

  const hendleDateChange = (name: string, date: Date) => {
    return 'startDate' === name ? setStartDate(date) : setEndDate(date);
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


  return (
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems2}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showCreateButton={true}
        showModelSidebar={showModelSidebar}
        updateHeight={updateHeaderHeight}
      />
      <ModelWrapper
        headerHeight={headerHeight}
        showModelSidebar={showModelSidebar}
        style={{position: 'relative', zIndex: 0}}
      >
        {createModel()}
      </ModelWrapper>
    </div>
  );
};


export const ModelWrapperGridProperties: StoryFn<typeof ModelWrapper> = () => {
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const showModelSidebar = true;
  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };

  //TODO: Checkbox for grid type
  const [gridType, setGridType] = React.useState<'gridSize' | 'cellSize'>('gridSize');
  const handleGridTypeChange = (value: 'gridSize' | 'cellSize') => {
    setGridType(value);
  };

  //TODO: Slider for grid rotation
  const [gridRotation, setGridRotation] = React.useState({
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

  return (
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems2}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showCreateButton={true}
        showModelSidebar={showModelSidebar}
        updateHeight={updateHeaderHeight}
      />
      <ModelWrapper
        headerHeight={headerHeight}
        showModelSidebar={showModelSidebar}
        style={{position: 'relative', zIndex: 0}}
      >
        {gridProperties()}
      </ModelWrapper>
    </div>
  );
};

