import React from 'react';
import {Segment} from 'semantic-ui-react';
import {ICalculation, ICalculationState} from '../../../types/Calculation.type';
import {Button, Progress} from 'common/components';

interface IProps {
  calculation?: ICalculation;
  isReadOnly: boolean;
  onStartCalculation: () => void;
  onNavigateToResults: () => void;
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

const CalculationState = ({calculation, isReadOnly, onStartCalculation, onNavigateToResults}: IProps) => {


  const renderProgress = (c: ICalculation) => {
    const isFailed = 'failed' === c.state;
    const isSuccess = 'completed' === c.state && 'success' === c.result?.type;
    const isWarning = 'canceled' === c.state || ('completed' === c.state && 'failure' === c.result?.type);
    return (
      <Progress
        active={true}
        percent={calculateProgress(c.state)} autoSuccess={true}
        success={isSuccess}
        error={isFailed}
        warning={isWarning}
      >
        {`${c.state[0].toUpperCase() + c.state.slice(1)} ${isWarning ? 'with warning' : ''}`}
      </Progress>
    );
  };

  const renderButtonToResults = () => {
    if (!calculation || !calculation.result) {
      return null;
    }
    return (
      <Button
        primary={true} onClick={onNavigateToResults}
        floated={'right'}
      >
        Go to Results
      </Button>
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
    <Segment basic={true}>
      <h1>Calculation Status</h1>
      {calculation ? renderProgress(calculation) : null}
      {calculation ? renderButtonToResults() : null}
      {calculation?.calculation_log ? <pre style={{backgroundColor: '#f9f9f9'}}>{calculation.calculation_log.join('\n')}</pre> : null}
      {!calculation ? renderCalculateButton() : null}
    </Segment>
  );
};

export default CalculationState;
