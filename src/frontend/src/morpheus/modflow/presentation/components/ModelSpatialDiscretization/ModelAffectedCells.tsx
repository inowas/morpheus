import React from 'react';
import {Button, DataGrid} from 'common/components';

interface IProps {
  isDirty: boolean;
  isLoading: boolean;
  isLocked: boolean;
  onReset: () => void;
  onSubmit: () => void;
}

const ModelAffectedCells = ({isLoading, isDirty, isLocked, onReset, onSubmit}: IProps) => {
  if (isLocked) {
    return null;
  }

  return (<DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
    <Button
      style={{marginLeft: 'auto'}}
      size={'tiny'}
      disabled={!isDirty}
      onClick={onReset}
    >
      {'Reset'}
    </Button>
    <Button
      primary={true}
      size={'tiny'}
      disabled={!isDirty}
      onClick={onSubmit}
      loading={isLoading}
    >
      {'Apply'}
    </Button>
  </DataGrid>);
};

export default ModelAffectedCells;