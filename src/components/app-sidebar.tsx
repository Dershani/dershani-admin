import { Link } from '@tanstack/react-router';
import {
  BookIcon,
  BookOpenTextIcon,
  PencilRulerIcon,
  SettingsIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import Logo from './logo';

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link to="/dash/lessons" className="flex items-center justify-center">
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
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="flex">
              <Link to={'/dash/lessons'}>
                <BookIcon />
                <span className="truncate">Dersler</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="flex">
              <Link to={'/dash/units'}>
                <BookOpenTextIcon />
                <span className="truncate">Üniteler</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="flex">
              <Link to={'/dash/subjects'}>
                <PencilRulerIcon />
                <span className="truncate">Konular</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="flex">
            <Link to={'/dash/auth'}>
              <SettingsIcon />
              <span className="truncate">Auth Ayarları</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
