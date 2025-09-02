import { Link } from '@tanstack/react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

import Logo from './logo';

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link to="." className="flex items-center justify-center">
          <Logo
            className="transition-all hover:scale-110"
            style={{
              width: open ? '80px' : '40px',
              height: open ? '40px' : '32px',
            }}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
