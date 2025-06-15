
import { toast } from "@/components/ui/use-toast";

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
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadNotifications();
    this.setupPeriodicReminders();
  }

  private loadNotifications() {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener);
    listener([...this.notifications]);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private getSettings() {
    try {
      const saved = localStorage.getItem('app-settings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  addNotification(type: NotificationType, title: string, message: string, actionUrl?: string) {
    const notification: NotificationData = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl
    };

    this.notifications.unshift(notification);
    
    // Garder seulement les 50 dernières notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.saveNotifications();
    this.notifyListeners();

    // Afficher le toast
    toast({
      title,
      description: message,
    });

    console.log('Nouvelle notification:', notification);
    return notification.id;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  private setupPeriodicReminders() {
    const settings = this.getSettings();
    
    // Rappels de repas
    if (settings.mealReminders !== false) {
      this.setupMealReminders();
    }

    // Rappels d'hydratation
    if (settings.hydrationReminders !== false) {
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

      // Si l'heure est déjà passée aujourd'hui, programmer pour demain
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }

      const timeUntil = scheduled.getTime() - now.getTime();
      
      const timerId = setTimeout(() => {
        callback();
        scheduleNext(); // Reprogrammer pour le lendemain
      }, timeUntil);

      this.timers.set(time, timerId);
    };

    scheduleNext();
  }

  // Notifications d'accomplissement
  notifyAchievement(title: string, message: string) {
    this.addNotification('achievement', title, message);
  }

  // Notifications de rappel général
  notifyReminder(title: string, message: string) {
    this.addNotification('reminder', title, message);
  }

  // Nettoyer les timers
  cleanup() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}

export const notificationService = new NotificationService();
