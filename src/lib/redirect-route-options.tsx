import { useEffect } from 'react';

import { FileRouteTypes } from '@/routeTree.gen';
import { Outlet, redirect, useRouter } from '@tanstack/react-router';

export function redirectRouteOptions<
  From extends FileRouteTypes['fullPaths'],
  To extends FileRouteTypes['fullPaths'],
>(from: From, to: To) {
  return {
    notFoundComponent: () => {
      const router = useRouter();
      useEffect(() => {
        router.navigate({ to });
      }, [router]);

      return <div>Aradığın sayfayı bulamadık.</div>;
    },
    component: RouteComponent,
    loader: ({ location }: { location: { pathname: string } }) => {
      if (location.pathname === from) throw redirect({ to });
    },
  } as const;
}

export function notFoundRedirectOptions<To extends FileRouteTypes['fullPaths']>(
  to: To
) {
  return {
    notFoundComponent: () => {
      const router = useRouter();
      useEffect(() => {
        router.navigate({ to });
      }, [router]);

      return <div>Aradığın sayfayı bulamadık.</div>;
    },
  } as const;
}

function RouteComponent() {
  return <Outlet />;
}
