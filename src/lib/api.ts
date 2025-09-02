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

export { api, queryApi };
