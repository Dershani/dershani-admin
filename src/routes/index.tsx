import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
  loader: ({ location }) => {
    if (location.pathname === '/') throw redirect({ to: '/dash/lessons' });
  },
});

function App() {
  return <div className="text-center"></div>;
}
