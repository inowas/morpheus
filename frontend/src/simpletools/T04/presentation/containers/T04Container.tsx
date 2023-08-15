import React, {useState} from 'react';
import {Breadcrumb} from '../../../../components';
import {useNavigate} from '../../../common/hooks';
import {useTranslate} from '../../../T04/application';
import '../styles/styles.css';
import {Container, Grid} from 'semantic-ui-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PivotTableUI from 'react-pivottable/PivotTableUI';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import csvFile from '../data/database-2018-01-05.csv';

const tool = 'T04';

const T04 = () => {
  const [data] = useState<object>(csvFile);
  const [s, setS] = useState<any>(null);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const title = `${tool}: ${translate(`${tool}_title`)}`;

  const onChange = (sChange: any) => {
    setS(sChange);
  };

  return (
    <div
      className="toolWrapper"
    >
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <div className="mainWrapper">
        <Grid padded={true}>
          <Grid.Row style={{padding: 0}}>
            <Container fluid={true} className="tablewrap">
              {data && <PivotTableUI
                data={data} onChange={onChange}
                {...s}
              />}
            </Container>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default T04;
