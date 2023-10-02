import React, {useEffect, useState} from 'react';
import {useCalculation} from '../../application';
import {useParams} from 'react-router-dom';
import {Modflow3DResults} from '../components';
import ControlsModflow3DResults from '../components/ControlsModflow3DResults';
import {IData, IVisibility} from '../../types';


const CalculationResultsContainer = () => {

  const {calculationId: calculationIdParam} = useParams();
  const {calculation, loading, error, updateCalculationId, getTopElevationUrls, getResultUrls, getColorScaleUrl} = useCalculation(calculationIdParam);
  const [selectedTimeStep, setSelectedTimeStep] = useState<number>(0);
  const [zScaling, setZScaling] = useState<number>(2);

  const [data, setData] = useState<IData[]>([]);
  const [visibility, setVisibility] = useState<IVisibility[]>([]);


  useEffect(() => {
    if (!calculation) {
      return;
    }

    const newData = [];

    if (0 === data.length) {
      newData.push({
        id: 'topElevation',
        type: 'elevation' as 'elevation',
        imgUrl: getTopElevationUrls()!.imgUrl,
        dataUrl: getTopElevationUrls()!.dataUrl,
      });
    }

    calculation.layer_values.forEach((layerValue, layerIdx) => {
      newData.push({
        id: 'head-layer-' + layerIdx,
        type: 'head' as 'head',
        imgUrl: getResultUrls(layerIdx, 'head', selectedTimeStep)!.imgUrl,
        dataUrl: getResultUrls(layerIdx, 'head', selectedTimeStep)!.dataUrl,
      });
    });

    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeStep, calculation?.calculation_id]);

  useEffect(() => {
    if (!calculation) {
      return;
    }

    const newVisibility = [{
      id: 'topElevation',
      name: 'Top elevation',
      isVisible: true,
      opacity: 0.5,
    }];

    calculation.layer_values.forEach((_, layerIdx, layers) => {
      newVisibility.push({
        id: `head-layer-${layerIdx}`,
        name: `Head layer ${layerIdx + 1}`,
        isVisible: layerIdx === layers.length - 1,
        opacity: 0.5,
      });
    });

    setVisibility(newVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculation?.layer_values]);

  useEffect(() => {
    if (undefined === calculationIdParam) {
      return;
    }
    updateCalculationId(calculationIdParam);
    // eslint-disable-next-line
  }, [calculationIdParam]);

  if (loading) {
    return (
      <div>
        <div>Loading</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>Error</div>
        <div>{error.message}</div>
      </div>
    );
  }

  if (null === calculation) {
    return (
      <div>
        <div>Calculation not found</div>
      </div>
    );
  }

  if (0 === data.length) {
    return (
      <div>
        <div>No results</div>
      </div>
    );
  }

  return (
    <div>
      <ControlsModflow3DResults
        colorScaleUrl={getColorScaleUrl('head', selectedTimeStep)!}
        visibilities={visibility}
        onVisibilityChange={setVisibility}
        timeSteps={calculation.times.head.total_times || []}
        selectedTimeStep={selectedTimeStep}
        onSelectedTimeStepChange={setSelectedTimeStep}
        zScaling={zScaling}
        onZScalingChange={setZScaling}
        colorBarUrl={getColorScaleUrl('head', selectedTimeStep) as string}
      />
      <Modflow3DResults
        data={data}
        visibility={visibility}
        zScaling={zScaling}
      />
    </div>
  );
};

export default CalculationResultsContainer;
