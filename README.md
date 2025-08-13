

# 🚀 SpaceX Explorer

A simple React Native app to browse SpaceX launchpads, view details, and see their locations on a map.

## 📹 Demo Video

[Watch the demo](https://github.com/user-attachments/assets/81284f6a-1c3d-4390-b8b0-f28d018fb4bc)

---

## 📂 Project Structure

```
src/
├── api/           # Axios instance, API calls
├── components/    # Reusable UI components
├── hooks/         # Custom hooks for data fetching
├── navigation/    # Root stack navigation
├── screens/       # App screens (Home, Details, Map)
├── theme/         # Colors, typography, spacing
├── types/         # TypeScript type definitions
├── utils/         # Helper utilities (logger, distance calc)
└── App.tsx
```

---

## ✨ Features

- 📡 Fetch SpaceX launchpad data via API
- 📍 View launchpad location on map
- 🗺️ Distance calculation from a fixed point to launchpad
- 🔍 Launchpad details screen
- ⚠️ Error boundary + logging helper
- 🎨 Theming with consistent colors, spacing, typography
- ✅ ESLint + Prettier setup

---

## 🛠️ Tech Stack

- **React Native**
- **TypeScript**
- **React Navigation (Native Stack)**
- **Axios** with interceptors
- **React Native Maps**
- **ESLint + Prettier**

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start Metro bundler

```bash
npx expo start
```

---

## ⚙️ API

We use SpaceX API v4 to fetch launchpad data.

Example:
```ts
const { data } = await axiosInstance.get('/launchpads');
```

---

## 🗺️ Map Integration

Implemented using `react-native-maps`.
- Displays the selected launchpad's coordinates
- Marker to location
- Button to go to local maps to see with Distance shown from current loc to launch site.
---

## 🧩 Custom Hooks

- `useLaunches()` → fetches launchpad list
- `useLaunchDetails(id)` → fetches details for a specific launchpad

---


## 🛡️ Error Handling

- ErrorBoundary component to catch UI errors
- Logger utility to log errors/warnings

---

## 🧹 Linting

```bash
npm run lint
```

ESLint with TypeScript, React Native, and Prettier rules.

---

## 👨‍💻 Author

**Tushar Maithani** — Built for SpaceX Explorer assessment.

---

*Ready to explore the cosmos! 🌌*
