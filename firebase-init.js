import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

console.log("Firebase init script starting...");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYzfW2IFhSInPazldWaDnYK2GCJ71mwyc",
  authDomain: "sync-sport.firebaseapp.com",
  projectId: "sync-sport",
  storageBucket: "sync-sport.appspot.com",
  messagingSenderId: "83820373833",
  appId: "1:83820373833:web:e115eb15779f9cfc81dc98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("Firebase initialized");

async function initializeNotifications() {
  console.log("Initialize notifications function called");
  try {
    // First sign in with Google
    const result = await signInWithPopup(auth, provider);
    console.log("Sign in successful, user:", result.user.email);
    
    // Request notification permission
    const permission = await Notification.requestPermission();
    console.log("Notification permission response:", permission);
    
    if (permission === "granted") {
      console.log("Notification permission granted.");
      
      // Get the ID token from the signed-in user
      const idToken = await result.user.getIdToken();
      console.log("Got ID token");
      
      // Register service worker first
      const swRegistration = await navigator.serviceWorker.register('/tv-screen-detector/firebase-messaging-sw.js', {
        scope: '/tv-screen-detector/'
      });
      console.log('Service Worker registered successfully');
    
      // Wait a moment to ensure service worker is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Now try to get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey: "BAwMBHT-uNz_UDUGCCT2sbLZwzvAO7SvJjfDt4RtPt7Q6dgcnaL4F7NQ-ZI6XT8iONyF6S8IxqEN6YTJcjqqjcM"
      });
      
      console.log("Token request completed");
      
      if (currentToken) {
        console.log("FCM Token:", currentToken);
      } else {
        console.log("No registration token available.");
      }
    }
  } catch (error) {
    console.error("Error during initialization:", error);
    console.error("Error details:", error.message);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded - starting notification setup");
  initializeNotifications();
});

// Handle incoming messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  const { title, body } = payload.notification;
  new Notification(title, { body });
});
