import {Button, DatePicker} from 'common/components';
import Slider from 'common/components/Slider/SimpleSlider';
import {MapContainer, TileLayer} from 'react-leaflet';
import {Checkbox, Dropdown, Form, Icon, Radio} from 'semantic-ui-react';
import React from 'react';
import styles from './ProjectsFilter.module.less';
import {IFilterOptions, IFilterParams} from 'morpheus/modflow/application/useProjectList';

interface IProps {
  filterParams: IFilterParams;
  filterOptions: IFilterOptions;
  onChangeFilterParams: (filterParams: IFilterParams) => void;
  style?: React.CSSProperties;
}

const ProjectsFilter = ({
  filterParams,
  filterOptions,
  onChangeFilterParams,
  style,
}: IProps) => {

  // TODO! temporary Function to get "boundary" Description = maybe we can get this data from the backend
  function boundaryDescription(key: string) {
    switch (key) {
    case 'CHD':
      return 'Constant Head Boundary';
    case 'FHB':
      return 'Flow and Head Boundary';
    case 'WEL':
      return 'Wells';
    case 'RCH':
      return 'Recharge';
    case 'RIV':
      return 'Rivers';
    case 'GHB':
      return 'General Head Boundary';
    case 'EVT':
      return 'Evapotranspiration';
    case 'DRN':
      return 'Drain';
    case 'NB':
      return 'No boundaries';
    default:
      return '';
    }
  }

  function additionalDescription(key: string) {
    switch (key) {
    case 'soluteTransportMT3DMS':
      return 'Solute Transport MT3DMS';
    case 'dualDensityFlowSEAWAT':
      return 'Dual-density flow SEAWAT';
    case 'realTimeSensors':
      return 'Real-time sensors';
    case 'modelsWithScenarios':
      return 'Models with scenarios';
    default:
      return '';
    }
  }

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Form className={styles.projectsFilterForm} style={{...style}}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Filters</h2>
        <Button
          secondary={true} size={'small'}
          onClick={() => onChangeFilterParams({})}
        >
          Clear Filters
        </Button>
      </div>

      {/*// By Map*/}
      <Form.Field className={styles.field}>
        <Checkbox
          className={styles.checkboxLabel}
          label="By location"
          name="mapAccess"
        />
        <div className={`${styles.mapWrapper} map`}>
          <MapContainer
            className={styles.map}
            center={[50.940474211933974, 6.960182189941407]}
            zoom={1}
            style={{width: '100%', height: '200px', zIndex: 0}}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>
      </Form.Field>

      {/*// By Date*/}
      <Form.Field className={styles.field}>
        <Checkbox
          className={styles.checkboxLabel}
          label="By Date"
          name="dateAccess"
          checked={!!filterParams.date_range?.timestamp}
          onChange={(_, {checked}) => {
            if (checked) {
              onChangeFilterParams({
                ...filterParams, date_range: {
                  ...filterParams.date_range,
                  timestamp: 'created_at',
                  start_date: filterOptions.by_date.created_at.start_date,
                  end_date: filterOptions.by_date.created_at.end_date,
                },
              });

            } else {
              onChangeFilterParams({...filterParams, date_range: undefined});
            }
          }}
        />
        <div className={styles.radioWrapper}>
          <Radio
            disabled={!filterParams.date_range?.timestamp}
            className={styles.radio}
            label="Created Date"
            name="dateType"
            value="created_at"
            checked={'created_at' === filterParams.date_range?.timestamp || false}
            onChange={(_, {value}) => onChangeFilterParams({...filterParams, date_range: {...filterParams.date_range, timestamp: value as string}})}
          />
          <Radio
            disabled={!filterParams.date_range?.timestamp}
            className={styles.radio}
            label="Modified Date"
            name="dateType"
            value="updated_at"
            checked={'updated_at' === filterParams.date_range?.timestamp || false}
            onChange={(_, {value}) => onChangeFilterParams({...filterParams, date_range: {...filterParams.date_range, timestamp: value as string}})}
          />
          <Radio
            disabled={!filterParams.date_range?.timestamp}
            className={styles.radio}
            label="Model Date"
            name="dateType"
            value="model_date"
            checked={'model_date' === filterParams.date_range?.timestamp || false}
            onChange={(_, {value}) => onChangeFilterParams({...filterParams, date_range: {...filterParams.date_range, timestamp: value as string}})}
          />
        </div>
        <div className={'dateInputWrapper datePicker fieldGrid'}>
          <div className={'rowTwoColumns'}>
            <label className="labelSmall">Date from</label>
            <div className={'divider'}>
              <DatePicker
                disabled={!filterParams.date_range?.timestamp}
                selected={
                  filterParams.date_range?.timestamp
                    ? filterParams.date_range.start || filterOptions.by_date[filterParams.date_range.timestamp].start_date
                    : filterOptions.by_date.created_at.start_date
                }
                dateFormat="dd.MM.yyyy"
                onChange={(date) => onChangeFilterParams({...filterParams, date_range: {...filterParams.date_range, start: date}})}
                className={filterParams.date_range?.start || 'dateInputUnselected'}
              />
              <Icon className={'dateIcon'} name="calendar outline"/>
            </div>
          </div>
          <div className={'rowTwoColumns'}>
            <label className="labelSmall">Date to</label>
            <div className={'divider'}>
              <DatePicker
                disabled={!filterParams.date_range?.timestamp}
                selected={
                  filterParams.date_range?.timestamp
                    ? filterParams.date_range.end || filterOptions.by_date[filterParams.date_range.timestamp].end_date
                    : filterOptions.by_date.created_at.end_date
                }
                dateFormat="dd.MM.yyyy"
                onChange={(date) => onChangeFilterParams({...filterParams, date_range: {...filterParams.date_range, end: date}})}
                className={filterParams.date_range?.end || 'dateInputUnselected'}
              />
              <Icon className={'dateIcon'} name="calendar outline"/>
            </div>
          </div>
        </div>
      </Form.Field>


      {/*// By ownership*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By ownership</label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="My models"
            name="myModels"
            checked={!!filterParams.my_groups}
            onChange={(_, {checked}) => onChangeFilterParams({...filterParams, my_groups: checked || undefined})}
          />
          <span className={styles.count}>(<span>{filterOptions.number_of_my_projects}</span>)</span>
        </div>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="Models from my groups"
            name="modelsFromGroups"
            checked={!!filterParams.my_projects}
            onChange={(_, {checked}) => onChangeFilterParams({...filterParams, my_projects: checked || undefined})}
          />
          <span className={styles.count}>(<span>{filterOptions.number_of_my_group_projects}</span>)</span>
        </div>
        <label className={styles.labelSmall}>Owners</label>
        <Dropdown
          className={styles.dropdown}
          name="selectedOwners"
          clearable={true}
          multiple={true}
          selection={true}
          options={filterOptions.users.map(user => ({
            key: user.user_id,
            value: user.unsername,
            text: <span>{user.unsername} <span className={styles.count}>(<span>{user.count}</span>)</span></span>,
          }))}
          placeholder="Select Owner"
          value={filterParams.users || []}
          onChange={(_, {value}) => {
            if (Array.isArray(value)) {
              const selectedOptions = value.map(option => String(option));
              onChangeFilterParams({...filterParams, users: 0 < selectedOptions.length ? selectedOptions : undefined});
            }
          }}
        />
      </Form.Field>

      {/*// By status*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By status</label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="Calculations finalised"
            name="calculationsFinalized"
            checked={!!filterParams.status?.includes('green')}
            onChange={(_, {checked}) => {
              const updatedStatus = checked
                ? [...(filterParams.status || []), 'green']
                : (filterParams.status || []).filter(status => 'green' !== status);
              onChangeFilterParams({...filterParams, status: 0 < updatedStatus.length ? updatedStatus : undefined});
            }}
          />
          <span className={styles.count}>
            (<span>{filterOptions.by_status.green}</span>)
            <i className={styles.metaStatus} style={{background: '#08E600'}}></i>
          </span>
        </div>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            className={styles.checkbox}
            label="Calculations not finalised"
            name="calculationsNotFinalized"
            checked={!!filterParams.status?.includes('red')}
            onChange={(_, {checked}) => {
              const updatedStatus = checked
                ? [...(filterParams.status || []), 'red']
                : (filterParams.status || []).filter(status => 'red' !== status);
              onChangeFilterParams({...filterParams, status: 0 < updatedStatus.length ? updatedStatus : undefined});
            }}
          />
          <span className={styles.count}>
            (<span>{filterOptions.by_status.red}</span>)
            <i className={styles.metaStatus} style={{background: '#C8C8C8'}}></i></span>
        </div>
      </Form.Field>

      {/*// By Boundary Conditions*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By boundary conditions</label>
        {Object.entries(filterOptions.boundary_conditions).map(([key, value]) => (
          <div className={styles.checkboxWrapper} key={key}>
            <Checkbox
              className={`${styles.checkbox} ${styles.checkboxBoundary}`}
              label={key}
              name={key}
              checked={(filterParams.boundary_conditions && filterParams.boundary_conditions.includes(key)) || false}
              onChange={() => {
                const updatedBoundaryConditions = filterParams.boundary_conditions
                  ? filterParams.boundary_conditions.includes(key)
                    ? filterParams.boundary_conditions.filter(bc => bc !== key)
                    : [...filterParams.boundary_conditions, key]
                  : [key];
                onChangeFilterParams({
                  ...filterParams,
                  boundary_conditions:
                    0 < updatedBoundaryConditions.length
                      ? updatedBoundaryConditions
                      : undefined,
                });
              }}
            />
            <p className={styles.description}>{boundaryDescription(key)}</p>
            <span className={styles.count}>(<span>{value}</span>)</span>
          </div>
        ))}
      </Form.Field>

      {/*// By Number of Grid Cells*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By number of grid cells</label>
        <div className={styles.sliderWrapper}>
          <Slider
            className={styles.slider}
            min={filterOptions.number_of_grid_cells.min}
            max={filterOptions.number_of_grid_cells.max}
            step={filterOptions.number_of_grid_cells.step}
            value={filterParams.number_of_grid_cells || filterOptions.number_of_grid_cells.min}
            onChange={(value) => onChangeFilterParams({
              ...filterParams, number_of_grid_cells:
                'number' === typeof value && 0 < value
                  ? value
                  : undefined,
            })}
            ariaLabelForHandle={formatNumber(filterParams.number_of_grid_cells || filterOptions.number_of_grid_cells.min)}
          />
          <span className={styles.sliderLabel}>{formatNumber(filterOptions.number_of_grid_cells.min)}</span>
          <span className={styles.sliderLabel}>{formatNumber(filterOptions.number_of_grid_cells.max)}</span>
        </div>
      </Form.Field>

      {/*// By Number of Stress Periods*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By number of stress periods</label>
        <div className={styles.sliderWrapper}>
          <Slider
            className={styles.slider}
            min={filterOptions.number_of_stress_periods.min}
            max={filterOptions.number_of_stress_periods.max}
            step={filterOptions.number_of_stress_periods.step}
            value={filterParams.number_of_stress_periods || filterOptions.number_of_stress_periods.min}
            onChange={(value) => onChangeFilterParams({
              ...filterParams, number_of_stress_periods:
                'number' === typeof value && 0 < value
                  ? value
                  : undefined,
            })}
            ariaLabelForHandle={formatNumber(filterParams.number_of_stress_periods || filterOptions.number_of_stress_periods.min)}
          />
          <span className={styles.sliderLabel}>{formatNumber(filterOptions.number_of_stress_periods.min)}</span>
          <span className={styles.sliderLabel}>{formatNumber(filterOptions.number_of_stress_periods.max)}</span>
        </div>
      </Form.Field>

      {/*// By Number of Layers*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By number of layers</label>
        <div className={styles.sliderWrapper}>
          <Slider
            className={styles.slider}
            min={filterOptions.number_of_layers.min}
            max={filterOptions.number_of_layers.max}
            step={filterOptions.number_of_layers.step}
            value={filterParams.number_of_layers || filterOptions.number_of_layers.min}
            onChange={(value) => onChangeFilterParams({
              ...filterParams, number_of_layers:
                'number' === typeof value && 0 < value
                  ? value
                  : undefined,
            })}
            ariaLabelForHandle={formatNumber(filterParams.number_of_layers || filterOptions.number_of_layers.min)}
          />
          <span className={styles.sliderLabel}>{formatNumber(filterOptions.number_of_layers.min)}</span>
          <span className={styles.sliderLabel}>{formatNumber(filterOptions.number_of_layers.max)}</span>
        </div>
      </Form.Field>

      {/*// By Additional Features*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By additional features</label>
        {Object.entries(filterOptions.additional_features).map(([key, value]) => (
          <div className={styles.checkboxWrapper} key={key}>
            <Checkbox
              className={styles.checkbox}
              label={additionalDescription(key)}
              name={key}
              checked={(filterParams.additional_features && filterParams.additional_features.includes(key)) || false}
              onChange={() => {
                const updatedAdditionalFeatures = filterParams.additional_features
                  ? filterParams.additional_features.includes(key)
                    ? filterParams.additional_features.filter(af => af !== key)
                    : [...filterParams.additional_features, key]
                  : [key];
                onChangeFilterParams({
                  ...filterParams,
                  additional_features:
                    0 < updatedAdditionalFeatures.length
                      ? updatedAdditionalFeatures
                      : undefined,
                });
              }}
            />
            <span className={styles.count}>(<span>{value}</span>)</span>
          </div>
        ))}
      </Form.Field>

      {/*// By Keywords*/}
      <Form.Field className={styles.field}>
        <label className={styles.label}>By keywords</label>
        <Dropdown
          className={styles.dropdown}
          name="selectedKeywords"
          placeholder="Select keywords"
          fluid={true}
          multiple={true}
          selection={true}
          options={Object.entries(filterOptions.tags).map(([tagName, count]) => ({
            key: tagName,
            text: (
              <span>
                {tagName}
                <span className={styles.count}>(<span>{count}</span>)</span>
              </span>
            ),
            value: tagName,
          }))}
          value={filterParams.tags || []}
          onChange={(_, {value}) => {
            if (Array.isArray(value)) {
              const selectedOptions = value.map(option => String(option));
              onChangeFilterParams({...filterParams, tags: 0 < selectedOptions.length ? selectedOptions : undefined});
            }
          }}
        />

      </Form.Field>

    </Form>

  );
};

export default ProjectsFilter;
