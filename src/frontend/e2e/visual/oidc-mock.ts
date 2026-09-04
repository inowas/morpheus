const REALM_NAME = 'inowas';

const base64url = (value: unknown): string => Buffer.from(JSON.stringify(value)).toString('base64url');

const tokenClaims = (user: Record<string, unknown>, issuer: string): Record<string, unknown> => ({
  iss: issuer,
  sub: user.sub,
  aud: 'inowas-frontend',
  exp: 4102444800,
  iat: 1893542400,
  auth_time: 1893542400,
  jti: 'mock-jti',
  sid: 'mock-sid',
  nonce: 'mock-nonce',
  preferred_username: user.preferred_username,
  email: user.email,
  email_verified: true,
  given_name: user.given_name,
  family_name: user.family_name,
  realm_access: {roles: user.realm_roles},
});

const makeToken = (claims: Record<string, unknown>): string => {
  const header = base64url({alg: 'RS256', typ: 'JWT'});
  const payload = base64url(claims);
  return `${header}.${payload}.mock-signature`;
};

interface IOidcUser {
  sub: string;
  preferred_username: string;
  email: string;
  given_name: string;
  family_name: string;
  realm_roles: string[];
}

const buildSessionTokens = (user: IOidcUser, issuer: string) => {
  const claims = tokenClaims(user, issuer);
  return {
    accessToken: makeToken(claims),
    idToken: makeToken(claims),
    refreshToken: 'mock-refresh-token',
    idTokenPayload: claims,
    accessTokenPayload: claims,
    expiresAt: claims.exp,
    expiresIn: 3600,
    scope: 'openid profile email',
    sessionState: 'mock-session-state',
    tokenType: 'Bearer',
  };
};

const corsHeaders = (method: string): Record<string, string> => {
  const headers: Record<string, string> = {'Access-Control-Allow-Origin': '*'};
  if ('OPTIONS' === method) {
    headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
};

const discoveryDocument = (realm: string) => {
  const realmBase = `${realm}/protocol/openid-connect`;
  return {
    issuer: realm,
    authorization_endpoint: `${realmBase}/auth`,
    token_endpoint: `${realmBase}/token`,
    userinfo_endpoint: `${realmBase}/userinfo`,
    jwks_uri: `${realmBase}/certs`,
    check_session_iframe: `${realmBase}/check_session_iframe`,
    end_session_endpoint: `${realmBase}/logout`,
    response_types_supported: ['code', 'id_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    token_endpoint_auth_methods_supported: ['client_secret_post'],
  };
};

const userInfo = (user: IOidcUser) => ({
  sub: user.sub,
  preferred_username: user.preferred_username,
  email: user.email,
  email_verified: true,
  given_name: user.given_name,
  family_name: user.family_name,
  realm_roles: user.realm_roles,
});

/**
 * Mocks the Keycloak identity server so react-oidc v7 considers the user
 * authenticated without any real network traffic. The real app derives the
 * authority from window.location.hostname (//identity.<host>), so under the
 * visual suite's *.localhost base URL every request to the "identity.*" host
 * is intercepted here and the OIDC discovery/userinfo/token endpoints are
 * fulfilled from memory.
 */
export async function mockOidc(page: {addInitScript: (fn: (data: never) => void, arg: never) => Promise<void>; route: (...args: any[]) => Promise<void>}): Promise<void> {
  const user: IOidcUser = {
    sub: '11111111-1111-1111-1111-111111111111',
    preferred_username: 'demo',
    email: 'demo@inowas.com',
    given_name: 'Demo',
    family_name: 'User',
    realm_roles: [],
  };

  await page.addInitScript((data: never) => {
    const session = data as {tokens: unknown};
    localStorage.setItem('oidc.default', JSON.stringify({tokens: session.tokens, status: 'valid'}));
    localStorage.setItem('oidc.session_state.default', 'mock-session');
    localStorage.setItem('oidc.login.default', JSON.stringify({state: 'mock-state', nonce: 'mock-nonce', extras: {}}));
  }, {tokens: buildSessionTokens(user, `http://identity.morpheus.localhost:4173/realms/${REALM_NAME}`)} as never);

  await page.route(
    (url: URL) => url.hostname.startsWith('identity.'),
    async (route: {request: () => {url: () => string; method: () => string}; fulfill: (options: object) => Promise<void>}) => {
      const method = route.request().method();
      const requestUrl = new URL(route.request().url());
      const pathname = requestUrl.pathname;
      const realm = `${requestUrl.origin}/realms/${REALM_NAME}`;

      const respond = (status: number, body: unknown, contentType = 'application/json') => route.fulfill({
        status,
        headers: corsHeaders(method),
        contentType,
        body: body as string,
      });

      if ('OPTIONS' === method) {
        return respond(204, '', 'text/plain');
      }

      if (pathname.endsWith('/.well-known/openid-configuration')) {
        return respond(200, JSON.stringify(discoveryDocument(realm)));
      }

      if (pathname.endsWith('/protocol/openid-connect/userinfo')) {
        return respond(200, JSON.stringify(userInfo(user)));
      }

      if (pathname.endsWith('/protocol/openid-connect/token')) {
        return respond(200, JSON.stringify(buildSessionTokens(user, realm)));
      }

      if (pathname.endsWith('/protocol/openid-connect/certs')) {
        return respond(200, JSON.stringify({keys: []}));
      }

      if (pathname.endsWith('/check_session_iframe')) {
        return respond(200, '<html><body></body></html>', 'text/html');
      }

      if (pathname.endsWith('/protocol/openid-connect/logout')) {
        return respond(200, '<html><body></body></html>', 'text/html');
      }

      return respond(404, JSON.stringify({message: `No OIDC fixture for ${pathname}`}));
    },
  );
}
