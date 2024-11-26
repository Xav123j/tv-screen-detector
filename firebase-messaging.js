import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYzfW2IFhSInPazldWaDnYK2GCJ71mwyc",
  authDomain: "sync-sport.firebaseapp.com",
  projectId: "sync-sport",
  storageBucket: "sync-sport.appspot.com",
  messagingSenderId: "83820373833",
  appId: "1:83820373833:web:e115eb15779f9cfc81dc98",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request notification permission and retrieve FCM token
Notification.requestPermission()
  .then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getToken(messaging, { vapidKey: "BAwMBHT-uNz_UDUGCCT2sbLZwzvAO7SvJjfDt4RtPt7Q6dgcnaL4F7NQ-ZI6XT8iONyF6S8IxqEN6YTJcjqqjcM" }) // Replace with your actual VAPID Key
        .then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            // Optionally, send the token to your server
          } else {
            console.log("No registration token available.");
          }
        })
        .catch((err) => console.error("Error retrieving token:", err));
    } else {
      console.log("Notification permission denied.");
    }
  });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/tv-screen-detector/firebase-messaging-sw.js', {
    scope: '/tv-screen-detector/'  // Explicitly set the scope to match GitHub Pages path
  })
  .then(function(registration) {
    console.log('Service Worker registration successful with scope:', registration.scope);
  })
  .catch(function(error) {
    console.log('Service Worker registration failed with error:', error);
    // Log the specific error details
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error filename:', error.filename);
    console.log('Error line number:', error.lineNumber);
  });
}

// Handle incoming messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  const { title, body } = payload.notification;
  new Notification(title, { body });
});

