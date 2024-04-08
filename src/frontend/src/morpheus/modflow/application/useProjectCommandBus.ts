import * as Commands from './useProjectCommandBus.type';
import {useApi} from '../incoming';
import {IError} from '../../types';
import {Err, Ok, Result} from 'ts-results';

type ILocation = string;

interface IUseProjectCommandBus {
  sendCommand: <T extends Commands.ICommand>(command: T) => Promise<Result<ILocation | undefined, IError>>;
}

const useProjectCommandBus = (): IUseProjectCommandBus => {
  const {httpPost} = useApi();

  const sendCommand = async (command: Commands.ICommand): Promise<Result<ILocation | undefined, IError>> => {
    const response = await httpPost<Commands.ICommand>('/projects/messagebox', command);
    if (response.ok) {
      return Ok(response.val.location);
    }
    if (response.err) {
      return Err({
        code: response.val.code,
        message: response.val.message,
      });
    }

    return Err({
      code: 500,
      message: 'Unknown error',
    });
  };

  return {
    sendCommand,
  };
};

export default useProjectCommandBus;
export type {IUseProjectCommandBus, Commands};
