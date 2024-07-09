import React from 'react';
import {ContentWrapper} from 'common/components';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import Calculation from '../components/Calculation/Calculation';
import {useNavigate, useIsMobile} from 'common/hooks';
import useCalculate from '../../application/useCalculate';
import {useModel} from '../../application';

const CalculationContainer = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {isMobile} = useIsMobile();
  const {model} = useModel(projectId as string);

  const {startCalculation, calculation, loading, fetchFileContent} = useCalculate(projectId as string);
  const navigateTo = useNavigate();

  const handleNavigateToResults = () => navigateTo(`/projects/${projectId}/model/flow-results`);

  const handleStartCalculation = async () => {
    await startCalculation(model!.model_id);
  };

  return (
    <ContentWrapper style={{marginTop: 20, overflowX: 'auto'}}>
      <Calculation
        calculation={calculation || undefined}
        onFetchFileContent={fetchFileContent}
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
