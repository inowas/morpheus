import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import DatePicker from 'react-datepicker';
import {Button, Header, IPageWidth, ModelWrapper} from 'components';
import {DataGrid, DataRow, UploadFile} from 'components/ModelWrapper';
import {Dropdown, Form, Icon, TextArea} from 'semantic-ui-react';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import styles from './ModelWrapper.module.less';
import '../../morpheus/morpheus.less';

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

export const ModelWrapperPageExample: StoryFn<typeof ModelWrapper> = () => {

  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };

  const hendleDateChange = (name: string, date: Date) => {
    return 'startDate' === name ? setStartDate(date) : setEndDate(date);
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
          <div style={{marginTop: 'auto', paddingTop: '20px'}}><span className="required">*</span>Mandatory fields</div>
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
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems2}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showCreateButton={true}
        showModelSidebar={true}
        updateHeight={updateHeaderHeight}
      />
      <ModelWrapper
        headerHeight={headerHeight}
        showModelSidebar={true}
        style={{position: 'relative', zIndex: 0}}
      >
        {dataCreate()}
      </ModelWrapper>
    </div>
  );
};

