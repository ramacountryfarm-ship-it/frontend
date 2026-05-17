import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private messaging: Messaging | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async init(): Promise<void> {
    if (!environment.firebase?.apiKey || environment.firebase.apiKey.startsWith('REPLACE')) {
      console.warn('[Push] Firebase not configured — skipping push notifications');
      return;
    }

    try {
      // Init Firebase app (only once)
      const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
      this.messaging = getMessaging(app);

      // Register service worker
      const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      // Request permission and get token
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const token = await getToken(this.messaging, {
        vapidKey: environment.firebase.vapidKey,
        serviceWorkerRegistration: swReg,
      });

      if (token) await this.registerToken(token);

      // Handle foreground messages
      onMessage(this.messaging, (payload) => {
        const { title = 'RCF FarmLog', body = '' } = payload.notification ?? {};
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/assets/logo.png',
          });
        }
      });
    } catch (e) {
      console.warn('[Push] Init error:', e);
    }
  }

  private registerToken(token: string): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/notifications/register-token`, { token })
      .toPromise()
      .catch(() => {});
  }
}
