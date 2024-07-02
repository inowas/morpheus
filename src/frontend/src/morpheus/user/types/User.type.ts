interface IAuthenticatedUser {
  user_id: string;
  is_admin: boolean;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  keycloak_user_id: string | null;
  geo_node_user_id: string | null;
}

interface IUser {
  user_id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
}

export type {IAuthenticatedUser, IUser};
