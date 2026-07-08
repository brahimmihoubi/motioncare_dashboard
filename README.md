# MotionCare Dashboard — Frontend Documentation

> **A professional, full-featured clinical management dashboard** built with React 19, Vite 6, TypeScript 5, and Tailwind CSS v4. Designed for healthcare/education professionals to manage patients, programs, exercises, sessions, analytics, and support workflows — all in one sleek, responsive interface.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Architecture & State Management](#5-architecture--state-management)
6. [Data Models (TypeScript Types)](#6-data-models-typescript-types)
7. [Components Reference](#7-components-reference)
8. [Views & Pages](#8-views--pages)
9. [Theme System (Light / Dark Mode)](#9-theme-system-light--dark-mode)
10. [Sidebar Navigation](#10-sidebar-navigation)
11. [Mock Data](#11-mock-data)
12. [Build & Scripts](#12-build--scripts)
13. [Configuration Files](#13-configuration-files)
14. [Git & Repository](#14-git--repository)

---

## 1. Project Overview

**MotionCare Dashboard** is a single-page application (SPA) that serves as the administrative front-end for the MotionCare platform. It provides a clean, data-rich UI for managing:

- **Patients** — full CRUD (create, view, edit, delete), status tracking, search & filter
- **Programs** — exercise program cards with management actions
- **Exercises** — exercise library with detail/guide tabs
- **Sessions** — schedule management with modal-based creation
- **Progress** — patient progression tracking
- **Analytics** — KPI cards and data charts
- **Support Center** — help resources and FAQ
- **Settings** — administrator profile and theme preferences

The application features a **fully responsive layout**, **dark/light theme toggle** with `localStorage` persistence, and a **collapsible sidebar** with a smooth show/hide animation and floating restore button.

---

## 2. Technology Stack

| Category | Technology | Version |
|---|---|---|
| UI Framework | **React** | `^19.0.1` |
| Build Tool | **Vite** | `^6.2.3` |
| Language | **TypeScript** | `~5.8.2` |
| Styling | **Tailwind CSS v4** | `^4.1.14` |
| Tailwind Vite Plugin | `@tailwindcss/vite` | `^4.1.14` |
| React Plugin | `@vitejs/plugin-react` | `^5.0.4` |
| Icons | **Lucide React** | `^0.546.0` |
| Animations | **Motion** (Framer Motion) | `^12.23.24` |
| AI Integration | `@google/genai` | `^2.4.0` |
| Server | **Express** | `^4.21.2` |
| Env Config | **dotenv** | `^17.2.3` |

### Dev Dependencies

| Tool | Version |
|---|---|
| `typescript` | `~5.8.2` |
| `autoprefixer` | `^10.4.21` |
| `esbuild` | `^0.25.0` |
| `tsx` | `^4.21.0` |
| `@types/node` | `^22.14.0` |
| `@types/express` | `^4.17.21` |

---

## 3. Project Structure

```
motioncare_dashboard/
│
├── public/
│   └── MotionCare_logo.png          # Public static logo asset
│
├── src/
│   ├── assets/
│   │   └── MotionCare_logo.png      # Logo imported in Sidebar component
│   │
│   ├── components/
│   │   ├── Sidebar.tsx              # Navigation sidebar (collapsible)
│   │   ├── DashboardView.tsx        # Main dashboard overview page
│   │   ├── PatientsView.tsx         # Patient CRUD management
│   │   ├── ProgramsView.tsx         # Exercise programs listing
│   │   ├── ExercisesView.tsx        # Exercise library & detail viewer
│   │   ├── SessionsView.tsx         # Session scheduling
│   │   ├── AnalyticsView.tsx        # Charts & KPI analytics
│   │   ├── SupportCenterView.tsx    # Help center & FAQ
│   │   └── SettingsView.tsx         # Admin profile & theme toggle
│   │
│   ├── App.tsx                      # Root component — routing, global state
│   ├── main.tsx                     # React DOM entry point
│   ├── index.css                    # Tailwind CSS v4 base import + dark mode variant
│   ├── types.ts                     # TypeScript interfaces & type definitions
│   ├── mockData.ts                  # Static seed data for patients, sessions, etc.
│   └── vite-env.d.ts                # Vite client type declarations (PNG/SVG imports)
│
├── index.html                       # HTML entry point
├── vite.config.ts                   # Vite + Tailwind + React plugin config
├── tsconfig.json                    # TypeScript compiler options
├── package.json                     # Project metadata and dependencies
└── README.md                        # This file
```

---

## 4. Getting Started

### Prerequisites

- **Node.js** v18 or above
- **npm** v9 or above

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/brahimmihoubi/motioncare_dashboard.git
cd motioncare_dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will start at: **http://localhost:3000**

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 (host: 0.0.0.0) |
| `npm run build` | Build production bundle to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (no emit) |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## 5. Architecture & State Management

The application uses **React's built-in `useState` and `useEffect` hooks** for all state management — no external state library (Redux/Zustand/etc.) is required.

### Central State in `App.tsx`

All shared application state lives at the top level in [App.tsx](src/App.tsx) and is passed down as props:

```
App.tsx (root)
 ├── activeTab          — which sidebar view is currently active
 ├── sidebarCollapsed   — boolean controlling sidebar visibility
 ├── theme              — 'light' | 'dark' (persisted in localStorage)
 ├── patients[]         — full patient registry array
 ├── schedule[]         — today's session schedule
 ├── recentSessions[]   — recent session history
 └── doctor             — logged-in user profile (name, role, avatar)
```

### Data Flow

```
App.tsx
  └─── passes props down ───►  Sidebar.tsx
  └─── passes props down ───►  DashboardView.tsx
  └─── passes props down ───►  PatientsView.tsx
  └─── passes props down ───►  SessionsView.tsx
  └─── etc.
```

### CRUD Operations

Patient data operations are defined in `App.tsx` and passed as callback props:

| Handler | Action |
|---|---|
| `handleAddPatient` | Creates new patient with auto-incremented ID (`MC-XXXXX`) |
| `handleEditPatient` | Updates an existing patient record by ID |
| `handleDeletePatient` | Removes a patient from state by ID |
| `handleAddScheduleItem` | Adds a new session to the schedule |
| `triggerViewFlow` | Navigates to Patients view with a pre-selected patient |

---

## 6. Data Models (TypeScript Types)

All types are defined in [src/types.ts](src/types.ts).

### `Patient`
```typescript
interface Patient {
  id: string;            // Format: "MC-00001"
  name: string;
  avatar: string;        // URL to profile image
  age: number;
  gender: 'Male' | 'Female';
  condition: string;     // e.g. "Knee Injury"
  program: string;       // e.g. "Knee Rehabilitation"
  lastSessionDate: string;
  lastSessionTime: string;
  status: 'Active' | 'Inactive';
  email: string;
  phone: string;
  joinDate: string;
  notes?: string;        // Optional clinical notes
}
```

### `ScheduleItem`
```typescript
interface ScheduleItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  timeRange: string;     // e.g. "9:00 AM - 9:30 AM"
  program: string;
  status: 'Session' | 'In Progress' | 'Completed';
}
```

### `RecentSession`
```typescript
interface RecentSession {
  id: string;
  patientName: string;
  patientAvatar: string;
  programName: string;
  date: string;
  time: string;
  status: 'Checked' | 'Crossed';
}
```

### `SidebarTab`
```typescript
type SidebarTab =
  | 'dashboard'
  | 'patients'
  | 'programs'
  | 'exercises'
  | 'sessions'
  | 'progress'
  | 'analytics'
  | 'support'
  | 'settings';
```

---

## 7. Components Reference

### `Sidebar.tsx`
**Location:** `src/components/Sidebar.tsx`

The persistent left-side navigation panel.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `activeTab` | `SidebarTab` | Currently selected view |
| `setActiveTab` | `(tab: SidebarTab) => void` | Tab change callback |
| `doctorName` | `string` | Profile name displayed at the bottom |
| `doctorRole` | `string` | Profile role/title |
| `doctorAvatar` | `string` | Profile image URL |
| `collapsed` | `boolean` | If `true`, sidebar is fully hidden (`w-0`) |
| `onToggleCollapse` | `() => void` | Show/hide toggle callback |

**Key Features:**
- Fully hides with CSS `width: 0` + `overflow: hidden` when `collapsed = true`
- Circular logo container at the top with brand logo
- Active tab highlighted with cyan accent + dot indicator
- Profile dropdown at the bottom with Sign Out and My Profile options
- `×` close button to hide the sidebar

---

### `DashboardView.tsx`
**Location:** `src/components/DashboardView.tsx`

The main landing page. The largest component (~900 lines).

**Key Features:**
- 6 KPI metric cards (patients, sessions, completions, etc.)
- Interactive SVG line chart — Weekly Completion Overview with hover tooltips
- Completion Rate donut chart (SVG)
- Sessions by Exercise donut chart
- Today's Schedule card with inline session launch
- Patients table with search, filter tabs (All/Active/Inactive), and pagination
- Recent Sessions widget
- Help Center quick-access card
- Global search bar (syncs to patient table)
- Notification bell dropdown
- Date widget

---

### `PatientsView.tsx`
**Location:** `src/components/PatientsView.tsx`

Full patient registry management interface.

**Key Features:**
- Search and multi-filter (status, gender, etc.)
- Patient card grid and detail view
- Add Patient modal form
- Edit Patient inline form
- Delete with confirmation dialog
- Patient profile detail panel (contact info, notes, session history)

---

### `ProgramsView.tsx`
**Location:** `src/components/ProgramsView.tsx`

Exercise program management.

**Key Features:**
- Program cards with duration, difficulty, and exercise count
- Add New Program modal with form
- Program status badges

---

### `ExercisesView.tsx`
**Location:** `src/components/ExercisesView.tsx`

Exercise library browser.

**Key Features:**
- Exercise list with filtering
- Detail panel with two tabs: **Details** and **Guide**
- Exercise metadata (sets, reps, duration, difficulty)

---

### `SessionsView.tsx`
**Location:** `src/components/SessionsView.tsx`

Session scheduling and calendar view.

**Key Features:**
- Weekly calendar view
- Session list with status indicators
- Add New Session modal (patient, program, time inputs)

---

### `AnalyticsView.tsx`
**Location:** `src/components/AnalyticsView.tsx`

KPI analytics and reporting.

**Key Features:**
- Summary KPI metric cards
- Bar chart visualization (custom SVG)
- Period selector dropdown

---

### `SupportCenterView.tsx`
**Location:** `src/components/SupportCenterView.tsx`

Help and support resources.

**Key Features:**
- FAQ accordion
- Contact/support action cards
- Resource links

---

### `SettingsView.tsx`
**Location:** `src/components/SettingsView.tsx`

Administrator profile and application preferences.

**Key Features:**
- Profile info edit form (name, email, role)
- **Dark/Light theme toggle button** — directly controls global theme
- Settings sidebar navigation (profile, notifications, security, etc.)

---

## 8. Views & Pages

Navigation between views is handled via the `activeTab` state in `App.tsx`. The sidebar sets this state; `App.tsx` conditionally renders the matching view component.

| Tab Value | Component | Description |
|---|---|---|
| `dashboard` | `DashboardView` | Overview & KPI metrics |
| `patients` | `PatientsView` | Patient registry & management |
| `programs` | `ProgramsView` | Exercise programs |
| `exercises` | `ExercisesView` | Exercise library |
| `sessions` | `SessionsView` | Session scheduling |
| `progress` | *(inline render)* | Patient progress tracking |
| `analytics` | `AnalyticsView` | Data charts & analytics |
| `support` | `SupportCenterView` | Help center |
| `settings` | `SettingsView` | Profile & preferences |

---

## 9. Theme System (Light / Dark Mode)

The dashboard supports a full **Light and Dark theme** that persists across page reloads.

### How It Works

1. **Default theme:** Light (`localStorage` key: `mc-theme`)
2. **Toggle:** User clicks the theme button in `SettingsView.tsx`
3. **Mechanism:** `App.tsx` adds/removes the `.dark` class on `<html>` via `useEffect`
4. **CSS:** Tailwind CSS v4's class-based dark mode variant is configured in `index.css`:

```css
@import "tailwindcss";

/* Enable class-based dark mode for Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));
```

5. **Component styles:** All components use `dark:` prefixed utility classes, e.g.:
   ```html
   <div class="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
   ```

### Theme Persistence

```typescript
// Read from localStorage on mount
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  return (localStorage.getItem('mc-theme') as 'light' | 'dark') || 'light';
});

// Sync to <html> class and localStorage on change
useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('mc-theme', theme);
}, [theme]);
```

---

## 10. Sidebar Navigation

### Show / Hide Toggle

The sidebar fully hides when collapsed (not just shrinks):

```tsx
// In Sidebar.tsx
<aside className={`
  transition-all duration-300 ease-in-out overflow-hidden
  ${collapsed ? 'w-0 border-r-0' : 'w-64'}
`}>
```

When hidden, a **floating Menu button** appears at the top-left of the screen to restore it:

```tsx
// In App.tsx
<button
  className={`fixed top-6 left-6 z-50 ... transition-all duration-300
    ${sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `}
  onClick={() => setSidebarCollapsed(false)}
>
  <Menu />
</button>
```

---

## 11. Mock Data

**Location:** `src/mockData.ts`

The app ships with realistic seed data (no backend required for development):

| Export | Contents |
|---|---|
| `INITIAL_PATIENTS` | Array of 8 patient records with full profile data |
| `INITIAL_SCHEDULE` | Today's session schedule items |
| `INITIAL_RECENT_SESSIONS` | Recent session history entries |

All IDs follow the format `MC-XXXXX` (e.g. `MC-00001`).

---

## 12. Build & Scripts

```bash
# Development server (hot module replacement)
npm run dev
# → http://localhost:3000

# Production build
npm run build
# → outputs to /dist

# Preview production build
npm run preview

# TypeScript type-check (no output files)
npm run lint

# Clean build artifacts
npm run clean
```

The development server is configured to bind on all network interfaces (`--host=0.0.0.0`) to allow access from other devices on the same network.

---

## 13. Configuration Files

### `vite.config.ts`
```typescript
plugins: [react(), tailwindcss()]   // React JSX + Tailwind v4 via Vite plugin
resolve: { alias: { '@': '.' } }    // Root-relative imports using @/
server: { hmr: ..., watch: ... }    // HMR controlled by DISABLE_HMR env var
```

### `tsconfig.json`
```json
{
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "paths": { "@/*": ["./*"] }
}
```

### `src/vite-env.d.ts`
```typescript
/// <reference types="vite/client" />
```
This file enables TypeScript to recognize Vite's module declarations for static assets (`.png`, `.svg`, `.css`, etc.) so that import statements like:
```typescript
import motionCareLogo from '../assets/MotionCare_logo.png';
```
...resolve without TypeScript errors.

---

## 14. Git & Repository

**Repository:** [github.com/brahimmihoubi/motioncare_dashboard](https://github.com/brahimmihoubi/motioncare_dashboard)

**Main branch:** `main`

### Recommended `.gitignore`

> ⚠️ The first commit accidentally included `node_modules/`. It is strongly recommended to add a `.gitignore` file to prevent this in future commits:

```gitignore
# Dependencies
node_modules/

# Build output
dist/
server.js

# Environment variables
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

To fix the repository and remove `node_modules` from tracking:

```bash
echo "node_modules/" >> .gitignore
git rm -r --cached node_modules/
git add .gitignore
git commit -m "chore: remove node_modules from tracking"
git push
```

---

## License

SPDX-License-Identifier: **Apache-2.0**

All source files carry the Apache 2.0 license header as required by the project.

---

*Documentation last updated: July 2026*
