import { useEffect } from 'react';
import { computeNotifications } from '../notify';
import { CULTIVOS } from '../data';

export function useNotifications(user, forecast) {
  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      checkAndNotify();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          checkAndNotify();
        }
      });
    }

    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastNotificationDate === today) return;

    function checkAndNotify() {
      const data = {
        siembras: user.siembras || [],
        altitud: user.altitude,
        espacio: user.espacio || 'huerto'
      };

      const daily = forecast?.daily || null;
      const notifications = computeNotifications(CULTIVOS, data, daily);

      notifications.forEach(notif => {
        new Notification(notif.title, {
          body: notif.body,
          tag: notif.key,
          requireInteraction: false
        });
      });

      localStorage.setItem('lastNotificationDate', today);
    }
  }, [user, forecast]);
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
