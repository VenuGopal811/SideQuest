// ─── Firebase Configuration ──────────────────────────────────────────────────
// Firebase is NOT currently used.
// Auth is handled entirely by the FastAPI backend (JWT tokens).
//
// If you need Firebase for analytics or push notifications later:
// 1. Run: npm install firebase
// 2. Uncomment the initializeApp block below
// 3. Set environment variables (EXPO_PUBLIC_FIREBASE_*)
//
// See: https://docs.expo.dev/guides/environment-variables/

// import { initializeApp } from "firebase/app";
//
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
// };
//
// const app = initializeApp(firebaseConfig);
// export default app;

export {};