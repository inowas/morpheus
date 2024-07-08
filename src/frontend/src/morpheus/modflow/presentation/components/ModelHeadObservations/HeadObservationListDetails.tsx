import React, {useEffect, useState} from 'react';
import {IHeadObservation} from '../../../types/HeadObservations.type';
import {Grid, InfoTitle} from 'common/components';
import ObservationsList from './ObservationsList';
import ObservationsForm from './ObservationsForm';

interface IProps {
  observations: IHeadObservation[];
  selected: IHeadObservation['id'] | null;
  layers: { layer_id: string, name: string }[];
  onClone: (id: IHeadObservation['id']) => Promise<void>;
  onDisable: (id: IHeadObservation['id']) => Promise<void>;
  onEnable: (id: IHeadObservation['id']) => Promise<void>;
  onSelect: (id: IHeadObservation['id']) => void;
  onChange: (observation: IHeadObservation) => void;
  onRemove: (id: IHeadObservation['id']) => Promise<void>;
  isReadOnly: boolean;
}

const HeadObservationListDetails = ({observations, selected, isReadOnly, layers, ...commands}: IProps) => {

  const [selectedObservation, setSelectedObservation] = useState<IHeadObservation | null>(null);

  useEffect(() => {
    if (!observations.length) {
      return setSelectedObservation(null);
    }
    setSelectedObservation(observations.find((o) => o.id === selected) || null);
  }, [selected, observations]);

  const handleOnChange = (observation: IHeadObservation) => {
    setSelectedObservation(observation);
  };

  if (0 === observations.length) {
    return null;
  }

  return (
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
          onChange={handleOnChange}
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
          onChange={handleOnChange}
          isReadOnly={isReadOnly}
          layers={layers}
        />

      </Grid.Column>
    </Grid.Grid>
  );
};

export default HeadObservationListDetails;
