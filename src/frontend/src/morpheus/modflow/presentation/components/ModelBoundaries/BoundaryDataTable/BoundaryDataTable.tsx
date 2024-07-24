import React from 'react';
import {IBoundary, IObservation} from '../../../../types/Boundaries.type';
import {ITimeDiscretization} from '../../../../types';
import BoundaryDataTableStressPeriods from './BoundaryDataTableStressPeriods';
import {isTimeSeriesDependent} from '../helpers';
import BoundaryDataTableFreeDates from './BoundaryDataTableFreeDates';

interface IProps {
  boundary: IBoundary;
  observation: IObservation<any>;
  onChangeObservation: (observation: IObservation<any>) => void;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

const BoundaryDataTable = ({boundary, observation, timeDiscretization, isReadOnly, onChangeObservation}: IProps) => {

  if (isTimeSeriesDependent(boundary.type) && ['none', 'forward_fill'].includes(boundary.interpolation)) {
    return (
      <BoundaryDataTableStressPeriods
        boundaryType={boundary.type}
        observation={observation}
        onChangeObservation={onChangeObservation}
        timeDiscretization={timeDiscretization}
        isReadOnly={isReadOnly}
      />
    );
  }

  return (
    <BoundaryDataTableFreeDates
      boundaryType={boundary.type}
      observation={observation}
      onChangeObservation={onChangeObservation}
      timeDiscretization={timeDiscretization}
      isReadOnly={isReadOnly}
    />
  );
};

export default BoundaryDataTable;
