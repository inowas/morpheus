import React, {useEffect, useMemo, useState} from 'react';
import {ContentWrapper, DataGrid, SectionTitle, Segment, Widget} from 'common/components';
import {useParams} from 'react-router-dom';
import {useCalculationResults, useTimeDiscretization} from '../../application';
import {BodyContent, SidebarContent} from '../components';
import {Map} from 'common/components/Map';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import {Icon, Label, Tab, TabPane} from 'semantic-ui-react';
import {IBudgetData, ILayerData} from '../../application/useCalculationResults';
import {useColorMap, useDateTimeFormat} from 'common/hooks';
import ContoursDataLayer from 'common/components/Map/DataLayers/ContoursDataLayer';

import useLayers from '../../application/useLayers';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';
import CanvasDataLayer from 'common/components/Map/DataLayers/CanvasDataLayer';
import ResultsSelector from '../components/Results/CrossSectionParameterSelector';
import CrossSectionChart from '../components/Results/CrossSectionChart';
import {IAvailableResults} from '../../types/Calculation.type';
import BudgetChart from '../components/Results/BudgetSectionChart';
import HoverGridLayer, {IDataPoint} from 'common/components/Map/DataLayers/HoverDataLayer';
import {ISelection} from 'common/components/Map/DataLayers/types';
import TimeSeriesChart from '../components/Results/TimeSeriesChart';
import LabelledPointsLayer from 'common/components/Map/DataLayers/LabelledPointsLayer';
import {Point} from 'geojson';

interface ISelectedRowAndColumn {
  col: number;
  row: number;
}

interface ITimeSeriesItem {
  id: number;
  name: string;
  layer: number;
  row: number;
  col: number;
  point: Point;
  color: string;
  data: { date_time: string, value: number }[];
}

type IResultType = 'head' | 'drawdown' | 'concentration';

