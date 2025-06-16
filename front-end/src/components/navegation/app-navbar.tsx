
import { SidebarInset } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import { currentUser } from '@/lib/auth';
import { NavUser } from './nav-user';
import { NotificationBell } from '../comment-task-notification';

interface AppNavbarProps {
  children: ReactNode;
  adminSidebar?: ReactNode;
  userSidebar?: ReactNode;
}

export async function AppNavbar({ children, adminSidebar, userSidebar }: AppNavbarProps) {
  const user = await currentUser();

  return (
    <>
      {user?.role === 'ADMIN' ? (
        <div className="hidden md:block">{adminSidebar}</div>
      ) : (
        <div className="hidden md:block">{userSidebar}</div>
      )}
      <SidebarInset className="flex flex-col">
        <header className="relative flex h-14 items-center gap-2 border-b shadow-sm px-6">
          <div className="flex items-center w-full justify-end">
            <NotificationBell />
            <div className="flex items-right gap-6">
              <NavUser
                userNav={{
                  avatar: user?.image ?? '',
                  email: user?.email ?? '',
                  name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
                  role: user?.role || 'USER',
                }}
              />
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  );
}
