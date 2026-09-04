import {IError} from '../../types';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {Result} from 'ts-results';

type IProjectRole = 'viewer' | 'editor' | 'admin' | 'owner';

interface IUseProjectGroupRole {
  setGroupRole: (projectId: string, groupId: string, role: IProjectRole | null) => Promise<Result<string | undefined, IError>>;
}

const useProjectGroupRole = (): IUseProjectGroupRole => {
  const {sendCommand} = useProjectCommandBus();

  const setGroupRole = (projectId: string, groupId: string, role: IProjectRole | null): Promise<Result<string | undefined, IError>> => {
    const command: Commands.IUpdateProjectGroupRoleCommand = {
      command_name: 'update_project_group_role_command',
      payload: {
        project_id: projectId,
        group_id: groupId,
        role,
      },
    };

    return sendCommand(command);
  };

  return {
    setGroupRole,
  };
};

export default useProjectGroupRole;
