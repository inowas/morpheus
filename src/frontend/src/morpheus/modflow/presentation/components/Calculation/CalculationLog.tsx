import React from 'react';
import {Segment} from 'semantic-ui-react';

interface IProps {
  calculation_log: string[] | null;
}

const CalculationLog = ({calculation_log}: IProps) => {

  if (!calculation_log) {
    return null;
  }


  return (
    <Segment raised={true} style={{padding: 0}}>
      <pre
        style={{
          backgroundColor: '#f7f7f7',
          padding: '20px',
        }}
      >
        {calculation_log.join('\n')}
      </pre>
    </Segment>
  );
};

export default CalculationLog;
