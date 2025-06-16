'use client';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notification';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const token = session?.token ?? session?.token;
  const router = useRouter();

  const {
    notifications,
    hasNewNoteAlert,
    clearNoteAlert,
    removeNotification,
    clearNotifications,
    markNotificationAsRead
  } = useNotifications(userId, token);

  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

const filteredNotifications = [...notifications].filter((n) => !!n);


  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && hasNewNoteAlert) {
      clearNoteAlert();
    }
  };

const handleNotificationClick = async (notif: any) => {
  console.trace('[NotificationBell] handleNotificationClick called');
  await markNotificationAsRead(notif.id);
  removeNotification(notif.id);
  router.push(`/projects/${notif.projectId}`);
};

  if (!userId) return null;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="relative mr-4">
        <Bell className="h-6 w-6 text-gray-700" />
        {isClient && hasNewNoteAlert && filteredNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-50 p-2 overflow-y-auto overflow-x-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="text-sm text-muted-foreground px-4 py-2">
            Sin notificaciones
          </div>
        ) : (
          filteredNotifications.map((notif: any, index: number) => (
            <div
              key={notif.id ?? index}
              className="relative w-full bg-[#121826] text-white rounded-md px-4 py-3 mb-2 overflow-hidden cursor-pointer"
              onClick={() => handleNotificationClick(notif)}
              style={{ whiteSpace: 'normal' }}
            >
              {/* Botón de cerrar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notif.id);
                }}
                className="absolute -top-0 -right-0 text-gray-400 hover:text-red-500 bg-[#121826] w-6 h-6 flex items-center justify-center shadow-sm cursor-pointer"
                aria-label="Eliminar notificación"
              >
                ✕
              </button>

              <div className="flex flex-col gap-1 text-sm text-white">
                <span className="font-semibold">Nueva notificación</span>

                {notif.taskTitle && (
                  <span>
                    En tarea: <strong>{notif.taskTitle}</strong>
                  </span>
                )}

                {notif.projectName && (
                  <span>
                    Proyecto: <strong>{notif.projectName}</strong>
                  </span>
                )}

                {notif.userName && (
                  <span>
                    De: <strong>{notif.userName}</strong>
                  </span>
                )}

                {notif.message && (
                  <span>
                    Mensaje: <strong>{notif.message}</strong>
                  </span>
                )}
              </div>
            </div>

          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
