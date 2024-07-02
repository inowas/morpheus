interface IAuthenticatedUser {
  user_id: string;
  is_admin: boolean;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  keycloak_user_id: string;
  geo_node_user_id: string;
}

export type {IAuthenticatedUser};
