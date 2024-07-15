import React, {useEffect, useState} from 'react';
import {IHeadObservation} from '../../../types/HeadObservations.type';
import {Grid, InfoTitle, Tab, TimeSeriesDataChart} from 'common/components';
import ObservationsList from './ObservationsList';
import ObservationsForm from './ObservationsForm';
import {MenuItem, TabPane} from 'semantic-ui-react';
import ObservationsDataTable from './ObservationsDataTable/ObservationsDataTable';
import {ITimeDiscretization} from '../../../types';

interface IProps {
  observations: IHeadObservation[];
  selected: IHeadObservation | null;
  layers: { layer_id: string, name: string }[];
  timeDiscretization: ITimeDiscretization;
  formatDateTime: (value: string) => string;
  onClone: (id: IHeadObservation['id']) => Promise<void>;
  onDisable: (id: IHeadObservation['id']) => Promise<void>;
  onEnable: (id: IHeadObservation['id']) => Promise<void>;
  onSelect: (id: IHeadObservation['id']) => void;
  onChange: (observation: IHeadObservation) => void;
  onRemove: (id: IHeadObservation['id']) => Promise<void>;
  isReadOnly: boolean;
}

const HeadObservationListDetails = ({observations, selected, timeDiscretization, isReadOnly, layers, formatDateTime, ...commands}: IProps) => {

  const [selectedObservation, setSelectedObservation] = useState<IHeadObservation | null>(selected);

  useEffect(() => {
    setSelectedObservation(selected);
  }, [selected, observations]);

  const handleChange = (observation: IHeadObservation) => {
    setSelectedObservation(observation);
    commands.onChange(observation);
  };

  if (0 === observations.length) {
    return null;
  }

  return (
    <>
      <Grid.Grid
        columns={2}
        stackable={true}
        variant='secondary'
      >
        <Grid.Column width={9}>
          <ObservationsList
            observations={observations}
            selected={selectedObservation}
            onClone={commands.onClone}
            onDisable={commands.onDisable}
            onEnable={commands.onEnable}
            onSelect={commands.onSelect}
            onChange={handleChange}
            onRemove={commands.onRemove}
            isReadOnly={isReadOnly}
          />
        </Grid.Column>
        <Grid.Column width={7} style={{marginTop: '12px'}}>
          <InfoTitle
            title="Properties"
            secondary={true}
            actions={[
              {actionText: 'Edit on map', onClick: () => console.log('Action 2')},
            ]}
          />
          <ObservationsForm
            observation={selectedObservation}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            layers={layers}
          />
        </Grid.Column>
      </Grid.Grid>
      {selectedObservation && (
        <Grid.Grid>
          <Tab
            style={{width: '100%'}}
            variant='primary'
            menu={{secondary: true, pointing: true}}
            panes={[
              {
                menuItem: (
                  <MenuItem key='table'>
                    Table
                  </MenuItem>
                ),
                render: () => (
                  <TabPane attached={false}>
                    <ObservationsDataTable
                      observation={selectedObservation}
                      onChangeObservation={handleChange}
                      timeDiscretization={timeDiscretization}
                      isReadOnly={isReadOnly}
                    />
                  </TabPane>
                ),
              },
              {
                menuItem: <MenuItem key='Chart'>Chart</MenuItem>,
                render: () => <TabPane attached={false}>
                  <TimeSeriesDataChart
                    data={selectedObservation.data}
                    dateTimes={[...timeDiscretization.stress_periods.map((sp) => sp.start_date_time), timeDiscretization.end_date_time]}
                    formatDateTime={formatDateTime}
                  />
                </TabPane>,
              },
            ]}
          />
        </Grid.Grid>)
      }
    </>
  );
};

export default HeadObservationListDetails;
