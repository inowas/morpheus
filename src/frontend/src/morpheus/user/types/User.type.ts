interface IUser {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_superuser: boolean;
  status: IUserStatus;
}

type IUserStatus = 'active' | 'inactive';

export type {IUser, IUserStatus};
