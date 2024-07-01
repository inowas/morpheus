import React, {useEffect, useState} from 'react';
import {ContentWrapper} from 'common/components';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useIsMobile from 'common/hooks/useIsMobile';
import {useCalculation} from '../../application';
import Calculation from '../components/Calculation/Calculation';
import {ICalculation} from '../../types/Calculation.type';

const CalculationContainer = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {isMobile} = useIsMobile();

  const {startCalculation, fetchLatestCalculation, fetchFile, loading, error} = useCalculation(projectId as string);
  const [calculation, setCalculation] = useState<ICalculation | undefined>(undefined);

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
        onStartCalculation={handleStartCalculation}
        isReadOnly={isReadOnly}
        isMobile={isMobile}
        isLoading={loading}
      />
    </ContentWrapper>
  );
};


export default CalculationContainer;
