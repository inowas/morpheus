import React, {useState} from 'react';
import {Checkbox, Dropdown, Form, Icon, Radio} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FormFilter.module.less';
import Button from '../Button/Button';
import Slider from 'rc-slider';
import {IModelCard} from '../ModelCard';
import {additionalDescription, boundaryDescription, createOwnerOptions} from './infrastructure/calculate';
import {IFilterOptions} from './types/Filter.type';
import useFilterOptions from './hooks/useFilter';


interface IProps {
  data: IModelCard[];
  updateModelData: (data: IModelCard[]) => void;
}

const defaultFilterOptions: IFilterOptions = {
  myModels: false,
  modelsFromGroups: false,
  calculationsFinalized: false,
  calculationsNotFinalized: false,
  selectedOwners: [],
  boundaryValues: {
    CHD: false,
    FHB: false,
    WEL: false,
    RCH: false,
    RIV: false,
    GHB: false,
    EVT: false,
    DRN: false,
    NB: false,
  },
  additionalFeatures: {
    soluteTransportMT3DMS: false,
    dualDensityFlowSEAWAT: false,
    realTimeSensors: false,
    modelsWithScenarios: false,
  },
  selectedKeywords: [],
  modifiedDate: false,
  createdDate: false,
  modelDate: false,
  fromDate: '2023-01-01',
  toDate: '2024-01-01',
  gridCellsValue: 36000,
};

const userName: string = 'Catalin Stefan';

const options = [
  {key: '1', text: 'React', value: 'React'},
  {key: '2', text: 'Python', value: 'Python'},
  {key: '3', text: 'Ezousa', value: 'Ezousa'},
  {key: '4', text: 'Simulation', value: 'Simulation'},
  {key: '5', text: 'Data', value: 'Data'},
];

