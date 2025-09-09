import { usePageTitle } from '@/hooks/page-title';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { PanelLeft } from 'lucide-react';

import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export const Route = createFileRoute('/dash/_sidebar')({
  component: RouteComponent,
});

function RouteComponent() {
  const [title] = usePageTitle();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-w-[100vw] md:max-w-[calc(100vw-4rem)]">
        <div className="w-full px-2 mx-auto">
          <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b bg-background p-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
            <Button size="icon" variant="outline" asChild>
              <SidebarTrigger>
                <PanelLeft className="h-3 w-3" />
                <span className="sr-only">Toggle Menu</span>
              </SidebarTrigger>
            </Button>
            <h1>{title}</h1>
          </header>
          <main className="py-4">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
