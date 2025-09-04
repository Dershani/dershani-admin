import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/dash')({
  notFoundComponent: RouteComponent,
  component: RouteComponent,
  loader: ({ location }) => {
    if (location.pathname === '/dash') throw redirect({ to: '/dash/lessons' });
  },
  onEnter: ({ status }) => {
    if (status === 'notFound') throw redirect({ to: '/dash/lessons' });
  },
});

function RouteComponent() {
  return <Outlet />;
}
