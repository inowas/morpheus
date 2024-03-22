interface IUserProfile {
  aud: string | string[];
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  name: string;
  preferred_username: string;
  sid: string;
  sub: string;
}

export type {IUserProfile};
