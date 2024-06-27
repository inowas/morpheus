import React from 'react';
import {Segment} from 'semantic-ui-react';

interface IProps {
  packages: string[] | null;
}

const CalculationPackages = ({packages}: IProps) => {

  if (!packages) {
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
        {packages.join('\n')}
      </pre>
    </Segment>
  );
};

export default CalculationPackages;
