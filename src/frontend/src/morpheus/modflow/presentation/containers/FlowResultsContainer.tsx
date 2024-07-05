import React, {useEffect, useState} from 'react';
import {ContentWrapper, DataGrid, SectionTitle} from 'common/components';
import {useParams} from 'react-router-dom';
import {useCalculation, useCalculationData, useTimeDiscretization} from '../../application';
import {ICalculation} from '../../types/Calculation.type';
import {BodyContent, SidebarContent} from '../components';
import {Map} from 'common/components/Map';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import {MenuItem, Tab, TabPane} from 'semantic-ui-react';
import CrossSectionParameterSelector from '../components/Results/CrossSectionParameterSelector';
import {IFlowData} from '../../application/useCalculationData';
import {useColorMap} from 'common/hooks';
import ContoursDataLayer from 'common/components/Map/DataLayers/ContoursDataLayer';

import useLayers from '../../application/useLayers';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';
import CanvasDataLayer from '../../../../common/components/Map/DataLayers/CanvasDataLayer';
import SelectedRowAndColLayer from '../../../../common/components/Map/DataLayers/SelectedRowAndColLayer';
import {ISelection} from '../../../../common/components/Map/DataLayers/types';
import HoverDataLayer from '../../../../common/components/Map/DataLayers/HoverDataLayer';

interface ISelectedRowAndColumn {
  col: number;
  row: number;
}

const FlowResultsContainer = () => {
  const {projectId} = useParams();
  const {layers} = useLayers(projectId as string);
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {timeDiscretization} = useTimeDiscretization(projectId as string);

  const {fetchLatestCalculation, loading: loadingCalculation, error} = useCalculation(projectId as string);
  const {fetchFlowResult, loading: loadingData} = useCalculationData(projectId as string);

  const [calculation, setCalculation] = useState<ICalculation | null>(null);
  const [data, setData] = useState<IFlowData | null>(null);
  const [showContours, setShowContours] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.8);
  const [useGlobalMinMax, setUseGlobalMinMax] = useState<boolean>(true);

  const [selectedRowAndColumn, setSelectedRowAndColumn] = useState<ISelectedRowAndColumn | null>(null);

  const {getRgbColor} = useColorMap('jet_r');

  const handleFetchLatestCalculation = async () => {
    const latestCalculation = await fetchLatestCalculation();
    if (!latestCalculation) {
      return setCalculation(null);
    }

    if (!['completed', 'failed', 'canceled'].includes(latestCalculation.state)) {
      setTimeout(() => handleFetchLatestCalculation(), 1000);
    }

    setCalculation(latestCalculation);
  };

  useEffect(() => {
    handleFetchLatestCalculation();
    // eslint-disable-next-line
  }, []);

  if (loadingCalculation) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        <p>Loading calculation results...</p>
      </ContentWrapper>
    );
  }

  if (!calculation?.result) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        <p>No calculation results available.</p>
      </ContentWrapper>
    );
  }

  if (!spatialDiscretization || !timeDiscretization) {
    return (
      <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
        <p>No spatial or time discretization available.</p>
      </ContentWrapper>
    );
  }

  const handleFetchParameters = async (layerIdx: number, timeStepIdx: number) => {
    if (!calculation?.result) {
      return;
    }

    const result = await fetchFlowResult(calculation.calculation_id, 'head', layerIdx, timeStepIdx);
    if (!result) {
      return;
    }
    setData(result);
  };

  const minVal = useGlobalMinMax ? calculation.result.flow_head_results.min_value || 0 : data?.data.min_value || 0;
  const maxVal = useGlobalMinMax ? calculation.result.flow_head_results.max_value || 1 : data?.data.max_value || 1;

  return (
    <>
      <SidebarContent maxWidth={500}>
        <DataGrid>
          <SectionTitle title={'Flow results'}/>
          <Tab
            variant='primary'
            menu={{secondary: true, pointing: true}}
            panes={[
              {
                menuItem: <MenuItem key={'head'}>Head</MenuItem>,
                render: () =>
                  <TabPane attached={false}>
                    <>
                      {calculation?.result?.flow_head_results &&
                        <CrossSectionParameterSelector
                          layerNames={layers?.map(l => l.name) || []}
                          results={calculation.result.flow_head_results}
                          onFetchFlowResult={handleFetchParameters}
                          isLoading={false}
                          timeDiscretization={timeDiscretization}
                        />}
                    </>
                  </TabPane>,
              },
              {
                menuItem: 'Time series',
                render: () =>
                  <TabPane attached={false}>
                    <p>time series</p>
                  </TabPane>,
              },
              {
                menuItem: 'Budget',
                render: () =>
                  <TabPane attached={false}>
                    <p>budget</p>
                  </TabPane>,
              },
            ]}
          />
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map>
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization?.geometry} editModelGeometry={false}/>

          {data && showContours && <ContoursDataLayer
            title={'Head [m]'}
            data={data.data.values}
            rotation={data.data.rotation}
            outline={data.data.outline}
            getRgbColor={(value: number) => getRgbColor(value, minVal, maxVal)}
            minVal={minVal}
            maxVal={maxVal}
            onClick={(selection: ISelection | null) => setSelectedRowAndColumn(selection ? {col: selection.col, row: selection.row} : null)}
          />}

          {data && !showContours && <CanvasDataLayer
            title={'Head [m]'}
            data={data.data.values}
            minVal={minVal}
            maxVal={maxVal}
            outline={data.data.outline}
            getRgbColor={getRgbColor}
            rotation={data.data.rotation}
            options={{opacity: opacity}}
            onClick={(selection: ISelection | null) => setSelectedRowAndColumn(selection ? {col: selection.col, row: selection.row} : null)}
          />}
        </Map>
      </BodyContent>
    </>
  );
};


export default FlowResultsContainer;
