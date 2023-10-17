import React, {useState} from 'react';
import {useCSVData, useNavigate, useTranslate} from '../../application';
import {Breadcrumb} from '../../../../components';
import {Container, Grid} from 'semantic-ui-react';
import PivotTableUI, {PivotTableUIProps} from 'react-pivottable/PivotTableUI';
import '../styles/styles.css';

const tool = 'T04';

const T04 = () => {
  const [pivotTableState, setPivotTableState] = useState<PivotTableUIProps | null>(null);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const {data} = useCSVData('/data/T04/database-2018-01-05.csv');

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div className="toolWrapper" data-testid="t04-container">
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <div className="tableWrapper">
        <Grid padded={true}>
          <Grid.Row style={{padding: 0}}>
            <Container fluid={true} className="tablewrap">
              {data && <PivotTableUI
                data={data}
                onChange={(state: PivotTableUIProps) => setPivotTableState(state)}
                {...pivotTableState}
              />}
            </Container>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default T04;