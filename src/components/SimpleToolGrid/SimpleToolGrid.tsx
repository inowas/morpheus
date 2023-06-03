import {Grid, Segment} from 'semantic-ui-react';
import React from 'react';

interface IProps {
  rows: number;
  children: React.ReactNode[];
}

const SimpleToolGrid = ({rows, children}: IProps) => {

  const renderRow = (numberOfRow: number) => (
    <Grid.Row key={numberOfRow} stretched={true}>
      <Grid.Column width={6}>
        {children[numberOfRow * 2] &&
          <Segment color={'grey'} padded={true}>
            {children[numberOfRow * 2]}
          </Segment>
        }
      </Grid.Column>
      <Grid.Column width={10}>
        {children[numberOfRow * 2 + 1] &&
          <Segment color={'blue'} padded={true}>
            {children[numberOfRow * 2 + 1]}
          </Segment>
        }
      </Grid.Column>
    </Grid.Row>
  );

  const renderRows = () => new Array(rows).fill(0).map((_, i) => renderRow(i));

  return (
    <Grid padded={true}>
      {renderRows()}
    </Grid>
  );
};


export default SimpleToolGrid;
