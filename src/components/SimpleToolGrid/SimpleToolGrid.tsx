import {Grid, Segment} from 'semantic-ui-react';
import styles from './SimpleToolGrid.module.less';
import useIsMobile from 'simpletools/common/hooks/useIsMobile';
import React from 'react';

interface IProps {
  rows: number;
  children: React.ReactNode[];
}

const SimpleToolGrid = ({rows, children}: IProps) => {

  const {isMobile} = useIsMobile();
  const renderRow = (numberOfRow: number) => (
    <Grid.Row
      key={numberOfRow} stretched={true}
      className={styles.row}
    >
      <Grid.Column
        // width={!isMobile ? 6 : 16}
        computer={6}
        tablet={16}
        className={`${styles.column} ${styles.column_s}`}
      >
        {children[numberOfRow * 2] &&
          <Segment
            color={'grey'} padded={true}
            className={styles.segment}
          >
            {children[numberOfRow * 2]}
          </Segment>
        }
      </Grid.Column>
      <Grid.Column
        // width={!isMobile ? 10 : 16}
        computer={10}
        tablet={16}
        className={`${styles.column} ${styles.column_m}`}
      >
        {children[numberOfRow * 2 + 1] &&
          <Segment
            color={'blue'} padded={true}
            className={styles.segment}
          >
            {children[numberOfRow * 2 + 1]}
          </Segment>
        }
      </Grid.Column>
    </Grid.Row>
  );

  const renderRows = () => new Array(rows).fill(0).map((_, i) => renderRow(i));

  return (
    <Grid padded={true} className={`${styles.SimpleToolGrid} ${styles.containerGrid}`}>
      {isMobile ? (
        <div className={styles.SimpleToolGrid_inner}>
          {renderRows()}
        </div>
      ) : (
        <>{renderRows()}</>
      )}
    </Grid>
  );
};


export default SimpleToolGrid;
