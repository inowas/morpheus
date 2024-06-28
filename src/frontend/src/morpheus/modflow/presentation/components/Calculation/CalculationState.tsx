import React from 'react';
import {Segment} from 'semantic-ui-react';
import {ICalculation, ICalculationState} from '../../../types/Calculation.type';
import {Button, Progress} from 'common/components';

interface IProps {
  calculation?: ICalculation;
  isLoading: boolean;
  isReadOnly: boolean;
  onStartCalculation?: () => void;
}

const calculateProgress = (state: ICalculationState) => {
  switch (state) {
  case 'created':
    return 0;
  case 'queued':
    return 10;
  case 'preprocessing':
    return 20;
  case 'preprocessed':
    return 30;
  case 'calculating':
    return 40;
  case 'completed':
    return 100;
  case 'canceled':
    return 0;
  case 'failed':
    return 0;
  default:
    return 0;
  }
};

const CalculationState = ({calculation, isLoading, isReadOnly, onStartCalculation}: IProps) => {


  const renderProgress = (calculationState: ICalculationState) => {
    return (
      <Progress
        indicating={true}
        percent={calculateProgress(calculationState)} autoSuccess={true}
        success={'completed' == calculationState}
        error={'failed' == calculationState}
        warning={'canceled' == calculationState}
      >
        {calculationState}
      </Progress>
    );
  };

  const renderCalculateButton = () => {
    if (isReadOnly) {
      return <p>Waiting for Start Calculation</p>;
    }

    return (
      <Button primary={true} onClick={onStartCalculation}>Start Calculation</Button>
    );
  };

  return (
    <Segment basic={true} loading={isLoading}>
      <h1>Calculation Status</h1>
      {calculation ? renderProgress(calculation.state) : null}
      {calculation?.calculation_log ? <pre style={{backgroundColor: '#f9f9f9'}}>{calculation.calculation_log.join('\n')}</pre> : null}
      {!calculation ? renderCalculateButton() : null}
    </Segment>
  );
};

export default CalculationState;
