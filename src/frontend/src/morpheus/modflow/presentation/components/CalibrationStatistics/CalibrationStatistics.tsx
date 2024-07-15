import React from 'react';
import {Table} from 'semantic-ui-react';
import {IStatistics} from '../../../types/HeadObservations.type';

interface IProps {
  statistics: IStatistics | null;
}

const CalibrationStatistics = ({statistics}: IProps) => {

  if (!statistics) {
    return null;
  }

  return (
    <Table celled={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Symbol</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell>Unit</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body style={{overflowY: 'auto'}}>
        <Table.Row>
          <Table.Cell>Number of data points</Table.Cell>
          <Table.Cell>n [-]</Table.Cell>
          <Table.Cell>{statistics.data.length}</Table.Cell>
          <Table.Cell>-</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Maximum Absolute Residual</Table.Cell>
          <Table.Cell>
            R<sub>MAX</sub>{' '}
          </Table.Cell>
          <Table.Cell>{statistics.stats.absResidual.max.toFixed(3)}</Table.Cell>
          <Table.Cell>m</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Minimum Absolute Residual</Table.Cell>
          <Table.Cell>
            R<sub>MIN</sub>
          </Table.Cell>
          <Table.Cell>{statistics.stats.absResidual.min.toFixed(3)}</Table.Cell>
          <Table.Cell>m</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Residual Mean</Table.Cell>
          <Table.Cell>
            R<sub>MEAN</sub>
          </Table.Cell>
          <Table.Cell>{statistics.stats.residual.mean.toFixed(3)}</Table.Cell>
          <Table.Cell>m</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Absolute residual Mean</Table.Cell>
          <Table.Cell>
            |R<sub>MEAN</sub>|
          </Table.Cell>
          <Table.Cell>{statistics.stats.residual.mean.toFixed(3)}</Table.Cell>
          <Table.Cell>m</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Standard error of estimation</Table.Cell>
          <Table.Cell>SSE</Table.Cell>
          <Table.Cell>{statistics.stats.residual.sse.toFixed(3)}</Table.Cell>
          <Table.Cell>-</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Root Mean Squared Error</Table.Cell>
          <Table.Cell>RMSE</Table.Cell>
          <Table.Cell>{statistics.stats.residual.rmse.toFixed(3)}</Table.Cell>
          <Table.Cell>m</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Normalized Root Mean Squared Error</Table.Cell>
          <Table.Cell>NRMSE</Table.Cell>
          <Table.Cell>{statistics.stats.residual.nrmse.toFixed(3)}</Table.Cell>
          <Table.Cell>-</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Correlation Coefficient Pearson R</Table.Cell>
          <Table.Cell>R</Table.Cell>
          <Table.Cell>{statistics.linRegObsSim.r.toFixed(3)}</Table.Cell>
          <Table.Cell>-</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Coefficient of determination</Table.Cell>
          <Table.Cell>
            R<sup>2</sup>
          </Table.Cell>
          <Table.Cell>{statistics.linRegObsSim.r2.toFixed(3)}</Table.Cell>
          <Table.Cell>-</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default CalibrationStatistics;
