import React, {useEffect, useState} from 'react';
import {ContentWrapper} from 'common/components';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import {useCalculation} from '../../application';
import Calculation from '../components/Calculation/Calculation';
import {ICalculation} from '../../types/Calculation.type';
import {useNavigate, useIsMobile} from 'common/hooks';

const CalculationContainer = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {isMobile} = useIsMobile();

  const {startCalculation, fetchLatestCalculation, fetchFile, loading, error} = useCalculation(projectId as string);
  const [calculation, setCalculation] = useState<ICalculation | undefined>(undefined);
  const navigateTo = useNavigate();

  const handleFetchLatestCalculation = async () => {
    const latestCalculation = await fetchLatestCalculation();
    if (!latestCalculation) {
      return setCalculation(undefined);
    }

    if (['created', 'queued', 'preprocessing', 'preprocessed', 'calculating'].includes(latestCalculation.state)) {
      setTimeout(() => handleFetchLatestCalculation(), 1000);
    }

    setCalculation(latestCalculation);
  };

  const handleNavigateToResults = () => navigateTo(`/projects/${projectId}/model/flow-results`);

  useEffect(() => {
    handleFetchLatestCalculation();
    // eslint-disable-next-line
  }, []);

  const handleStartCalculation = async () => {
    await startCalculation();
    await handleFetchLatestCalculation();
  };

  return (
    <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
      <Calculation
        calculation={calculation}
        onFetchFile={(file: string) => fetchFile(calculation?.calculation_id || '', file)}
        onNavigateToResults={handleNavigateToResults}
        onStartCalculation={handleStartCalculation}
        isReadOnly={isReadOnly}
        isMobile={isMobile}
        isLoading={loading}
      />
    </ContentWrapper>
  );
};


export default CalculationContainer;
