import React, {useState} from 'react';
import {ChartModal, Grid, Icon} from 'components';

import Chart from './Chart';
import styles from '../containers/T02Container.module.less';

interface IProps {
  data: { L: any, W: any, xData: number[], yData: number[], zData: any[][] };
}

const ChartWrapper = ({data}: IProps) => {
  const {L, W, xData, yData, zData} = data;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Grid.Grid style={{
        height: '100%',
      }}
      >
        <Icon
          name="expand arrows alternate"
          onClick={() => setShowModal(!showModal)}
          className={styles.icon}
          style={{position: 'absolute', zIndex: '2', cursor: 'pointer'}}
        />
        <Grid.Column style={{
          width: '100%',
          display: 'flex',
          flexGrow: '2',
        }}
        >
          <Chart
            data={{
              x: xData,
              y: yData,
              z: zData,
            }}
            basinLength={L}
            basinWidth={W}
            chartHeight={300}
            id="chart1"
          />
        </Grid.Column>
      </Grid.Grid>
      {showModal && (
        <ChartModal open={true} onClose={() => setShowModal(!showModal)}>
          <Chart
            data={{
              x: xData,
              y: yData,
              z: zData,
            }}
            basinLength={L}
            basinWidth={W}
            id="chart2"
          />
        </ChartModal>
      )}
    </>
  );
};

export default ChartWrapper;
