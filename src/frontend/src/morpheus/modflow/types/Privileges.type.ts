type IUserPrivilege = 'view_project' | 'edit_project' | 'manage_project' | 'full_access';

type IProjectPrivileges = IUserPrivilege[];

export type {IUserPrivilege, IProjectPrivileges};
