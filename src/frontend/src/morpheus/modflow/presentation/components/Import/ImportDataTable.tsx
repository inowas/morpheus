import React from 'react';
import {Checkbox, Icon, Popup, Table, TableBody, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import DataTableInput from './ImportDataTableInput';
import cloneDeep from 'lodash.clonedeep';
import {getImportColumnsByType} from './helpers';
import {IImportItemType, IImportItemValue} from './Import.type';

interface IProps {
  type: IImportItemType;
  values: IExtendedImportItemValue[];
  onChangeValues: (values: IExtendedImportItemValue[]) => void;
  attributes: string[];
  formatISODate: (date: string) => string;
  parseDate: (date: string) => string;
}

// here we add the enabled flag and the possibility to use strings as values (for attribute-keys)
export type IExtendedImportItemValue = IImportItemValue & { enabled: boolean, [key: string]: any };

const ImportDataTableStressPeriods = ({type, values, attributes, onChangeValues, formatISODate, parseDate}: IProps) => {

  const columns = getImportColumnsByType(type, formatISODate, parseDate);

  return (
    <Table celled={true} striped={true}>
      <TableHeader>
        <TableRow textAlign={'center'}>
          <TableHeaderCell textAlign={'left'}>No</TableHeaderCell>
          {columns.map((column, idx) => (
            <TableHeaderCell className='field' key={idx}>
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
        {values.map((row, rowId) => (
          <TableRow key={rowId} disabled={!row.enabled}>
            <Table.Cell>
              <div>
                <span>{rowId + 1}</span>
              </div>
              <div>
                <Checkbox
                  disabled={0 === rowId}
                  toggle={true}
                  checked={0 === rowId || row.enabled}
                  style={{pointerEvents: 'all', marginLeft: 10}}
                  onChange={(e, {checked}) => {
                    const newData = cloneDeep(values);
                    newData[rowId].enabled = checked || false;
                    onChangeValues(newData);
                  }}
                />
              </div>
            </Table.Cell>
            {columns.map((column, idx) => (
              <Table.Cell
                key={idx}
                disabled={!row.enabled}
                textAlign={'center'}
              >
                {'date_time' === column.key && column.format(row[column.key])}
                {'date_time' !== column.key && 'number' === column.inputType &&
                  <DataTableInput
                    attributes={attributes}
                    value={attributes.includes(row[column.key]) ? null : column.format(row[column.key])}
                    attribute={attributes.includes(row[column.key]) ? row[column.key] : ''}
                    onChange={(attribute, value) => {
                      const newData = cloneDeep(values);
                      if (attributes.includes(attribute || '')) {
                        newData[rowId][column.key] = attribute;
                        return onChangeValues(newData);
                      }

                      newData[rowId][column.key] = column.parse(value);
                      onChangeValues(newData);
                    }}
                  />
                }
              </Table.Cell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ImportDataTableStressPeriods;
