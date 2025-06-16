import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Notification = any;

const getStorageKey = (userId: string) => `notifications_${userId}`;
const getAlertKey = (userId: string) => `hasNewNoteAlert_${userId}`;

const storeNotificationsForUser = (userId: string, notifications: Notification[]) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(notifications));
};

const getNotificationsForUser = (userId: string): Notification[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(getStorageKey(userId));
  return stored ? JSON.parse(stored) : [];
};

const storeAlertForUser = (userId: string, hasAlert: boolean) => {
  localStorage.setItem(getAlertKey(userId), hasAlert ? 'true' : 'false');
};

const getAlertForUser = (userId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(getAlertKey(userId)) === 'true';
};

export const useNotifications = (userId: string | undefined, token: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNoteAlert, setHasNewNoteAlert] = useState(false);

  useEffect(() => {
    if (!userId || !token) {
      setNotifications([]);
      setHasNewNoteAlert(false);
      return;
    }

    // 1. Cargar del localStorage
    setNotifications(getNotificationsForUser(userId));
    setHasNewNoteAlert(getAlertForUser(userId));

    // 2. Fetch inicial desde backend (solo no leídas)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?isRead=false`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Notification[]) => {
        const filteredData = data.filter(n => String(n.userId) === String(userId));
        if (filteredData.length > 0) {
          setNotifications(filteredData);
          storeNotificationsForUser(userId, filteredData);
          setHasNewNoteAlert(true);
          storeAlertForUser(userId, true);
        }
      })
      .catch((e) => console.error('Error fetching notifications:', e));

    // 3. WebSocket
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ['websocket'],
      query: { userId },
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log(' Conectado al WebSocket con userId:', userId);
    });

    socket.on('notification', (notification: Notification) => {
      if (String(notification.userId) !== String(userId)) return;

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        const updated = [...prev, notification];
        storeNotificationsForUser(userId, updated);
        return updated;
      });

      setHasNewNoteAlert(true);
      storeAlertForUser(userId, true);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del WebSocket');
    });

    return () => {
      socket.disconnect();
    };

  }, [userId, token]);

  const clearNoteAlert = () => {
    if (!userId) return;
    setHasNewNoteAlert(false);
    storeAlertForUser(userId, false);
  };

  const removeNotification = (id: string) => {
    if (!userId) return;
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      storeNotificationsForUser(userId, filtered);
      if (filtered.length === 0) {
        setHasNewNoteAlert(false);
        storeAlertForUser(userId, false);
      }
      return filtered;
    });
  };

  const markNotificationAsRead = async (id: string) => {
    if (!token || !userId) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) => {
        const filtered = prev.filter(n => n.id !== id);
        storeNotificationsForUser(userId, filtered);
        return filtered;
      });
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (userId) {
      localStorage.removeItem(getStorageKey(userId));
      localStorage.removeItem(getAlertKey(userId));
    }
  };

  return {
    notifications,
    hasNewNoteAlert,
    clearNoteAlert,
    removeNotification,
    clearNotifications,
    markNotificationAsRead,
  };
};
