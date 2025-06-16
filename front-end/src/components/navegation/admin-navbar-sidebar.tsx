'use client';

import {
  User2,
  ArrowLeft,
  User,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';

export const adminNavItems = [
  {
    title: 'Usuarios',
    url: '/admin/users',
    icon: <User />,
  },
    {
    title: 'Grupo de Colaboradores',
    url: '/admin/group-of-colaborators',
    icon: <User2 />,
  },
  {
    title: 'Volver',
    url: '/projects',
    icon: <ArrowLeft />,
  },
];

export function AdminNavbarSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="group/sidebar border-r bg-gradient-to-b from-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      {...props}
    >
      <SidebarHeader className="h-14 border-b flex justify-center items-center bg-gradient-to-r from-background to-background/95">
      </SidebarHeader>
      <SidebarContent className="py-1 bg-gradient-to-r from-background to-background/95">
        <NavMain items={adminNavItems} />
      </SidebarContent>
      <SidebarRail className="after:bg-border after:opacity-50 hover:after:opacity-100 after:transition-opacity" />
    </Sidebar>
  );
}
