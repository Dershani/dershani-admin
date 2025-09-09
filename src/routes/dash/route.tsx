import { createFileRoute } from '@tanstack/react-router';

import { redirectRouteOptions } from '@/lib/redirect-route-options';

export const Route = createFileRoute('/dash')(
  redirectRouteOptions('/dash', '/dash/lessons')
);
