export interface IApiFixture {
  status?: number;
  json?: unknown;
}

export interface IApiHandler {
  test: (url: URL, method: string) => boolean;
  respond: (url: URL, method: string) => IApiFixture;
}

const corsHeaders = (method: string): Record<string, string> => {
  const headers: Record<string, string> = {'Access-Control-Allow-Origin': '*'};
  if ('OPTIONS' === method) {
    headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
};

const jsonHandler = (method: string, pathname: string, status: number, json?: unknown): IApiHandler => ({
  test: (url, m) => m === method && url.pathname === pathname,
  respond: () => ({status, json}),
});

export const getHandler = (pathname: string, json?: unknown): IApiHandler => jsonHandler('GET', pathname, 200, json);
export const notFound = (pathname: string): IApiHandler => jsonHandler('GET', pathname, 404, {message: 'not found'});

/**
 * Mocks the Morpheus backend so the real app can render without a server.
 * The app calls config.baseApiUrl which resolves to "//api.<host>" at runtime,
 * i.e. http://api.127.0.0.1:4173 in this test server. Everything on that host
 * is fulfilled here. Unknown requests fail loudly so a new screen surfaces the
 * endpoints it needs instead of silently 404ing.
 */
export async function mockApi(
  page: {route: (predicate: (url: URL) => boolean, handler: (route: object) => Promise<void>) => Promise<void>},
  handlers: IApiHandler[],
  onUnmatched?: (method: string, pathname: string) => void,
): Promise<void> {
  await page.route(
    (url: URL) => url.hostname.startsWith('api.'),
    async (route: {request: () => {url: () => string; method: () => string}; fulfill: (options: object) => Promise<void>}) => {
      const method = route.request().method();
      const url = new URL(route.request().url());

      if ('OPTIONS' === method) {
        return route.fulfill({status: 204, headers: corsHeaders(method), body: ''});
      }

      const handler = handlers.find((h) => h.test(url, method));
      if (!handler) {
        if (onUnmatched) {
          onUnmatched(method, url.pathname);
        }
        return route.fulfill({
          status: 404,
          headers: corsHeaders(method),
          contentType: 'application/json',
          body: JSON.stringify({message: `No API fixture for ${method} ${url.pathname}`}),
        });
      }

      const fixture = handler.respond(url, method);
      return route.fulfill({
        status: fixture.status ?? 200,
        headers: corsHeaders(method),
        contentType: 'application/json',
        body: fixture.json !== undefined ? JSON.stringify(fixture.json) : '',
      });
    },
  );
}
