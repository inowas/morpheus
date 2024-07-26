import React, {useEffect} from 'react';
import {Icon, Popup, SemanticWIDTHS, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import cloneDeep from 'lodash.clonedeep';
import styles from './DataTable.module.less';
import {Button} from 'common/components';
import {IColumn} from '../../../../types/DataTable.type';

interface IProps {
  columns: IColumn[];
  data: Array<{ [key: string]: any }>;
  onChangeData: (data: Array<{ [key: string]: any }>) => void;
  isReadOnly?: boolean;
}

const DataTable = ({columns, data, isReadOnly, onChangeData}: IProps) => {

  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [dataLocal, setDataLocal] = React.useState(data);

  useEffect(() => {
    setDataLocal(data);
  }, [data]);

  const renderCell = (column: IColumn, value: string | number, rowId: number) => {
    const editable = !isReadOnly && selectedRow === rowId;
    if (!editable) {
      return column.format(value);
    }

    return (
      <input
        type={column.inputType}
        value={column.format(value)}
        onChange={(e) => {
          const newData = cloneDeep(dataLocal);
          newData[rowId][column.key] = column.parse(e.target.value);
          setDataLocal(newData);
          onChangeData(newData);
        }}
      />
    );
  };

  const columnWidth = Math.floor(14 / columns.length);
  return (
    <div className='scrollableTable'>
      <Table
        className={styles.table} celled={true}
        striped={true}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column, idx) => (
              <TableHeaderCell
                className='field'
                width={columnWidth as SemanticWIDTHS}
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
            <TableHeaderCell
              width={2}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataLocal.map((row, rowId) => (
            <TableRow key={rowId}>
              {columns.map((column, cellId) => (
                <TableCell
                  key={cellId}
                  width={columnWidth as SemanticWIDTHS}
                >
                  {renderCell(column, row[column.key], rowId)}
                </TableCell>
              ))}
              <TableCell width={2}>
                {!isReadOnly && <div className={styles.actions}>
                  {selectedRow === rowId && <Button icon="save" onClick={() => setSelectedRow(null)}/>}
                  {selectedRow !== rowId && <Button icon="edit" onClick={() => setSelectedRow(rowId)}/>}
                  {1 < dataLocal.length && <Button
                    icon="trash"
                    onClick={() => {
                      const newData = cloneDeep(dataLocal);
                      newData.splice(rowId, 1);
                      setDataLocal(newData);
                      onChangeData(newData);
                    }}
                  />}
                </div>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
