# ⚔️ SideQuest

> Your life. Gamified.

A React Native (Expo) mobile app. Runs natively on **Android and iOS**.  
Built with TypeScript + Firebase. No web code — pure React Native primitives throughout.

---

## 📁 Project Structure

```
sidequest/
├── App.tsx                        # Entry point
├── app.json                       # Expo config (name, icon, bundle ID)
├── package.json
├── tsconfig.json
└── src/
    ├── types/index.ts             # Quest, UserData types
    ├── services/
    │   ├── firebase.ts            # Auth (anonymous) + Firestore helpers
    │   └── questService.ts        # 25-quest pool, getRandomQuest()
    ├── store/
    │   ├── usePlayer.ts           # All state + Firebase sync (one hook)
    │   └── xpSystem.ts            # Level formula, progress math
    ├── components/
    │   ├── Button.tsx             # TouchableOpacity-based, 4 variants
    │   ├── QuestCard.tsx          # Quest display: type, difficulty, XP
    │   └── XPBar.tsx              # Level badge + animated fill bar
    ├── screens/
    │   └── HomeScreen.tsx         # Main screen (SafeAreaView + ScrollView)
    └── styles/
        └── theme.ts               # Color tokens, spacing, radius
```

> All UI components use **View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet** from `react-native`.  
> Zero `<div>`, zero CSS classes, zero browser APIs.

---

## ⚙️ Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| npm | ≥ 9 | comes with Node |
| Expo CLI | latest | `npm install -g expo-cli` |
| Expo Go app | latest | App Store / Play Store |

---

## 🔥 Firebase Setup (Required)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Create project** → name it `sidequest-dev`
3. Click **Add app → Web** (`</>`) → copy the config object
4. Open `src/services/firebase.ts` and paste your config:

```ts
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sidequest-dev.firebaseapp.com",
  projectId: "sidequest-dev",
  storageBucket: "sidequest-dev.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123",
};
```

5. **Authentication** → Sign-in method → Enable **Anonymous**
6. **Firestore Database** → Create database → Start in **test mode**

Optional but recommended — add Firestore security rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

---

## 🛠️ Install & Run

```bash
git clone <your-repo>
cd sidequest
npm install
```

---

## 📱 Run on Physical Device (Expo Go)

This is the fastest way to see the app on a real phone.

### Step 1 — Start the dev server
```bash
npx expo start
```

You'll see a QR code in your terminal.

### Step 2 — Open on your phone

**Android:**
1. Install **Expo Go** from the Play Store
2. Open Expo Go → tap **"Scan QR code"**
3. Scan the QR code from your terminal

**iPhone:**
1. Install **Expo Go** from the App Store
2. Open the default Camera app
3. Point at the QR code — tap the banner that appears

> ⚠️ Your phone and computer must be on the **same Wi-Fi network**.

### Troubleshooting connection issues
```bash
# If QR scan fails, try tunnel mode (works across networks)
npx expo start --tunnel
```

---

## 🤖 Build APK for Android

An APK lets you install the app directly on any Android device without the Play Store.

### Option A — EAS Build (recommended, cloud-based, no local setup)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to your Expo account (free)
eas login

# 3. Configure EAS in your project (run once)
eas build:configure

# 4. Build the APK (preview profile = .apk file)
eas build -p android --profile preview
```

When it finishes, EAS gives you a **download URL** for the `.apk` file.  
Transfer it to your Android device and install it (enable "Install from unknown sources" in Settings → Security).

### Option B — Local build (requires Android Studio + JDK 17)

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build debug APK locally
cd android
./gradlew assembleDebug

# Output path:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Add preview profile to eas.json (if not auto-created)

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 🍎 Build for iOS

iOS requires a Mac with Xcode and an Apple Developer account ($99/year).

```bash
# Run on iOS simulator (Mac only)
npx expo start --ios

# Build for TestFlight / App Store
eas build -p ios --profile production
```

---

## 🐍 Adding a FastAPI Backend Later

The app is structured so a Python backend can be added without touching existing files.

```
repo-root/
├── sidequest/          ← this React Native app
└── backend/            ← create this when ready
    ├── main.py         ← FastAPI app
    ├── routers/
    │   └── quests.py
    └── requirements.txt
```

When you're ready to connect them:

1. Create `src/config/api.ts` in the RN app:
```ts
// Replace with your deployed FastAPI URL
export const API_BASE_URL = __DEV__
  ? "http://192.168.x.x:8000"   // local dev (use your machine's LAN IP)
  : "https://your-api.fly.dev"; // production
```

2. Call it with `fetch()` — no extra libraries needed:
```ts
const res = await fetch(`${API_BASE_URL}/quests/random`);
const quest = await res.json();
```

Firebase stays for **authentication**. FastAPI handles **game logic, leaderboards, custom quest generation**, etc.

---

## 🎮 Core Loop

```
[Home Screen]
     │
     ▼
[GET RANDOM QUEST] → random quest from pool of 25
     │
     ▼
[QuestCard displayed] → title, description, difficulty, XP reward
     │
     ▼
[COMPLETE QUEST] → XP added, level recalculated, Firestore updated
     │
     ▼
[XP Bar animates] → progress toward next level shown
```

---

## 📐 XP Formula

```
level = floor(0.1 × √xp)
```

| XP     | Level |
|--------|-------|
| 0      | 0     |
| 100    | 1     |
| 400    | 2     |
| 900    | 3     |
| 2500   | 5     |
| 10000  | 10    |

---

## 📦 Dependencies (minimal on purpose)

| Package | Purpose |
|---------|---------|
| `expo ~52` | App runtime, dev tools |
| `react-native 0.76` | UI framework |
| `firebase ^10` | Anonymous auth + Firestore |
| `typescript ^5` | Type safety |

No Redux. No React Query. No animation libraries. Clean baseline to build on.

---

## 🔭 Suggested Next Steps

- `react-navigation` — add a Profile screen, Quest History screen  
- `react-native-reanimated` — XP gain animation on quest complete  
- Quest history subcollection in Firestore  
- Daily streak tracking  
- FastAPI backend for server-side quest generation + leaderboard
