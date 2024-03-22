import {v4} from 'uuid';

interface IUser {
  user_id: string;
  username: string;
  email: string;
  user_image?: string;
  full_name: string;
  is_superuser: boolean;
  status: IUserStatus;
}

type IUserStatus = 'active' | 'inactive';

export type {IUser};


const generateRandomUser = (counter: number): IUser => {
  return {
    user_id: v4().toString(),
    username: `Normal User ${counter.toFixed(0)}`,
    email: `normal_user_${counter.toFixed(0)}@inowas.com`,
    full_name: `Normal User ${counter.toFixed(0)}`,
    is_superuser: false,
    status: 'active' as IUserStatus,
  };
};

const generateRandomUsers = (count: number): IUser[] => {
  const users = [
    {
      user_id: v4().toString(),
      username: 'superadmin',
      email: 'superadmin@inowas.com',
      full_name: 'Super Admin',
      is_superuser: true,
      status: 'active' as IUserStatus,
    },
  ];

  for (let i = 1; i < count; i++) {
    users.push(generateRandomUser(i));
  }

  return users;
};


export {generateRandomUsers};
