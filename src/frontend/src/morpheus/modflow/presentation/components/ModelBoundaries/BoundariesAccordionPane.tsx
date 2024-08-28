import React, {useEffect, useMemo, useState} from 'react';

import {IBoundary, IBoundaryId, IBoundaryType, IInterpolationType, IObservation, IObservationId, ISelectedBoundaryAndObservation} from '../../../types/Boundaries.type';
import BoundaryList from './BoundaryList';
import {Grid, InfoTitle, Tab, TimeSeriesDataChart} from 'common/components';
import {MenuItem, TabPane} from 'semantic-ui-react';

import BoundariesForm from './BoundaryForm';
import BoundaryDataTable from './BoundaryDataTable';

import {ILayer, ILayerId} from '../../../types/Layers.type';
import {ITimeDiscretization} from '../../../types';

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  formatDateTime: (value: string) => string;
  boundaryType: IBoundaryType;
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onSelectBoundaryAndObservation: (selectedBoundaryAndObservation: ISelectedBoundaryAndObservation) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onCloneBoundaryObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  onDisableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onEnableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onRemoveBoundaries: (boundaryIds: IBoundaryId[]) => Promise<void>;
  onRemoveBoundaryObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryInterpolation: (boundaryId: IBoundaryId, interpolation: IInterpolationType) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundary_name?: string, boundary_tags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

const BoundariesAccordionPane = ({
  boundaryType,
  boundaries,
  formatDateTime,
  layers,
  selectedBoundaryAndObservation,
  onSelectBoundaryAndObservation,
  onCloneBoundary,
  onCloneBoundaryObservation,
  onDisableBoundary,
  onEnableBoundary,
  onRemoveBoundaries,
  onRemoveBoundaryObservation,
  onUpdateBoundaryAffectedLayers,
  onUpdateBoundaryInterpolation,
  onUpdateBoundaryMetadata,
  onUpdateBoundaryObservation,
  isReadOnly,
  timeDiscretization,
}: IProps) => {

  const [selectedBoundary, setSelectedBoundary] = useState<IBoundary | undefined>(undefined);
  const [selectedBoundaryObservation, setSelectedBoundaryObservation] = useState<IObservation<any> | undefined>(undefined);

  useEffect(() => {
    const boundary = boundaries.find((b) => b.id === selectedBoundaryAndObservation?.boundary.id);
    if (boundary) {
      setSelectedBoundary(boundary);
      const observation = boundary.observations.find((o) => o.observation_id === selectedBoundaryAndObservation?.observationId);
      if (observation) {
        return setSelectedBoundaryObservation(observation);
      }

      return setSelectedBoundaryObservation(boundary.observations[0]);
    }


    setSelectedBoundary(boundaries[0]);
    setSelectedBoundaryObservation(boundaries[0].observations[0]);

  }, [selectedBoundaryAndObservation, selectedBoundaryAndObservation?.boundary, selectedBoundaryAndObservation?.observationId, boundaries]);

  const availableTags = useMemo(() => {
    if (!boundaries) {
      return [];
    }

    const tags: string[] = [];
    for (const boundary of boundaries) {
      for (const tag of boundary.tags) {
        if (!tags.includes(tag))
          tags.push(tag);
      }
    }

    tags.sort();
    return tags;

  }, [boundaries]);

  const handleChangeBoundaryName = (boundaryId: IBoundaryId, boundary_name: string) => onUpdateBoundaryMetadata(boundaryId, boundary_name);
  const handleChangeBoundaryTags = (boundaryId: IBoundaryId, boundaryTags: string[]) => onUpdateBoundaryMetadata(boundaryId, undefined, boundaryTags);


  if (!selectedBoundary || !selectedBoundaryObservation) {
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
          <BoundaryList
            boundaries={boundaries}
            isReadOnly={isReadOnly}
            selectedBoundaryAndObservation={{boundary: selectedBoundary, observationId: selectedBoundaryObservation.observation_id}}
            type={boundaryType}
            onChangeBoundaryName={handleChangeBoundaryName}
            onDisableBoundary={onDisableBoundary}
            onEnableBoundary={onEnableBoundary}
            onSelectBoundaryAndObservation={onSelectBoundaryAndObservation}
            onCloneBoundary={onCloneBoundary}
            onCloneObservation={onCloneBoundaryObservation}
            onRemoveBoundaries={onRemoveBoundaries}
            onRemoveObservation={onRemoveBoundaryObservation}
            onUpdateObservation={onUpdateBoundaryObservation}
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
          <BoundariesForm
            availableTags={availableTags}
            boundary={selectedBoundary}
            onChangeBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
            onChangeBoundaryInterpolation={onUpdateBoundaryInterpolation}
            onChangeBoundaryTags={handleChangeBoundaryTags}
            isReadOnly={isReadOnly}
            layers={layers}
          />
        </Grid.Column>
      </Grid.Grid>
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
                  <BoundaryDataTable
                    boundary={selectedBoundary}
                    observation={selectedBoundaryObservation}
                    onChangeObservation={(observation: IObservation<any>) => onUpdateBoundaryObservation(selectedBoundary.id, boundaryType, observation)}
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
                  data={selectedBoundaryObservation.data}
                  dateTimes={[...timeDiscretization.stress_periods.map((sp) => sp.start_date_time), timeDiscretization.end_date_time]}
                  formatDateTime={formatDateTime}
                  type={'forward_fill'}
                />
              </TabPane>,
            },
          ]}
        />
      </Grid.Grid>
    </>
  );
};

export default BoundariesAccordionPane;
