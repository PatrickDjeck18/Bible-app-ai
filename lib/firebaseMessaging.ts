import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

export class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  private vapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HIkF7j7wAd7rSw';

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (!messaging) {
        console.log('Firebase messaging not available');
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getFCMToken(): Promise<string | null> {
    try {
      if (!messaging) {
        console.log('Firebase messaging not available');
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });
      
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      return null;
    }
  }

  setupMessageListener(): void {
    if (!messaging) {
      console.log('Firebase messaging not available');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      
      // Handle foreground messages
      if (payload.notification) {
        const notification = payload.notification;
        new Notification(notification.title || 'Daily Bread', {
          body: notification.body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        });
      }
    });
  }

  async initialize(): Promise<void> {
    try {
      const hasPermission = await this.requestPermission();
      if (hasPermission) {
        const token = await this.getFCMToken();
        if (token) {
          // Store token in your backend or local storage
          localStorage.setItem('fcm_token', token);
        }
        this.setupMessageListener();
      }
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error);
    }
  }
}

export const firebaseMessaging = FirebaseMessagingService.getInstance();
