import React, {useEffect, useMemo, useState} from 'react';
import {ContentWrapper, SectionTitle, Tab, TabPane} from 'common/components';
import {useParams} from 'react-router-dom';
import {useColorMap, useDateTimeFormat, useIsMobile} from 'common/hooks';
import CalibrationStatistics from '../components/CalibrationStatistics/CalibrationStatistics';
import useCalculateStatistics from '../../application/useCalculateStatistics';
import useObservations from '../../application/useObservations';
import {Form, Header} from 'semantic-ui-react';
import {ObservedVsCalculatedHeads, RankedResidualsAgainstNormalProbability, WeightedResidualsVsSimulatedHeads} from '../components/CalibrationStatistics/Charts';
import useCalculationResults from '../../application/useCalculationResults';
import {IObservationResult} from '../../types/HeadObservations.type';
import {useTimeDiscretization} from '../../application';
import CombinedTimeSeriesChart, {ISimulatedObservedItem} from '../components/CalibrationStatistics/Charts/CombinedTimeSeriesChart';

interface ITimeSeriesItem {
  key: number;
  name: string;
  layer: number;
  row: number;
  col: number;
  color: string;
  data: { date_time: string, value: number }[];
}

const CalibrationStatisticsContainer = () => {
  const {projectId, propertyId: calculationId} = useParams();
  const {timeDiscretization} = useTimeDiscretization(projectId!);

  const {colors} = useColorMap('jet_r');
  const {observations, loading} = useObservations(projectId as string);
  const {fetchObservationResults, calculation, fetchTimeSeriesResult} = useCalculationResults(projectId as string, calculationId);
  const {calculateStatistics} = useCalculateStatistics();

  const {isMobile} = useIsMobile();

  const [exclude, setExclude] = useState<string[]>([]);
  const [observationResults, setObservationResults] = useState<IObservationResult[]>([]);

  const [timeSeries, setTimeSeries] = useState<ITimeSeriesItem[]>([]);
  const [simulatedObserved, setSimulatedObserved] = useState<ISimulatedObservedItem[]>([]);

  const {formatISODate, addDays} = useDateTimeFormat();

  useEffect(() => {
    if (!calculation) {
      return;
    }

    const fetch = async () => {
      const data = await fetchObservationResults('head');
      if (!data) {
        return;
      }

      setObservationResults(data);
    };

    fetch();
    // eslint-disable-next-line
  }, [calculation]);

  useEffect(() => {

    if (0 === observations.length || 0 === observationResults.length || !timeDiscretization) {
      return;
    }

    const fetch = async () => {

      const newSimulatedObserved: ISimulatedObservedItem[] = [];
      const newTimeSeries: ITimeSeriesItem[] = [];

      // load full time series data for each observation
      for (const [idx, observationResult] of observationResults.entries()) {

        newSimulatedObserved.push({
          key: idx,
          name: `${observationResult.observation_name}`,
          color: colors.normal[idx],
          date_time: observationResult.date_time,
          simulated: observationResult.simulated,
          observed: observationResult.observed,
        });

        const existingTimeSeries = newTimeSeries.find((ts) =>
          ts.name === `${observationResult.observation_name}`
          && ts.layer === observationResult.layer
          && ts.row === observationResult.row
          && ts.col === observationResult.col,
        );

        if (existingTimeSeries) {
          newTimeSeries.push(existingTimeSeries);
          continue;
        }

        const name = `${observationResult.observation_name}`;
        const layer = observationResult.layer;
        const row = observationResult.row;
        const col = observationResult.col;
        const data = await fetchTimeSeriesResult('head', layer, row, col);

        if (!data) {
          continue;
        }

        const newTimeSeriesItem: ITimeSeriesItem = {
          key: idx,
          name,
          layer, row, col,
          color: colors.normal[idx],
          data: data.data.map(([totim, value]) => ({date_time: addDays(timeDiscretization.start_date_time, totim), value})),
        };

        newTimeSeries.push(newTimeSeriesItem);
      }

      setSimulatedObserved(newSimulatedObserved);
      setTimeSeries(newTimeSeries);
    };

    fetch();
    // eslint-disable-next-line
  }, [observationResults, timeDiscretization, observations]);

  const statistics = useMemo(() => {
    if (observationResults.length) {
      return calculateStatistics(observationResults);
    }
    // eslint-disable-next-line
  }, [observationResults, exclude]);

  if (0 === observationResults.length && 0 === exclude.length) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        {loading ? <p>Loading...</p> : <p>No data available</p>}
      </ContentWrapper>
    );
  }

  const renderExcluded = () => (
    <div style={{float: 'right'}}>
      <Form.Select
        width={4}
        label='Exclude Observations'
        closeOnChange={true}
        onChange={(_, data) => setExclude(data.value as string[])}
        options={observations.map((w) => ({key: w.name, value: w.name, text: w.name}))}
        multiple={true}
        search={true}
        selection={true}
        value={exclude}
      />
    </div>
  );

  const panes = [
    {
      menuItem: 'Observations',
    },
    {
      menuItem: 'Statistics',
      render: () => (
        <TabPane>
          {renderExcluded()}
          <Header>Statistics</Header>
          {statistics && <CalibrationStatistics statistics={statistics}/>}
        </TabPane>
      ),
    },
    {
      menuItem: 'Observed vs Calculated Heads',
      render: () => (
        <TabPane>
          {renderExcluded()}
          <Header>Observed vs Calculated Heads</Header>
          {statistics && <ObservedVsCalculatedHeads statistics={statistics} colors={colors.normal}/>}
        </TabPane>
      ),
    },
    {
      menuItem: 'Weighted residuals vs. simulated heads',
      render: () => (
        <TabPane>
          {renderExcluded()}
          <Header>Weighted residuals vs. simulated heads</Header>
          {statistics && <WeightedResidualsVsSimulatedHeads statistics={statistics} colors={colors.normal}/>}
        </TabPane>
      ),
    },
    {
      menuItem: 'Ranked residuals against normal probability',
      render: () => (
        <TabPane>
          {renderExcluded()}
          <Header>Ranked residuals against normal probability</Header>
          {statistics && <RankedResidualsAgainstNormalProbability statistics={statistics} colors={colors.normal}/>}
        </TabPane>
      ),
    },
    {
      menuItem: 'Time series',
      render: () => (
        <TabPane>
          {renderExcluded()}
          <Header>Time series</Header>
          <CombinedTimeSeriesChart
            simulatedObserved={simulatedObserved.filter((ts) => !exclude.includes(ts.name))}
            timeSeries={timeSeries.filter((ts) => !exclude.includes(ts.name))}
            formatDateTime={formatISODate}
          />
        </TabPane>
      ),
    },
  ];

  return (
    <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
      <SectionTitle title={'Calibration'} style={{marginBottom: 20}}/>
      <Tab
        variant='secondary'
        title={true}
        defaultActiveIndex={1}
        menu={{fluid: true, vertical: !isMobile, tabular: true}}
        renderActiveOnly={true}
        panes={panes}
      />
    </ContentWrapper>
  );
};


export default CalibrationStatisticsContainer;
