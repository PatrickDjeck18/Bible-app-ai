// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDbcPSejp8kJKEJBomRtAvPsWCAz9HSCCg",
  authDomain: "daily-bread-88f42.firebaseapp.com",
  projectId: "daily-bread-88f42",
  storageBucket: "daily-bread-88f42.firebasestorage.app",
  messagingSenderId: "354959331079",
  appId: "1:354959331079:android:7484ecb8076d9ee686ffa2",
  measurementId: "G-53DHZ8FNP0",
  databaseURL: "https://daily-bread-88f42.firebaseio.com",
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Daily Bread';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Handle the click action
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
