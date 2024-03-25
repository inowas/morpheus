const reactOidcContext = jest.createMockFromModule('react-oidc-context');

reactOidcContext.useAuth = () => ({
  isAuthenticated: true,
  isLoading: false,
  error: undefined,
  user: {
    id_token: 'id_token-aaaaaa',
    session_state: 'session_state',
    access_token: 'access_token-aaaaa-aaaaa-aaaaa',
    refresh_token: 'refresh_token-aaaaa-aaaaa-aaaaa',
    token_type: 'Bearer',
    profile: {
      name: 'John Doe',
      email: '',
      sub: 'aaaaa-aaaaa-aaaaa-aaaaa',
    },
    expires_at: Date.now() + 10000,
  },
});

module.exports = reactOidcContext;

export default {};
