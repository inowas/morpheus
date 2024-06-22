import React from 'react';
import {ContentWrapper} from 'common/components';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';
import useIsMobile from 'common/hooks/useIsMobile';
import useCalculationProfile from '../../application/useCalculationProfile';
import CalculationProfile from '../components/CalculationProfile/CalculationProfile';

const CalculationProfileContainer = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {isMobile} = useIsMobile();

  const {calculationProfile, updateCalculationProfile} = useCalculationProfile(projectId as string);

  if (!calculationProfile) {
    return null;
  }

  return (
    <ContentWrapper style={{marginTop: 20}}>
      <CalculationProfile
        calculationProfile={calculationProfile}
        onChange={updateCalculationProfile}
        isReadOnly={isReadOnly}
        isMobile={isMobile}
      />
    </ContentWrapper>
  );
};


export default CalculationProfileContainer;