const FormFilter = ({data, updateModelData}: IProps) => {
  const [modelData, setModelData] = useState(data);
  const ownerOptions = createOwnerOptions(modelData);


  const countValue = (key: keyof IModelCard, value: string) => {
    let count = 0;
    modelData.forEach((model) => {
      if (model[key] === value) {
        count++;
      }
    });
    return count;
  };

  const countStatus = (status: boolean) => {
    return modelData.filter((model) => model.meta_status === status).length;
  };

  const rendomCount = () => {
    return Math.floor(Math.random() * 50);
  };

  const {
    filterOptions,
    handleRadioChange,
    handleFilterChange,
    handleDropdownChange,
    handleBoundaryChange,
    handleAdditionalFeaturesChange,
    handleDateChange,
    handleSlider,
    handleClearFilters,
  } = useFilterOptions(data, updateModelData, userName, defaultFilterOptions);


  return (

    <Form className={styles.form}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Filters</h2>
        <Button
          secondary={true} size={'small'}
          onClick={() => {
            handleClearFilters();
          }}
        >Clear Filters</Button>
      </div>
      {/*// By ownership*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Ownership</label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="My models"
            name="myModels"
            checked={filterOptions.myModels}
            onChange={(_, {checked}) => handleFilterChange('myModels', checked || false)}
          />
          <span className={styles.count}>(<span>{countValue('meta_author_name', userName)}</span>)</span>
        </div>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="Models from my groups"
            name="modelsFromGroups"
            checked={filterOptions.modelsFromGroups}
            onChange={(_, {checked}) => handleFilterChange('modelsFromGroups', checked || false)}
          /><span className={styles.count}>(<span>{rendomCount()}</span>)</span>
        </div>
        <label className={styles.labelSmall}>Owners</label>
        <Dropdown
          className={styles.dropdown}
          name="selectedOwners"
          clearable={true}
          multiple={true}
          selection={true}
          options={ownerOptions}
          placeholder="Select Owner"
          value={filterOptions.selectedOwners}
          onChange={(_, {value}) => {
            // Convert single value to an array
            const selectedOptions = Array.isArray(value) ? value : [value];
            handleDropdownChange('selectedOwners', selectedOptions);
          }}
        />
      </Form.Field>
      {/*// By status*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Status</label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="Calculations finalised"
            name="calculationsFinalized"
            checked={filterOptions.calculationsFinalized}
            onChange={(_, {checked}) => handleFilterChange('calculationsFinalized', checked || false)}
          />
          <span className={styles.count}>(<span>{countStatus(true)}</span>)<i className={styles.metaStatus} style={{background: '#08E600'}}></i></span>
        </div>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="Calculations not finalised"
            name="calculationsNotFinalized"
            checked={filterOptions.calculationsNotFinalized}
            onChange={(_, {checked}) => handleFilterChange('calculationsNotFinalized', checked || false)}
          />
          <span className={styles.count}>(<span>{countStatus(false)}</span>)<i className={styles.metaStatus} style={{background: '#C8C8C8'}}></i></span>
        </div>
      </Form.Field>
      {/*// By Date*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Date</label>
        <div className={styles.radioWrapper}>
          <Radio
            className={styles.radio}
            label="Modified Date"
            name="dateType"
            value="modified"
            checked={filterOptions.modifiedDate}
            onChange={(_, {value}) => handleRadioChange(value as string)}
          />
          <Radio
            className={styles.radio}
            label="Created Date"
            name="dateType"
            value="created"
            checked={filterOptions.createdDate}
            onChange={(_, {value}) => handleRadioChange(value as string)}
          />
          <Radio
            className={styles.radio}
            label="Model Date"
            name="dateType"
            value="model"
            checked={filterOptions.modelDate}
            onChange={(_, {value}) => handleRadioChange(value as string)}
          />
        </div>
        <div className={styles.dateInputWrapper}>
          <div className={styles.dateInputInner}>
            <label className={styles.dateLable}>From Date</label>
            <div className={styles.divider}>
              <DatePicker
                selected={new Date(filterOptions.fromDate)}
                dateFormat="dd.MM.yyyy"
                onChange={(date) => handleDateChange(date, 'fromDate')}
                className={styles.dateInput}
              />
              <Icon className={styles.dateIcon} name="calendar outline"/>
            </div>
          </div>
          <div className={styles.dateInputInner}>
            <label className={styles.dateLable}>To Date</label>
            <div className={styles.divider}>
              <DatePicker
                selected={new Date(filterOptions.toDate)}
                dateFormat="dd.MM.yyyy"
                onChange={(date) => handleDateChange(date, 'toDate')}
                className={styles.dateInput}
              />
              <Icon className={styles.dateIcon} name="calendar outline"/>
            </div>
          </div>
          {/*<div className={styles.dateInputInner}>*/}
          {/*  <Input*/}
          {/*    className={styles.dateInput}*/}
          {/*    type="date"*/}
          {/*    label="Date from"*/}
          {/*    name="fromDate"*/}
          {/*    value={filterOptions.fromDate}*/}
          {/*    onChange={handleDateChange}*/}
          {/*  />*/}
          {/*  <Icon className={styles.dateIcon} name="calendar outline"/>*/}
          {/*</div>*/}
          {/*<div className={styles.dateInputInner}>*/}
          {/*  <Input*/}
          {/*    className={styles.dateInput}*/}
          {/*    type="date"*/}
          {/*    label="Date to"*/}
          {/*    name="toDate"*/}
          {/*    value={filterOptions.toDate}*/}
          {/*    onChange={handleDateChange}*/}
          {/*  />*/}
          {/*  <Icon className={styles.dateIcon} name="calendar outline"/>*/}
          {/*</div>*/}
        </div>
      </Form.Field>
      {/*// By Boundary Conditions*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Boundary Conditions</label>
        {Object.keys(filterOptions.boundaryValues).map((key) => (
          <div className={styles.checkboxWrapper} key={key}>
            <Checkbox
              className={styles.checkbox}
              label={key}
              name={key}
              checked={filterOptions.boundaryValues[key]}
              onChange={(event, {checked}) => handleBoundaryChange(key, checked || false)}
            />
            <p className={styles.description}>{boundaryDescription(key)}</p>
            <span className={styles.count}>(<span>{rendomCount()}</span>)</span>
          </div>
        ))}
      </Form.Field>
      {/*// By Number of Grid Cells*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Number of Grid Cells</label>
        <Slider
          min={1}
          max={240000}
          step={100}
          value={filterOptions.gridCellsValue}
          onChange={handleSlider}
        />
      </Form.Field>
      {/*// By Additional Features*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Additional Features</label>
        {Object.keys(filterOptions.additionalFeatures).map((key) => (
          <div className={styles.checkboxWrapper} key={key}>
            <Checkbox
              className={styles.checkbox}
              name={key}
              label={additionalDescription(key)}
              checked={filterOptions.additionalFeatures[key]}
              onChange={(event, {checked}) => handleAdditionalFeaturesChange(key, checked || false)}
            />
            <span className={styles.count}>(<span>{rendomCount()}</span>)</span>
          </div>
        ))}
      </Form.Field>
      {/*// By Keywords*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By Keywords</label>
        <Dropdown
          name="selectedKeywords"
          placeholder="Select keywords"
          fluid={true}
          multiple={true}
          selection={true}
          options={options}
          value={filterOptions.selectedKeywords}
          onChange={(_, {value}) => {
            // Convert single value to an array
            const selectedOptions = Array.isArray(value) ? value : [value];
            handleDropdownChange('selectedKeywords', selectedOptions);
          }}
        />
      </Form.Field>
    </Form>

  );
};

export default FormFilter;
