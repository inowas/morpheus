import React, {useEffect, useState} from 'react';
import {useCalculation} from '../../application';
import {useParams} from 'react-router-dom';
import {Modflow3DResults} from '../components';
import ControlsModflow3DResults from '../components/ControlsModflow3DResults';


const CalculationResultsContainer = () => {

  const {calculationId: calculationIdParam} = useParams();
  const {calculation, loading, error, updateCalculationId, getTopElevationUrls, getResultUrls} = useCalculation(calculationIdParam);
  const [topElevationVisible, setTopElevationVisible] = useState<boolean>(true);
  const [topElevationOpacity, setTopElevationOpacity] = useState<number>(1);
  const [selectedTimeStep, setSelectedTimeStep] = useState<number>(0);

  useEffect(() => {
    if (undefined === calculationIdParam) {
      return;
    }
    updateCalculationId(calculationIdParam);
    // eslint-disable-next-line
  }, [calculationIdParam]);

  useEffect(() => {
    console.log(calculation);
  }, [calculation]);

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

  return (
    <div>
      <ControlsModflow3DResults
        topElevationVisible={topElevationVisible}
        onTopElevationVisibleChange={setTopElevationVisible}
        topElevationOpacity={topElevationOpacity}
        onTopElevationOpacityChange={setTopElevationOpacity}
      />
      <Modflow3DResults
        topElevation={getTopElevationUrls()!}
        heads={calculation.layer_values.map(
          (layer, layerId) => getResultUrls(layerId, 'head', selectedTimeStep)!,
        )}
        topElevationVisible={topElevationVisible}
        topElevationOpacity={topElevationOpacity}
      />
    </div>
  );
};

export default CalculationResultsContainer;
