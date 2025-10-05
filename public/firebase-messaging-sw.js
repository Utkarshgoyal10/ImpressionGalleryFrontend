importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDGi90rhdShuHs6xKTPjNTmJ1t_1P2KzS0",
  authDomain: "impression-d22a3.firebaseapp.com",
  projectId: "impression-d22a3",
  storageBucket: "impression-d22a3.firebasestorage.app",
  messagingSenderId: "959545735485",
  appId: "1:959545735485:web:0c970f0e479921977b6d54",
  measurementId: "G-W9LCSF71B8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
  });
});