const FlowResultsContainer = () => {
  const {projectId, propertyId: calculationId} = useParams();

  const {layers} = useLayers(projectId as string);
  const {spatialDiscretization} = useSpatialDiscretization(projectId!);
  const {timeDiscretization, loading} = useTimeDiscretization(projectId!);
  const {calculation, fetchLayerResult, fetchTimeSeriesResult, fetchBudgetResult} = useCalculationResults(projectId!, calculationId);

  const {getRgbColor, colors} = useColorMap('jet_r');
  const {formatISODate, addDays} = useDateTimeFormat();

  const [showContours, setShowContours] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.8);
  const [useGlobalMinMax, setUseGlobalMinMax] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>('cross-section');

  const [activeCalculationResult, setActiveCalculationResult] = useState<IAvailableResults | null>(null);
  const [selectedResultType, setSelectedResultType] = useState<'head' | 'drawdown' | 'concentration'>('head');
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const [selectedTimeStepIdx, setSelectedTimeStepIdx] = useState<number>(0);
  const [minVal, setMinVal] = useState<number>(0);
  const [maxVal, setMaxVal] = useState<number>(1);

  const [layerData, setLayerData] = useState<ILayerData | undefined>(undefined);
  const [selectedDataRowAndColumn, setSelectedDataRowAndColumn] = useState<ISelectedRowAndColumn | null>(null);

  const [timeSeries, setTimeSeries] = useState<ITimeSeriesItem[]>([]);

  const [showIncrementalBudget, setShowIncrementalBudget] = useState<boolean>(false);
  const [budgetData, setBudgetData] = useState<IBudgetData | null>(null);

  useEffect(() => {
    if (!calculation || !calculation.result) {
      return;
    }

    if ('head' === selectedResultType && calculation.result.flow_head_results) {
      setActiveCalculationResult(calculation.result.flow_head_results);
    }

    if ('drawdown' === selectedResultType && calculation.result.flow_drawdown_results) {
      setActiveCalculationResult(calculation.result.flow_drawdown_results);
    }

    if ('concentration' === selectedResultType && calculation.result.transport_concentration_results) {
      setActiveCalculationResult(calculation.result.transport_concentration_results);
    }

    // eslint-disable-next-line
  }, [calculation]);

  useEffect(() => {
    if (!activeCalculationResult) {
      return;
    }

    setSelectedLayer(activeCalculationResult.number_of_layers - 1);
    setSelectedTimeStepIdx(activeCalculationResult.times.length - 1);
    setMinVal(useGlobalMinMax ? activeCalculationResult.min_value || 0 : layerData?.data.min_value || 0);
    setMaxVal(useGlobalMinMax ? activeCalculationResult.max_value || 1 : layerData?.data.max_value || 1);

    // eslint-disable-next-line
  }, [activeCalculationResult]);

  const fetchData = () => {
    if (!calculation) {
      return null;
    }

    fetchLayerResult(selectedResultType, selectedLayer, selectedTimeStepIdx).then(setLayerData);

    if ('budget' === activeTab) {
      const budgetType = ['head', 'drawdown'].includes(selectedResultType) ? 'flow' : 'transport';
      fetchBudgetResult(budgetType, selectedTimeStepIdx, showIncrementalBudget)
        .then((result) => {
          if (result) {
            setBudgetData(result);
          }
        });
    }
  };

  useEffect(() => {
    if (!calculation?.result) {
      return;
    }

    fetchData();
  }, [calculation, selectedResultType, selectedLayer, selectedTimeStepIdx, activeTab, showIncrementalBudget]);

  const availableResultTypes = useMemo(() => {
    const types = [];
    if (calculation?.result?.flow_head_results) {
      types.push('head');
    }
    if (calculation?.result?.flow_drawdown_results) {
      types.push('drawdown');
    }
    if (calculation?.result?.transport_concentration_results) {
      types.push('concentration');
    }
    return types as IResultType[];
  }, [calculation]);

  if (loading) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        <p>Loading calculation results...</p>
      </ContentWrapper>
    );
  }

  if (!activeCalculationResult || !activeCalculationResult.times.length) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        <p>No calculation results available for result type {selectedResultType}</p>
      </ContentWrapper>
    );
  }

  if (!layers || !spatialDiscretization || !timeDiscretization) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        <p>Could not load model data</p>
      </ContentWrapper>
    );
  }

  const handleAddTimeSeriesItem = async (dataPoint: IDataPoint | null) => {
    if (!dataPoint) {
      return;
    }
    const {row, col, point} = dataPoint;
    const data = await fetchTimeSeriesResult(selectedResultType, selectedLayer, row, col);
    if (!data) {
      return;
    }

    if (timeSeries.find((ts) => ts.row === row && ts.col === col && ts.layer === selectedLayer)) {
      return;
    }

    const lastId = timeSeries.length ? timeSeries[timeSeries.length - 1].id : 0;
    const id = lastId + 1;
    const name = `TS-${id}`;

    setTimeSeries([...timeSeries, {
      id, name, layer: selectedLayer,
      color: colors.normal[id % colors.normal.length],
      row, col, point,
      data: data.data.map(([totim, value]) => ({date_time: addDays(timeDiscretization.start_date_time, totim), value})),
    }]);
  };

  const renderLayerDataMapContent = () => {
    if (!layerData) {
      return null;
    }

    const showSelectedRowAndColumn = 'cross-section' === activeTab;

    if (showContours) {
      return <ContoursDataLayer
        title={'Head [m]'}
        data={layerData.data.values}
        rotation={layerData.data.rotation}
        outline={layerData.data.outline}
        getRgbColor={(value: number) => getRgbColor(value, minVal, maxVal)}
        minVal={minVal}
        maxVal={maxVal}
        onClick={(selection) => setSelectedDataRowAndColumn(selection ? {col: selection.col, row: selection.row} : null)}
        selectRowsAndCols={showSelectedRowAndColumn}
      />;
    }

    if (!showContours) {
      return <CanvasDataLayer
        title={'Head [m]'}
        data={layerData.data.values}
        minValue={minVal}
        maxValue={maxVal}
        outline={layerData.data.outline}
        getRgbColor={getRgbColor}
        rotation={layerData.data.rotation}
        options={{opacity: opacity}}
        onClick={(selection: ISelection | null) => setSelectedDataRowAndColumn(selection ? {col: selection.col, row: selection.row} : null)}
        selectRowsAndCols={showSelectedRowAndColumn}
      />;
    }
  };

  const renderTimeSeriesMapContent = () => {
    if ('time-series' !== activeTab) {
      return null;
    }

    return (
      <>
        <HoverGridLayer
          nCols={spatialDiscretization.grid.n_cols}
          nRows={spatialDiscretization.grid.n_rows}
          colWidths={spatialDiscretization.grid.col_widths}
          rowHeights={spatialDiscretization.grid.row_heights}
          rotation={spatialDiscretization.grid.rotation}
          outline={spatialDiscretization.grid.outline}
          onClick={handleAddTimeSeriesItem}
        />

        <LabelledPointsLayer
          points={timeSeries.map((ts) => ({
            key: ts.id,
            point: ts.point,
            label: ts.name,
            color: ts.color,
          }))}
          onClick={(point) => setTimeSeries(timeSeries.filter((ts) => ts.id !== point.key))}
        />
      </>
    );
  };

  return (
    <>
      <SidebarContent maxWidth={'33%'}>
        <DataGrid>
          <SectionTitle title={'Flow results'}/>
          <Widget>
            <ResultsSelector
              availableLayers={layers.map(l => l.name)}
              selectedLayer={selectedLayer}
              onChangeSelectedLayer={setSelectedLayer}
              availableResultTypes={availableResultTypes}
              selectedResultType={selectedResultType}
              onChangeResultType={setSelectedResultType}
              availableTotalTimes={activeCalculationResult.times}
              selectedTimeIdx={selectedTimeStepIdx}
              onChangeTimeIdx={setSelectedTimeStepIdx}
              isLoading={loading}
              formatTotalTime={(totalTime: number) => formatISODate(addDays(timeDiscretization.start_date_time, totalTime))}
            />
          </Widget>
          <Tab
            variant='primary'
            menu={{secondary: true, pointing: true}}
            panes={[
              {
                menuItem: {
                  key: 'cross-section',
                  content: <span>Cross sections</span>,
                  onClick: () => setActiveTab('cross-section'),
                },
                render: () =>
                  <TabPane attached={false}>
                    {!(selectedDataRowAndColumn && layerData) && <p>Click on map to show cross section</p>}
                    {selectedDataRowAndColumn && layerData && <CrossSectionChart data={layerData.data.values} selectedRowAndColumn={selectedDataRowAndColumn}/>}
                  </TabPane>,
              },
              {
                menuItem: {
                  key: 'time-series',
                  content: <span>Time series</span>,
                  onClick: () => setActiveTab('time-series'),
                },
                render: () =>
                  <TabPane attached={false}>
                    <>
                      {0 === timeSeries.length && <p>Click on map to add time series</p>}
                      {timeSeries.map((ts) => (
                        <Label
                          key={ts.id}
                          as='a'
                          style={{margin: '0 5px', backgroundColor: ts.color, color: 'white'}}
                          onClick={() => setTimeSeries(timeSeries.filter((item) => item.id !== ts.id))}
                        >
                          {ts.name}
                          <Icon name='delete'/>
                        </Label>
                      ))}
                      <TimeSeriesChart
                        timeSeries={timeSeries.map((ts) => ({
                          key: ts.id,
                          name: ts.name,
                          color: ts.color,
                          data: ts.data,
                        }))}
                        formatDateTime={formatISODate}
                        selectedTimeStepIdx={selectedTimeStepIdx}
                      />
                    </>
                  </TabPane>,
              },
              {
                menuItem: {
                  key: 'budget',
                  content: <span>Budget</span>,
                  onClick: () => setActiveTab('budget'),
                },
                render: () =>
                  <TabPane attached={false}>
                    {budgetData && <BudgetChart
                      data={budgetData!}
                      isIncremental={showIncrementalBudget}
                      onChangeIsIncremental={setShowIncrementalBudget}
                      colors={colors.normal}
                    />}
                  </TabPane>,
              },
            ]}
          />
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map>
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization?.geometry} editModelGeometry={false}/>
          {renderLayerDataMapContent()}
          {renderTimeSeriesMapContent()}
        </Map>
      </BodyContent>
    </>
  );
};


export default FlowResultsContainer;
