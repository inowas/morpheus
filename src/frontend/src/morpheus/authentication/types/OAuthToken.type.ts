export interface IOAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string | null;
  refresh_token: string;
  user_id: number;
}
