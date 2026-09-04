import {useApi} from '../incoming';

interface IUseGroupManagement {
  createGroup: (name: string) => Promise<boolean>;
  addGroupMembers: (groupId: string, memberIds: string[]) => Promise<boolean>;
}

const useGroupManagement = (): IUseGroupManagement => {
  const {httpPost} = useApi();

  const createGroup = async (name: string): Promise<boolean> => {
    const response = await httpPost('/users/groups', {name});
    return response.ok;
  };

  const addGroupMembers = async (groupId: string, memberIds: string[]): Promise<boolean> => {
    const response = await httpPost(`/users/groups/${groupId}/members`, {member_ids: memberIds});
    return response.ok;
  };

  return {
    createGroup,
    addGroupMembers,
  };
};

export default useGroupManagement;
export type {IUseGroupManagement};
