import React, {useState} from 'react';
import {Grid, Icon} from 'semantic-ui-react';
import Chart from './Chart';
import styles from '../containers/T02Container.module.less';

interface IMounding {
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  calculateHMax: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
}

interface IProps {
  data: { L: any, W: any, xData: number[], yData: number[], zData: any[][] };
}

const ChartWrapper = ({data}: IProps) => {

  const {L, W, xData, yData, zData} = data;

  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  // useEffect(() => {
  //   console.log('parameters updated in ChartWrapper');
  // }, [parameters]);
  //
  // useEffect(() => {
  //   console.log('loading updated in ChartWrapper');
  // }, [loading]);


  return (
    <>
      <Grid style={{
        height: '100%',
      }}
      >
        <Icon
          name="expand arrows alternate"
          onClick={handleToggleModal}
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
      </Grid>
      {/*{showModal && (*/}
      {/*  // <ChartModal open={true} onClose={handleToggleModal}>*/}
      {/*  //   <Chart*/}
      {/*  //     data={{*/}
      {/*  //       x: xData,*/}
      {/*  //       y: yData,*/}
      {/*  //       z: zData,*/}
      {/*  //     }}*/}
      {/*  //     basinLength={L}*/}
      {/*  //     basinWidth={W}*/}
      {/*  //     id="chart2"*/}
      {/*  //     onLoad={onLoad}*/}
      {/*  //   />*/}
      {/*  // </ChartModal>*/}
      {/*)}*/}
    </>
  );
};

export default ChartWrapper;
