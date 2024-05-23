import React, {useEffect, useState} from 'react';
import {Icon, Popup, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import {IBoundaries} from '../type/BoundariesContent.type';
import styles from './BoundariesTable.module.less';
import {useDateTimeFormat} from '../../../../../../common/hooks';
import {getBoundariesByType} from '../helpers/BoundariesContent.helpers';
import {v4 as uuidv4} from 'uuid';

interface IProps {
  columns: IColumn[];
  data: Array<{ [key: string]: any }>;
}

interface IColumn {
  title: string;
  key: string;
  format?: (value: any) => string;
  fallback?: string;
}

const DataTable = ({columns, data}: IProps) => (
  <div className='scrollableTable'>
    <Table celled={true} striped={true}>
      <TableHeader>
        <TableRow>
          {columns.map((column, idx) => (
            <TableHeaderCell
              className={`${styles.headerCell} field`}
              key={idx}
            >
              <Popup
                trigger={<Icon
                  name="info circle"
                />}
                content={column.title}
                hideOnScroll={true}
                size="tiny"
              />
              {column.title}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {columns.map((column, idx) => (
              <TableCell key={idx}>
                {column.format ? column.format(row[column.key]) : row[column.key] || column.fallback}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default DataTable;
