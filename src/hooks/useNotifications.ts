
import { useState, useEffect } from 'react';
import { notificationService, type NotificationData } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const addNotification = (type: any, title: string, message: string, actionUrl?: string) => {
    return notificationService.addNotification(type, title, message, actionUrl);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    notifyAchievement: notificationService.notifyAchievement.bind(notificationService),
    notifyReminder: notificationService.notifyReminder.bind(notificationService),
  };
};
