import React from 'react';
import {ContentWrapper, Tab, TabPane} from 'common/components';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';
import useIsMobile from '../../../../common/hooks/useIsMobile';
import MfPackageProperties from '../components/Packages/MfPackageProperties';
import DisPackageProperties from '../components/Packages/DisPackageProperties';

const CalculationProfile = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {isMobile} = useIsMobile();

  return (
    <>
      <ContentWrapper style={{marginTop: 20}}>
        <Tab
          variant='secondary'
          title={true}
          defaultActiveIndex={2}
          menu={{fluid: true, vertical: isMobile ? false : true, tabular: true}}
          renderActiveOnly={true}
          panes={[
            {menuItem: 'Pacadges'},
            {
              // isDisabled: !isReadOnly,
              menuItem: 'Modflow Package',
              render: () => <TabPane>
                <MfPackageProperties/>
              </TabPane>,
            },
            {
              menuItem: 'Discretization Package',
              render: () => <TabPane>
                <DisPackageProperties/>
              </TabPane>,
            },
            {
              menuItem: 'Basic Package',
              render: () => <TabPane>
                Basic Package
              </TabPane>,
            },
            {
              menuItem: 'Constant Head Package',
              render: () => <TabPane>
                Constant Head Package
              </TabPane>,
            }, {
              menuItem: 'Flow Packages',
              render: () => <TabPane>
                Flow Packages
              </TabPane>,
            },
            {
              menuItem: 'Output Control',
              render: () => <TabPane>
                Output Control
              </TabPane>,
            },
            {
              menuItem: 'Solver Package',
              render: () => <TabPane>
                Solver Package
              </TabPane>,
            },
          ]}
        />
      </ContentWrapper>
    </>
  );
};


export default CalculationProfile;
