// Firebase Messaging Service Worker for background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD4XYsXNjpYzebEr3u5tclYZ6bhmVbkIyg",
  authDomain: "advance-movie-app.firebaseapp.com",
  databaseURL: "https://advance-movie-app-default-rtdb.firebaseio.com",
  projectId: "advance-movie-app",
  storageBucket: "advance-movie-app.firebasestorage.app",
  messagingSenderId: "83278715336",
  appId: "1:83278715336:web:37494bb636036edb2248fd"
});

const messaging = firebase.messaging();
const brandIcon = 'https://i.ibb.co.com/twPb8ZD3/IMG-20260406-145251-962.png';
// Main published domain — always use this for notification clicks
const MAIN_DOMAIN = 'hg';

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};
  
  const notifTitle = notification.title || data.title || 'MOVIE VERISE';
  const notifBody = notification.body || data.body || '';
  const notifImage = notification.image || data.image || undefined;
  const notifIcon = notification.icon || data.icon || brandIcon;
  
  // Use content-based tag to prevent duplicate notifications
  const contentTag = data.contentId || data.type || 'general';
  
  const notifOptions = {
    body: notifBody,
    icon: notifIcon,
    image: notifImage,
    badge: brandIcon,
    vibrate: [200, 100, 200],
    data: data,
    tag: 'rsanime-' + contentTag,
    renotify: true,
    requireInteraction: false,
  };
  
  return self.registration.showNotification(notifTitle, notifOptions);
});

// Raw push event fallback
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const payload = event.data.json();
      if (!payload.notification && payload.data) {
        const data = payload.data;
        const title = data.title || 'MOVIE VERISE';
        const contentTag = data.contentId || data.type || 'general';
        const options = {
          body: data.body || '',
          icon: data.icon || brandIcon,
          image: data.image || undefined,
          badge: brandIcon,
          vibrate: [200, 100, 200],
          data: data,
          tag: 'rsanime-' + contentTag,
          renotify: true,
        };
        event.waitUntil(self.registration.showNotification(title, options));
      }
    } catch (e) {
      // Not JSON, ignore
    }
  }
});

// Handle notification click — ALWAYS open main domain
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const rawUrl = data.url || '/';
  
  // Always use main domain or baseUrl from payload, never self.location.origin
  const baseDomain = data.baseUrl || MAIN_DOMAIN;
  const url = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : baseDomain + (rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus an existing window on the main domain
      for (const client of clientList) {
        if (client.url.includes(baseDomain) && 'focus' in client) {
          client.focus();
          if ('navigate' in client) return client.navigate(url);
          return client;
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Activate immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
