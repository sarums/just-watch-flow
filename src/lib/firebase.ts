// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDZwb4YEtrlihGHDYVf1fxLCYEeKxX3K5o",
  authDomain: "rongkunvideo.firebaseapp.com",
  projectId: "rongkunvideo",
  storageBucket: "rongkunvideo.firebasestorage.app",
  messagingSenderId: "562968893196",
  appId: "1:562968893196:web:b2607318b60737e9211b29",
  measurementId: "G-E44KB65EYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
