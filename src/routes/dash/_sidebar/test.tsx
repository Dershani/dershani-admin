import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dash/_sidebar/test')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dash/test"!</div>;
}
