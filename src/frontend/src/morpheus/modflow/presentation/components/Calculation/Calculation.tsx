import React from 'react';
import {Button} from 'semantic-ui-react';
import {SectionTitle, Tab, TabPane} from 'common/components';
import {ICalculation} from '../../../types/Calculation.type';
import CalculationFiles from './CalculationFiles';
import CalculationState from './CalculationState';
import CalculationLog from './CalculationLog';
import ModelCheckLog from './ModelCheckLog';
import CalculationPackages from './CalculationPackages';

interface IProps {
  calculation?: ICalculation;
  isMobile: boolean;
  isReadOnly: boolean;
  onStartCalculation: () => void;
  onFetchFile: (file: string) => Promise<string | undefined>;
  isLoading: boolean;
}

const Calculation = ({calculation, isMobile, isReadOnly, onStartCalculation, onFetchFile, isLoading}: IProps) => {


  const getPanes = () => {
    const defaultPanes = [
      {
        menuItem: {
          key: 'calculation',
          content: <span>Modflow Calculation</span>,
        },
      },
      {
        menuItem: 'Calculation Status',
        render: () => <TabPane>
          <CalculationState
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            calculation={calculation}
            onStartCalculation={onStartCalculation}
          />
        </TabPane>,
      }];
    if (!calculation) {
      return defaultPanes;
    }

    return [...defaultPanes, ...[
      {
        menuItem: 'Model Check',
        render: () => <TabPane>
          <ModelCheckLog model_check_log={calculation.check_model_log}/>
        </TabPane>,
      },
      {
        menuItem: 'Calculation Log',
        render: () => <TabPane>
          <CalculationLog calculation_log={calculation.calculation_log}/>
        </TabPane>,
      },
      {
        menuItem: 'Calculation Packages',
        render: () => <TabPane>
          <h1>Calculation Packages</h1>
          {calculation?.result ? <CalculationPackages packages={calculation.result.packages}/> : null}
        </TabPane>,
      },
      {
        menuItem: 'Calculation Files',
        render: () => <TabPane>
          {calculation?.result && <CalculationFiles files={calculation?.result?.files} fetchFile={onFetchFile}/>}
        </TabPane>,
      },
    ]];
  };

  return (
    <>
      <SectionTitle title={'Calculation'} style={{marginBottom: 20}}/>
      <Tab
        variant='secondary'
        title={true}
        defaultActiveIndex={1}
        menu={{fluid: true, vertical: !isMobile, tabular: true}}
        renderActiveOnly={true}
        panes={getPanes()}
      />
    </>
  );
};

export default Calculation;
