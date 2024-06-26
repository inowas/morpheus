import React, {useEffect, useState} from 'react';
import {ContentWrapper} from 'common/components';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';
import useIsMobile from 'common/hooks/useIsMobile';
import {useCalculation} from '../../application';
import Calculation from '../components/Calculation/Calculation';
import {ICalculation} from '../../types/Calculation.type';
import {useNavigate} from 'common/hooks';

const CalculationContainer = () => {
  const {projectId, property, propertyId: calculationId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {isMobile} = useIsMobile();
  const navigateTo = useNavigate();

  const {startCalculation, fetchCalculation, fetchFile, loading, error} = useCalculation(projectId as string);
  const [calculation, setCalculation] = useState<ICalculation | undefined>(undefined);

  useEffect(() => {
    if ('calculation' === property && calculationId) {
      fetchCalculation(calculationId).then(setCalculation);
      return;
    }

    setCalculation(undefined);

    // eslint-disable-next-line
  }, [calculationId, property]);

  const handleStartCalculation = async () => {
    const newCalculationId = await startCalculation();
    if (newCalculationId) {
      return navigateTo(`/projects/${projectId}/model/calculation/${newCalculationId}`);
    }
  };

  return (
    <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
      <Calculation
        calculation={calculation}
        onFetchFile={(file: string) => fetchFile(calculationId || '', file)}
        onStartCalculation={handleStartCalculation}
        isReadOnly={isReadOnly}
        isMobile={isMobile}
      />
    </ContentWrapper>
  );
};


export default CalculationContainer;
