import React from 'react';
import {Button} from 'semantic-ui-react';
import {SectionTitle, Tab, TabPane} from 'common/components';
import {ICalculation} from '../../../types/Calculation.type';
import CalculationFiles from './CalculationFiles';

interface IProps {
  calculation?: ICalculation;
  isMobile: boolean;
  isReadOnly: boolean;
  onStartCalculation: () => void;
  onFetchFile: (file: string) => Promise<string | undefined>;
}

const Calculation = ({calculation, isMobile, isReadOnly, onStartCalculation, onFetchFile}: IProps) => (
  <>
    <SectionTitle title={'Calculation'} style={{marginBottom: 20}}/>
    <Tab
      variant='secondary'
      title={true}
      defaultActiveIndex={1}
      menu={{fluid: true, vertical: !isMobile, tabular: true}}
      renderActiveOnly={true}
      panes={[
        {
          menuItem: {
            key: 'calculation',
            content: <span>Modflow Calculation</span>,
          },
        },
        {
          menuItem: 'Calculation Status',
          render: () => <TabPane>
            <h1>Calculation Status</h1>
            {calculation ? <p>{calculation.state}</p> : isReadOnly ? <p>Waiting for Start Calculation</p> : <Button onClick={onStartCalculation}>Start Calculation</Button>}
          </TabPane>,
        },
        {
          menuItem: 'Model Check',
          render: () => <TabPane>
            <h1>Model Check</h1>
            {calculation?.check_model_log ? <pre>{calculation.check_model_log.join('\n')}</pre> : null}
          </TabPane>,
        },
        {
          menuItem: 'Calculation Log',
          render: () => <TabPane>
            <h1>Calculation Log</h1>
            {calculation?.calculation_log ? <pre>{calculation.calculation_log.join('\n')}</pre> : null}
          </TabPane>,
        },
        {
          menuItem: 'Calculation Packages',
          render: () => <TabPane>
            <h1>Calculation Packages</h1>
            {calculation?.result ? <pre>{calculation.result.packages.join('\n')}</pre> : null}
          </TabPane>,
        },
        {
          menuItem: 'Calculation Files',
          render: () => <TabPane>
            {calculation?.result && <CalculationFiles files={calculation?.result?.files} fetchFile={onFetchFile}/>}
          </TabPane>,
        },
      ]}
    />
  </>
);

export default Calculation;
