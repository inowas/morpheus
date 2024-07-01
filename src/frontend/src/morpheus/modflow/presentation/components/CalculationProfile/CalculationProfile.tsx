import React, {useEffect, useMemo, useState} from 'react';
import {Form} from 'semantic-ui-react';
import {ICalculationProfile} from '../../../types/CalculationProfile.type';
import {DropdownInput, StringInput} from './FormFields';
import {Button, SectionTitle, Tab, TabPane} from 'common/components';
import * as PackageSettings from './PackageSettings';
import descriptions from './PackageSettings/PackagePropsDescriptions';

interface IProps {
  calculationProfile: ICalculationProfile;
  onChange: (calculationProfile: ICalculationProfile) => void;
  isReadOnly: boolean;
  isMobile: boolean;
}

const CalculationProfile = ({calculationProfile, onChange, isReadOnly, isMobile}: IProps) => {

  const [profile, setProfile] = useState<ICalculationProfile>(calculationProfile);

  useEffect(() => {
    setProfile(calculationProfile);
  }, [calculationProfile]);

  const calculationOptions = [
    {key: 'mf2005', value: 'mf2005', text: 'MODFLOW-2005'},
  ];

  const profileHasChanged = useMemo(() => JSON.stringify(profile) !== JSON.stringify(calculationProfile), [profile, calculationProfile]);

  return (
    <>
      <SectionTitle
        title={'Calculation Profile'}
        style={{marginBottom: 20}}
      >
        {!isReadOnly && <Button
          disabled={!profileHasChanged}
          primary={true}
          size={'small'}
          onClick={() => onChange(profile)}
        >
          Save
        </Button>}
      </SectionTitle>
      <Form>
        <Form.Group widths='equal' style={{alignItems: 'center'}}>
          <DropdownInput
            description={descriptions.mf.version}
            value={profile.engine_type}
            isReadOnly={isReadOnly}
            onChange={(value: string) => setProfile({...profile, engine_type: value as 'mf2005'})}
            label={'Calculation'}
            options={calculationOptions}
          />
          <StringInput
            description={descriptions.mf.exe_name}
            value={profile.name}
            isReadOnly={isReadOnly}
            onChange={(value: string) => setProfile({...profile, name: value})}
            label={'Name'}
          />
        </Form.Group>
      </Form>
      <Tab
        variant='secondary'
        title={true}
        defaultActiveIndex={7}
        menu={{fluid: true, vertical: !isMobile, tabular: true}}
        renderActiveOnly={true}
        panes={[{
          menuItem: {
            key: 'modflow-package-1',
            content: <span>Modflow Package</span>,
          },
          render: () => null, // No content for the first tab because it's we use it as a Title
        },
        {
          menuItem: 'Modflow Package',
          render: () => <TabPane>
            <PackageSettings.MfPackageSettings
              settings={profile.engine_settings.mf}
              isReadOnly={isReadOnly}
              onChange={(settings) => setProfile({...profile, engine_settings: {...profile.engine_settings, mf: settings}})}
            />
          </TabPane>,
        },
        {
          menuItem: 'Basic Package',
          render: () => <TabPane>
            <PackageSettings.BasPackageSettings
              settings={profile.engine_settings.bas}
              isReadOnly={isReadOnly}
              onChange={(settings) => setProfile({...profile, engine_settings: {...profile.engine_settings, bas: settings}})}
            />
          </TabPane>,
        },
        {
          menuItem: 'Discretization Package',
          render: () => <TabPane>
            <PackageSettings.DisPackageSettings
              settings={profile.engine_settings.dis}
              isReadOnly={isReadOnly}
              onChange={(settings) => setProfile({...profile, engine_settings: {...profile.engine_settings, dis: settings}})}
            />
          </TabPane>,
        },
        {
          menuItem: 'Boundary Packages',
          render: () => <TabPane>
            <PackageSettings.BoundaryPackageSettings
              settings={profile.engine_settings}
              isReadOnly={isReadOnly}
              onChange={(settings) => setProfile({...profile, engine_settings: settings})}
            />
          </TabPane>,
        },
        {
          menuItem: 'Head Observation Package',
          render: () => <TabPane>
            <PackageSettings.HobPackageSettings
              settings={profile.engine_settings.hob}
              onChange={(settings) => setProfile({...profile, engine_settings: {...profile.engine_settings, hob: settings}})}
              isReadOnly={isReadOnly}
            />
          </TabPane>,
        },
        {
          menuItem: 'Flow Package',
          render: () => <TabPane>
            <PackageSettings.FlowPackageSettings
              settings={profile.engine_settings}
              onChange={(settings) => setProfile({...profile, engine_settings: settings})}
              isReadOnly={isReadOnly}
            />
          </TabPane>,
        },
        {
          menuItem: 'Solver Package',
          render: () => <TabPane>
            <PackageSettings.SolverPackageSettings
              settings={profile.engine_settings}
              onChange={(settings) => setProfile({...profile, engine_settings: settings})}
              isReadOnly={isReadOnly}
            />
          </TabPane>,
        },
        {
          menuItem: 'Output Control',
          render: () => <TabPane>
            <PackageSettings.OcPackageSettings
              settings={profile.engine_settings.oc}
              onChange={(settings) => setProfile({...profile, engine_settings: {...profile.engine_settings, oc: settings}})}
              isReadOnly={isReadOnly}
            />
          </TabPane>,
        },
        ]}
      />
    </>
  );
};

export default CalculationProfile;
