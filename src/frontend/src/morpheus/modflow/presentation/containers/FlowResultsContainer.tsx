import React, {useEffect, useState} from 'react';
import {ContentWrapper, DataGrid, SectionTitle} from 'common/components';
import {useParams} from 'react-router-dom';
import {useCalculation, useCalculationData} from '../../application';
import {ICalculation} from '../../types/Calculation.type';
import {BodyContent, SidebarContent} from '../components';
import {Map} from 'common/components/Map';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';
import {MenuItem, Tab, TabPane} from 'semantic-ui-react';
import CrossSectionParameterSelector from '../components/Results/CrossSectionParameterSelector';
import CanvasDataLayer from '../../../../common/components/Map/CanvasDataLayer';
import {IFlowData} from '../../application/useCalculationData';
import {useColorMap} from '../../../../common/hooks';
import ContoursDataLayer from '../../../../common/components/Map/ContoursDataLayer';
import useLayers from '../../application/useLayers';

const FlowResultsContainer = () => {
  const {projectId} = useParams();
  const {layers} = useLayers(projectId as string);
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);

  const {fetchLatestCalculation, loading: loadingCalculation, error} = useCalculation(projectId as string);
  const {fetchFlowResult, loading: loadingData} = useCalculationData(projectId as string);

  const [calculation, setCalculation] = useState<ICalculation | null>(null);
  const [data, setData] = useState<IFlowData | null>(null);
  const [showContours, setShowContours] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.8);

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
            data={data.data.values}
            rotation={data.data.rotation}
            outline={data.data.outline}
            getRgbColor={(value: number) => getRgbColor(value, data?.data.min_value, data?.data.max_value)}
          />}

          {data && !showContours && <CanvasDataLayer
            title={'Head [m]'}
            data={data.data.values}
            minVal={data.data.min_value}
            maxVal={data.data.max_value}
            outline={data.data.outline}
            getRgbColor={(value: number) => getRgbColor(value, data?.data.min_value, data?.data.max_value)}
            rotation={data.data.rotation}
            options={{opacity: opacity}}
          />}
        </Map>
      </BodyContent>
    </>
  )
  ;
}
;


export default FlowResultsContainer;
