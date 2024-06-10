import React, {useEffect} from 'react';
import {Icon, Popup, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import styles from './DataTable.module.less';
import cloneDeep from "lodash.clonedeep";
import {Button} from "../../../../../../common/components";

interface IProps {
  columns: IColumn[];
  data: Array<{ [key: string]: any }>;
  onChangeData: (data: Array<{ [key: string]: any }>) => void;
  isReadOnly?: boolean;
}

export interface IColumn {
  title: string;
  key: string;
  format: (value: any) => string;
  parse: (value: string) => any;
  defaultValue: number;
  inputType: 'text' | 'number' | 'date' | 'datetime-local';
  precision?: number;
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

  return (
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
            <TableHeaderCell/>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataLocal.map((row, rowId) => (
            <TableRow key={rowId}>
              {columns.map((column, cellId) => (
                <TableCell
                  key={cellId}
                >
                  {renderCell(column, row[column.key], rowId)}
                </TableCell>
              ))}
              <TableCell>
                {!isReadOnly && <>
                  {selectedRow === rowId && <Button icon="save" onClick={() => setSelectedRow(null)}/>}
                  {selectedRow !== rowId && <Button icon="edit" onClick={() => setSelectedRow(rowId)}/>}
                  {dataLocal.length > 1 && <Button
                    icon="trash"
                    onClick={() => {
                      const newData = cloneDeep(dataLocal);
                      newData.splice(rowId, 1);
                      setDataLocal(newData);
                      onChangeData(newData);
                    }}
                  />}
                </>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
