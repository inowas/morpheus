import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {Breadcrumb} from '../../../../components';
import {useNavigate} from '../../../common/hooks';
import {useTranslate} from '../../application';
import '../styles/styles.css';
import {Container, Grid} from 'semantic-ui-react';
import PivotTableUI, {PivotTableUIProps} from 'react-pivottable/PivotTableUI';

const tool = 'T04';

const T04 = () => {
  const [data, setData] = useState<[] | null>(null);
  const [pivotTableState, setPivotTableState] = useState<PivotTableUIProps | null>(null);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const title = `${tool}: ${translate(`${tool}_title`)}`;

  const fetchCsv = async () => {
    const response = await fetch('/data/T04/database-2018-01-05.csv');
    if (!response.ok || null === response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(result.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await fetchCsv();
        Papa.parse(csvData, {
          delimiter: ',',
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
          complete: (parsedObject: any): void => {
            setData(parsedObject.data as []);
          },
        });
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="toolWrapper">
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
