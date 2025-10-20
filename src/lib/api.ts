import createFetchClient, { Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';

import type { paths } from './types/api-schema';

const authMiddleware: Middleware = {
  onRequest: ({ request }) => {
    request.headers.set(
      'Authorization',
      localStorage.getItem('auth-key') ?? ''
    );
    return request;
  },
};

const api = createFetchClient<paths>({
  baseUrl: process.env.PUBLIC_API_URL ?? 'http://localhost:3003/',
});

api.use(authMiddleware);

const queryApi = createClient(api);

type ApiReturnTypes<
  Path extends keyof paths,
  Method extends keyof paths[Path] = 'get',
> = paths[Path][Method] extends {
  responses: { 200: { content: { 'application/json': infer R } } };
}
  ? R
  : never;

export { api, queryApi, type ApiReturnTypes };
