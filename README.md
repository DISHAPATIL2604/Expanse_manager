# Firebase Auth App — Glassmorphism Authentication UI

A modern, production-ready authentication UI built with **React + Vite** and **Firebase Authentication**. Features a premium glassmorphism design with a scenic background, smooth animations, and full email/password auth flow.

---

## ✨ Features

- 🔐 **Firebase Email/Password Auth** (Sign Up, Login, Logout, Forgot Password)
- 🎨 **Glassmorphism UI** — translucent card, backdrop blur, gradient overlay
- 🛡️ **Protected routes** — unauthenticated users are redirected to `/login`
- ✅ **Client-side validation** with friendly error messages
- 🔑 **Password visibility toggle** + strength indicator
- 📱 **Fully responsive** — desktop, tablet, and mobile
- 🗄️ **Firestore user documents** created on sign up
- 🌐 **Environment variable–based config** — no hardcoded secrets

---

## 🚀 Getting Started

### Step 1 — Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/) and sign in.
2. Click **"Add project"**, give it a name (e.g., `auth-app`), and follow the wizard.
3. Disable Google Analytics if you don't need it, then click **"Create project"**.

### Step 2 — Enable Email/Password Authentication

1. Inside your project, go to **Build → Authentication** in the left sidebar.
2. Click **"Get started"**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Toggle **Enable** to on, then click **Save**.

### Step 3 — Enable Firestore Database

1. Go to **Build → Firestore Database** in the left sidebar.
2. Click **"Create database"**.
3. Choose **"Start in test mode"** (you can add security rules later).
4. Select a Cloud Firestore location and click **"Enable"**.

### Step 4 — Register a Web App

1. On the Firebase project overview page, click the **`</>`** (web) icon.
2. Give your app a nickname (e.g., `auth-app-web`).
3. Click **"Register app"**.
4. Firebase will display your **Firebase SDK config object**. Copy the values — you'll need them next.

### Step 5 — Create Your `.env` File

In the **root of this project** (same folder as `package.json`), create a file named `.env`:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit your `.env` file to Git.** It is already listed in `.gitignore`.

### Step 6 — Install Dependencies & Run

```bash
# Install all packages
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── firebase.js                  # Firebase initialization (reads from .env)
├── main.jsx                     # React entry point
├── App.jsx                      # Router setup + AuthProvider
├── index.css                    # Global styles + CSS variables
│
├── context/
│   └── AuthContext.jsx          # Global auth state via React Context
│
├── services/
│   └── authService.js           # All Firebase Auth functions
│
├── components/
│   ├── AuthCard.jsx             # Glassmorphism card + background shell
│   ├── AuthInput.jsx            # Reusable labeled input with icon + toggle
│   └── ProtectedRoute.jsx       # Route guard: redirects if not logged in
│
└── pages/
    ├── Login.jsx                # /login — Login form
    ├── Signup.jsx               # /signup — Sign up form
    └── Dashboard.jsx            # /dashboard — Protected welcome page
```

---

## 🛣️ Routes

| Path         | Access    | Description                        |
|--------------|-----------|------------------------------------|
| `/login`     | Public    | Login with email + password        |
| `/signup`    | Public    | Create a new account               |
| `/dashboard` | Protected | Welcome screen (requires login)    |
| `*`          | —         | Redirects to `/login`              |

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview the production build
```

---

## 🔒 Security Notes

- Firebase credentials are stored in environment variables, never in source code.
- The `.env` file is listed in `.gitignore` to prevent accidental commits.
- Firestore security rules should be tightened before going to production.
- The `ProtectedRoute` component prevents unauthenticated access to `/dashboard`.

---

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Firebase v10 | Authentication + Firestore |
| Inter (Google Fonts) | Typography |
