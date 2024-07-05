import React from 'react';
import {Segment} from 'semantic-ui-react';

interface IProps {
  model_check_log: string[] | null;
}

const ModelCheckLog = ({model_check_log}: IProps) => {

  if (!model_check_log) {
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
        {model_check_log.join('\n')}
      </pre>
    </Segment>
  );
};

export default ModelCheckLog;
