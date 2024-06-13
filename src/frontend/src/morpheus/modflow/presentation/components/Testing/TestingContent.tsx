import React, {useState} from 'react';
import Slider from 'common/components/Slider/SimpleSlider';
import {Button, DataGrid, DataRow, DropdownComponent, SectionTitle, UploadFile} from 'common/components';
import {Form, Icon, Radio, Tab, TabPane, TextArea} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import styles from './TestingContent.module.less';

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
const TestingContent: React.FC = () => {

  // Upload File (OLD STYLE) =>

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const panes = [
    {menuItem: 'Drow on map', render: () => <TabPane><Button primary={true} size={'small'}>Drow on map</Button></TabPane>},
    {menuItem: 'Upload file', render: () => <TabPane><UploadFile/></TabPane>},
  ];

  const hendleDateChange = (name: string, date: Date) => {
    return 'startDate' === name ? setStartDate(date) : setEndDate(date);
  };


  // MODEL GRID SECTION (OLD STYLE) =>
  const [gridType, setGridType] = useState<'gridSize' | 'cellSize'>('gridSize');

  const handleGridTypeChange = (value: 'gridSize' | 'cellSize') => {
    setGridType(value);
  };

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

  return (
    <>
      {/* Upload File (OLD STYLE) => */}
      <div className={styles.fullHeight}>
        <DataGrid columns={2} style={{alignItems: 'normal'}}>
          <DataRow>
            <SectionTitle title={'Create model'}/>
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
              <DropdownComponent.Dropdown
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
                  <DropdownComponent.Dropdown
                    placeholder="meters"
                    selection={true}
                    options={lengthUnitOptions}
                  />
                </div>
                <div className="fieldRow">
                  <label className="labelSmall">Time unit</label>
                  <DropdownComponent.Dropdown
                    placeholder="days"
                    selection={true}
                    options={timeUnitOptions}
                  />
                </div>
              </div>
            </Form.Field>
            <Button primary={true}>Create model</Button>
          </DataRow>
          <DataRow>
            <SectionTitle title={'Model geometry'}/>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'stretch',
              height: '100%',
            }}
            >
              <h2 className="h4">Add model domain</h2>
              <Tab panes={panes} className={'tabs'}/>
            </div>
          </DataRow>
        </DataGrid>
        <div style={{marginTop: 'auto', paddingTop: '20px'}}><span className="required">*</span>Mandatory fields</div>
      </div>
      {/* MODEL GRID SECTION (OLD STYLE) => */}
      <DataGrid>
        <SectionTitle title={'Model Grid'}/>
        <DataRow>
          <SectionTitle subTitle={'Grid resolution'}/>
          <DataGrid columns={2}>
            <div>
              <Radio
                style={{marginBottom: '14px', fontSize: '16px', fontWeight: '500'}}
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
                style={{marginBottom: '14px', fontSize: '16px', fontWeight: '500'}}
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
        <DataRow>
          <SectionTitle subTitle={'Edit active cells'}/>
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
        <DataRow>
          <SectionTitle subTitle={'Grid rotation'}/>
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
        <DataRow className="borderBottom">
          <SectionTitle subTitle={'Grid refinement'}/>
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
    </>

  );
};


export default TestingContent;
