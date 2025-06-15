
import { toast } from "@/hooks/use-toast";
import { storageService } from './storageService';
import { settingsService } from './settingsService';
import { NotificationDataSchema, type NotificationData as SchemaNotificationData } from '@/schemas';

export type NotificationType = 'meal' | 'hydration' | 'achievement' | 'reminder' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private listeners: ((notifications: SchemaNotificationData[]) => void)[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadNotifications();
    this.setupPeriodicReminders();
  }

  private loadNotifications(): SchemaNotificationData[] {
    return storageService.get('notifications');
  }

  private saveNotifications(notifications: SchemaNotificationData[]): void {
    storageService.set('notifications', notifications);
  }

  private notifyListeners(): void {
    const notifications = this.loadNotifications();
    this.listeners.forEach(listener => listener([...notifications]));
  }

  subscribe(listener: (notifications: SchemaNotificationData[]) => void) {
    this.listeners.push(listener);
    listener(this.loadNotifications());
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  addNotification(type: NotificationType, title: string, message: string, actionUrl?: string) {
    const notification = NotificationDataSchema.parse({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl
    });

    const notifications = this.loadNotifications();
    notifications.unshift(notification);
    
    // Keep only the last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    this.saveNotifications(notifications);
    this.notifyListeners();

    // Show toast
    toast({
      title,
      description: message,
    });

    console.log('New notification:', notification);
    return notification.id;
  }

  markAsRead(id: string) {
    const notifications = this.loadNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications(notifications);
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    const notifications = this.loadNotifications();
    notifications.forEach(n => n.read = true);
    this.saveNotifications(notifications);
    this.notifyListeners();
  }

  getUnreadCount() {
    const notifications = this.loadNotifications();
    return notifications.filter(n => !n.read).length;
  }

  private setupPeriodicReminders() {
    const settings = settingsService.getSettings();
    
    // Meal reminders
    if (settings.mealReminders) {
      this.setupMealReminders();
    }

    // Hydration reminders
    if (settings.hydrationReminders) {
      this.setupHydrationReminders();
    }
  }

  private setupMealReminders() {
    // Petit-déjeuner à 8h
    this.scheduleDaily('08:00', () => {
      this.addNotification(
        'meal',
        'Temps du petit-déjeuner !',
        'N\'oubliez pas de prendre un petit-déjeuner équilibré.'
      );
    });

    // Déjeuner à 12h30
    this.scheduleDaily('12:30', () => {
      this.addNotification(
        'meal',
        'Temps du déjeuner !',
        'Il est temps de faire une pause déjeuner.'
      );
    });

    // Dîner à 19h30
    this.scheduleDaily('19:30', () => {
      this.addNotification(
        'meal',
        'Temps du dîner !',
        'Pensez à préparer un dîner nutritif.'
      );
    });
  }

  private setupHydrationReminders() {
    // Rappel d'hydratation toutes les 2 heures de 8h à 20h
    for (let hour = 8; hour <= 20; hour += 2) {
      this.scheduleDaily(`${hour.toString().padStart(2, '0')}:00`, () => {
        this.addNotification(
          'hydration',
          'Temps de s\'hydrater !',
          'N\'oubliez pas de boire un verre d\'eau.'
        );
      });
    }
  }

  private scheduleDaily(time: string, callback: () => void) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduleNext = () => {
      const now = new Date();
      const scheduled = new Date();
      scheduled.setHours(hours, minutes, 0, 0);

      // If the hour is already passed today, schedule for tomorrow
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }

      const timeUntil = scheduled.getTime() - now.getTime();
      
      const timerId = setTimeout(() => {
        callback();
        scheduleNext(); // Reschedule for the next day
      }, timeUntil);

      this.timers.set(time, timerId);
    };

    scheduleNext();
  }

  notifyAchievement(title: string, message: string) {
    this.addNotification('achievement', title, message);
  }

  notifyReminder(title: string, message: string) {
    this.addNotification('reminder', title, message);
  }

  cleanup() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}

export const notificationService = new NotificationService();
