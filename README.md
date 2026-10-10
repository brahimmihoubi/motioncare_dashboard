# MotionCare Admin Dashboard

**Version:** 0.0.0  
**License:** Apache-2.0  
**Technology Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4, Socket.IO

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [Environment Configuration](#6-environment-configuration)
7. [Authentication](#7-authentication)
8. [Navigation and Routing](#8-navigation-and-routing)
9. [Module Reference](#9-module-reference)
   - 9.1 [Dashboard](#91-dashboard)
   - 9.2 [Patients](#92-patients)
   - 9.3 [Doctors](#93-doctors)
   - 9.4 [Programs](#94-programs)
   - 9.5 [Exercises](#95-exercises)
   - 9.6 [Exercise Requests](#96-exercise-requests)
   - 9.7 [Sessions](#97-sessions)
   - 9.8 [Live Session Control](#98-live-session-control)
   - 9.9 [Analytics and Progress](#99-analytics-and-progress)
   - 9.10 [Audit Logs](#910-audit-logs)
   - 9.11 [Support Center](#911-support-center)
   - 9.12 [Settings](#912-settings)
10. [Services Layer](#10-services-layer)
    - 10.1 [AuthService](#101-authservice)
    - 10.2 [DataService](#102-dataservice)
    - 10.3 [ExerciseRequestService](#103-exerciserequestservice)
    - 10.4 [NotificationService](#104-notificationservice)
    - 10.5 [AuditLogService](#105-auditlogservice)
    - 10.6 [ExoskeletonService](#106-exoskeletonservice)
    - 10.7 [SocketService](#107-socketservice)
11. [Data Types Reference](#11-data-types-reference)
12. [Real-Time Updates](#12-real-time-updates)
13. [State Management](#13-state-management)
14. [Theme System](#14-theme-system)
15. [Build and Deployment](#15-build-and-deployment)
16. [API Endpoint Reference](#16-api-endpoint-reference)

---

## 1. Project Overview

MotionCare Admin Dashboard is the administrative control interface for the MotionCare rehabilitation platform. It provides healthcare administrators with a centralized workspace to manage patients, medical staff, rehabilitation programs, exercise libraries, and exoskeleton-assisted therapy sessions.

The dashboard communicates with a backend REST API (default: `http://localhost:5000/api`) and maintains a persistent WebSocket connection to receive real-time updates whenever clinical data changes. All data mutations flow through the backend; the frontend never writes directly to any database.

**Primary responsibilities of the admin dashboard:**

- Monitor platform-wide statistics (patients, sessions, compliance rates)
- Perform full CRUD operations on patients, doctors, programs, and exercises
- Schedule and review therapy sessions
- Control exoskeleton hardware remotely during live sessions
- Review and act on exercise requests submitted by doctors
- Inspect audit logs for security and compliance purposes
- Receive and manage in-app notifications

---

## 2. System Architecture

```
Browser (Admin Dashboard)
        |
        |  HTTP (REST) + Bearer Token
        v
Backend REST API  <----->  Database
        |
        |  WebSocket (Socket.IO)
        v
Browser (real-time push events)
        |
        |  WebSocket (Socket.IO)
        v
Exoskeleton Hardware (via backend relay)
```

The frontend is a single-page application (SPA). Navigation between modules does not trigger full page reloads. The application mounts once on login and manages all view transitions through React state.

---

## 3. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.0.1 |
| Language | TypeScript | 5.8.x |
| Build Tool | Vite | 6.2.x |
| CSS Framework | Tailwind CSS (Vite plugin) | 4.1.x |
| Icon Library | lucide-react | 0.546.x |
| Animation | motion | 12.x |
| HTTP Client | axios | 1.18.x |
| WebSocket Client | socket.io-client | 4.8.x |
| AI Integration | @google/genai | 2.4.x |
| Runtime (dev) | tsx | 4.21.x |

---

## 4. Project Structure

```
motioncare_dashboard/
├── index.html                  # Application entry point (HTML shell)
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript compiler options
├── package.json                # Dependencies and npm scripts
├── apply_dark.cjs              # Utility script for dark mode application
├── test_admin_api.cjs          # Manual API testing script (CommonJS)
├── test_admin_api.js           # Manual API testing script (ESM)
├── metadata.json               # Project metadata
├── public/                     # Static assets served as-is
└── src/
    ├── main.tsx                # React application bootstrap
    ├── App.tsx                 # Root component; holds all shared state and routing logic
    ├── index.css               # Global CSS resets and base styles
    ├── types.ts                # All TypeScript interface and type definitions
    ├── mockData.ts             # Static mock data for development and fallback
    ├── vite-env.d.ts           # Vite environment variable type declarations
    ├── assets/
    │   └── MotionCare_logo.png # Application logo
    ├── components/
    │   ├── Sidebar.tsx                # Collapsible navigation sidebar
    │   ├── LoginView.tsx              # Authentication screen
    │   ├── DashboardView.tsx          # Overview metrics and charts
    │   ├── PatientsView.tsx           # Patient management (CRUD)
    │   ├── DoctorsView.tsx            # Doctor management (CRUD)
    │   ├── ProgramsView.tsx           # Rehabilitation program management (CRUD)
    │   ├── ExercisesView.tsx          # Exercise library management (CRUD)
    │   ├── ExerciseRequestsView.tsx   # Exercise request workflow
    │   ├── SessionsView.tsx           # Session scheduling and management
    │   ├── LiveSessionView.tsx        # Real-time exoskeleton session control
    │   ├── AnalyticsView.tsx          # Progress and analytics charts
    │   ├── AuditLogsView.tsx          # Platform activity audit trail
    │   ├── SupportCenterView.tsx      # Admin support interface
    │   └── SettingsView.tsx           # Admin profile and application settings
    └── services/
        ├── api.ts              # All HTTP service classes (axios-based)
        └── socket.ts           # Singleton WebSocket service (Socket.IO)
```

---

## 5. Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- A running instance of the MotionCare backend API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd motioncare_dashboard

# Install all dependencies
npm install
```

### Running in Development Mode

```bash
npm run dev
```

The development server starts on `http://0.0.0.0:3000` and is accessible from any network interface on port 3000.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite --port=3000 --host=0.0.0.0` | Start development server |
| `build` | `vite build` | Compile and bundle for production |
| `preview` | `vite preview` | Preview the production build locally |
| `clean` | `rm -rf dist server.js` | Remove build artifacts |
| `lint` | `tsc --noEmit` | TypeScript type checking without emit |

---

## 6. Environment Configuration

The application reads the following environment variables from a `.env` file placed at the project root.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL for the REST API |
| `VITE_SOCKET_URL` | `http://localhost:5000` | WebSocket server URL |

Create a `.env` file in the project root to override defaults:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

All variables prefixed with `VITE_` are statically embedded into the bundle at build time by Vite.

---

## 7. Authentication

Authentication is handled by `AuthService` in `src/services/api.ts`.

### Login Flow

1. The user enters their email and password on the `LoginView` screen.
2. A POST request is sent to `POST /api/auth/admin/login`.
3. On success, the backend returns a JWT token and a user profile object.
4. The token is stored in `localStorage` under the key `mc_admin_token`.
5. The user profile is stored in `localStorage` under the key `mc_admin_profile`.
6. The application transitions to the main dashboard.

### Token Injection

All subsequent API requests automatically include the stored token via an axios request interceptor:

```
Authorization: Bearer <mc_admin_token>
```

### Automatic Session Expiry

An axios response interceptor monitors all API responses. If any request returns HTTP 401 (Unauthorized), the interceptor calls `AuthService.logout()` and triggers a full page reload, effectively returning the user to the login screen.

### Logout

Logout clears both `mc_admin_token` and `mc_admin_profile` from `localStorage`. The React state is updated to reflect the unauthenticated state, causing the `LoginView` to render.

### Session Persistence

Authentication persists across browser refreshes because the token is read from `localStorage` on application mount via `AuthService.isAuthenticated()`.

---

## 8. Navigation and Routing

The application uses React state for client-side navigation. There is no external router library. Navigation is managed entirely through the `activeTab` state variable in `App.tsx`, which is of type `SidebarTab`.

### Available Routes (Tab Identifiers)

| Tab ID | Component Rendered | Description |
|---|---|---|
| `dashboard` | `DashboardView` | Platform overview and metrics |
| `patients` | `PatientsView` | Patient registry management |
| `doctors` | `DoctorsView` | Medical staff management |
| `programs` | `ProgramsView` | Rehabilitation program library |
| `exercises` | `ExercisesView` | Exercise definition library |
| `exercise-requests` | `ExerciseRequestsView` | Doctor exercise request workflow |
| `sessions` | `SessionsView` | Session scheduling and tracking |
| `live-session` | `LiveSessionView` | Real-time exoskeleton control panel |
| `progress` | `AnalyticsView` | Progress tracking charts |
| `analytics` | `AnalyticsView` | Analytics and reporting |
| `audit-logs` | `AuditLogsView` | Platform audit trail |
| `support` | `SupportCenterView` | Support center interface |
| `settings` | `SettingsView` | Admin profile and app settings |

### Sidebar Navigation

The `Sidebar` component renders all navigation items and calls `setActiveTab` on click. It supports two states:

- **Expanded** (default): Full 256px (`w-64`) sidebar with label text and icons.
- **Collapsed**: Zero-width, fully hidden. A floating menu button appears in the top-left corner to restore it.

Toggling is controlled by the `sidebarCollapsed` state in `App.tsx`.

---

## 9. Module Reference

### 9.1 Dashboard

**File:** `src/components/DashboardView.tsx`

The dashboard is the default landing view after login. It aggregates platform-wide data into a single at-a-glance screen.

**Sections:**

- **Header Toolbar**: Contains a global search input, a notification bell with unread badge, and a static date widget.
- **Metrics Grid (6 cards)**: Displays Total Patients, Total Sessions, Completed Sessions, Missed Sessions, Compliance Rate, and Active Patients. All values are fetched live from the API via `DataService.getDashboardStats()`. Cards show animated placeholder text while data is loading.
- **Weekly Completion Overview**: An interactive SVG line chart showing completed vs. missed sessions for each day of the week (Monday through Sunday). Hovering over a day column reveals a tooltip with exact values. Static mock data is used for this chart.
- **Completion Rate Donut**: An SVG circular donut chart showing the overall compliance percentage. The arc length is calculated from `dashboardStats.complianceRate`. Below the ring, it shows completed sessions out of total sessions.
- **Sessions by Exercise Donut**: A multi-segment SVG donut showing the distribution of sessions across four exercise types (Lying Leg Raises, Heel Slide, Leg Curl, Seated Knee Flexion-Extension), with a legend. Static mock data is used.
- **Today's Schedule Panel**: Lists scheduled sessions for the day from the `schedule` prop. Each entry has a patient avatar, name, time range, program name, and a "Session" action button.
- **Patients Table**: A paginated, filterable table of patients. Supports filtering by All, Active, and Inactive status tabs. Shows 5 patients per page with previous/next pagination. Each row has View, Edit, and Delete actions.
- **Recent Sessions Panel**: Lists the most recent sessions from the API with patient name, avatar, program name, date, time, and a status indicator (completed vs. not completed).

**Props accepted by DashboardView:**

| Prop | Type | Description |
|---|---|---|
| `patients` | `Patient[]` | Patient list from shared App state |
| `schedule` | `ScheduleItem[]` | Today's scheduled sessions |
| `recentSessions` | `RecentSession[]` | Recent sessions from API |
| `dashboardStats` | `object or null` | Aggregated statistics from API |
| `isLoadingData` | `boolean` | Shows loading state on metric cards |
| `doctorName` | `string` | Admin name shown in welcome message |
| `onAddPatientClick` | `() => void` | Navigates to Patients module |
| `onAddScheduleClick` | `() => void` | Navigates to Sessions module |
| `onViewPatient` | `(patient: Patient) => void` | Opens patient detail view |
| `onEditPatient` | `(patient: Patient) => void` | Opens patient edit form |
| `onDeletePatient` | `(id: string) => void` | Deletes a patient |
| `onNavigateTab` | `(tab: SidebarTab) => void` | Cross-module navigation |

---

### 9.2 Patients

**File:** `src/components/PatientsView.tsx`

Full patient registry with create, read, update, and delete operations.

**Features:**
- Table listing all patients with search and filter by status (All, Active, Inactive)
- Add patient modal form
- Edit patient inline or via modal
- Delete patient with confirmation
- Patient detail view panel
- Assignment of doctor and program to each patient

**Patient record fields:** ID (formatted as `MC-XXXXX`), name, avatar, age, gender, condition, program, last session date, last session time, status (Active/Inactive), email, phone, join date, notes.

---

### 9.3 Doctors

**File:** `src/components/DoctorsView.tsx`

Medical staff management interface.

**Features:**
- List all registered doctors
- Add, edit, and delete doctor records
- Doctor fields: id, name, email, specialization, created_at

---

### 9.4 Programs

**File:** `src/components/ProgramsView.tsx`

Rehabilitation program library management.

**Features:**
- List all rehabilitation programs
- Create, update, and delete programs
- Programs are assigned to patients through the patient management interface

---

### 9.5 Exercises

**File:** `src/components/ExercisesView.tsx`

Exercise definition library management.

**Features:**
- List all available exercises
- Create, update, and delete exercise definitions
- Exercises are referenced within sessions and programs

---

### 9.6 Exercise Requests

**File:** `src/components/ExerciseRequestsView.tsx`

Workflow management for exercise requests submitted by doctors on behalf of patients.

**Request Lifecycle States:**

| Status | Description |
|---|---|
| `pending` | Submitted by a doctor, awaiting admin review |
| `under_review` | Admin has opened the request for review |
| `accepted` | Admin approved the request |
| `rejected` | Admin rejected the request |
| `delivered` | Exercise has been delivered to the patient |

**Features:**
- List all exercise requests with filtering by status
- View request details (doctor, patient, exercise, notes)
- Update request status with optional admin notes
- Role-based visibility: admins see all requests; doctors see only their own

**Props:**

| Prop | Type | Description |
|---|---|---|
| `userRole` | `'admin' or 'doctor'` | Controls which API endpoint is called and which actions are available |

---

### 9.7 Sessions

**File:** `src/components/SessionsView.tsx`

Session scheduling, listing, and management.

**Session statuses:**

| Status | Description |
|---|---|
| `pending` | Scheduled but not yet started |
| `countdown` | In countdown phase before starting |
| `running` | Currently in progress |
| `paused` | Temporarily paused |
| `stopped` | Manually stopped before completion |
| `completed` | Successfully completed |
| `missed` | Patient did not attend |
| `emergency_stop` | Halted due to emergency condition |

**Features:**
- List all sessions with filtering by status
- Create new sessions (requires patient, program, date)
- Update session details
- Delete sessions
- Launch live session control panel for any running session via the `onLaunchLiveSession` callback

---

### 9.8 Live Session Control

**File:** `src/components/LiveSessionView.tsx`

Real-time control panel for exoskeleton-assisted therapy sessions.

**How it works:**

1. When the admin launches a live session from `SessionsView`, the `activeLiveSessionId` state is set and the tab switches to `live-session`.
2. `LiveSessionView` fetches the current hardware state via `ExoskeletonService.getState(sessionId)`.
3. If no state exists (HTTP 404), the session is automatically initialized with a default duration of 300 seconds via `ExoskeletonService.initSession(sessionId, 300)`.
4. A dedicated Socket.IO connection is opened. The client emits `join_session` with the session ID to subscribe to hardware state updates for that specific session.
5. The backend pushes `exo:state_update` events whenever the hardware state changes. The UI reflects these changes instantly without polling.
6. On unmount, the client emits `leave_session` and disconnects the socket.

**Exoskeleton State Machine:**

```
pending / stopped  --[start]--> countdown --> running
     running       --[pause]-->  paused
      paused       --[resume]--> running
running / paused / countdown --[stop]--> stopped
         any state --[emergency_stop]--> emergency_stop
    emergency_stop --[start]-->  pending (restart)
```

**Controls available per state:**

| State | Available Controls |
|---|---|
| `pending`, `stopped` | START |
| `running` | PAUSE, STOP, EMERGENCY STOP |
| `paused` | RESUME, STOP, EMERGENCY STOP |
| `countdown` | STOP, EMERGENCY STOP |
| `emergency_stop` | RESTART SYSTEM |
| `completed` | None |

**Display panels:**
- System State card: Shows current state with color coding (green for running, red for emergency stop, amber for paused, blue for other).
- Timer card: Shows countdown remaining during `countdown` state, or elapsed time (MM:SS) during all other states.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `sessionId` | `number` | ID of the session to control |
| `onBack` | `() => void` | Returns navigation to Sessions module |

---

### 9.9 Analytics and Progress

**File:** `src/components/AnalyticsView.tsx`

Analytics and progress tracking views. Both the `progress` and `analytics` tab IDs render this same component.

**Features:**
- Session completion trend charts
- Patient activity heatmaps
- Compliance metrics over time
- Exercise performance breakdowns

---

### 9.10 Audit Logs

**File:** `src/components/AuditLogsView.tsx`

Read-only table of all platform activity events for security and compliance auditing.

**Table columns:**

| Column | Description |
|---|---|
| Timestamp | Date and time of the event (localized string) |
| User | User name or ID who performed the action; shows "System" for automated events |
| Action | Action code (e.g., CREATE, UPDATE, DELETE, START, EMERGENCY_STOP). Color-coded by severity |
| Entity | The resource type affected (e.g., patient, session, exercise) |
| Details | JSON payload of the change, truncated in the table cell with full content in the title tooltip |

**Action color coding:**

| Color | Actions |
|---|---|
| Red | `EMERGENCY_STOP` |
| Green | Actions containing `CREATE`, or `START` |
| Blue | Actions containing `UPDATE`, or `RESUME` |
| Gray | All other actions |

Data is fetched once on component mount from `AuditLogService.getAllLogs()`.

---

### 9.11 Support Center

**File:** `src/components/SupportCenterView.tsx`

Administrative support interface for handling support tickets and platform communication.

---

### 9.12 Settings

**File:** `src/components/SettingsView.tsx`

Admin profile management and application configuration.

**Features:**
- Update admin display name and role
- Update admin avatar
- Toggle between light and dark theme
- Profile changes are persisted to `localStorage` under `mc_admin_profile`

**Props:**

| Prop | Type | Description |
|---|---|---|
| `doctorName` | `string` | Current admin display name |
| `doctorRole` | `string` | Current admin role label |
| `doctorAvatar` | `string` | URL of the admin avatar image |
| `onUpdateDoctor` | `(name, role, avatar) => void` | Callback to update shared App state |
| `theme` | `'light' or 'dark'` | Current active theme |
| `onThemeChange` | `(theme: string) => void` | Callback to change the theme |

---

## 10. Services Layer

All API communication is centralized in `src/services/api.ts`. A single axios instance is created with the `VITE_API_URL` as the base URL. All service classes use this shared instance.

### 10.1 AuthService

Handles login, logout, and session state.

| Method | Signature | Description |
|---|---|---|
| `login` | `(credentials: { email, password }) => Promise` | POST to `/auth/admin/login`. Stores token and profile on success. |
| `logout` | `() => void` | Clears token and profile from localStorage. |
| `isAuthenticated` | `() => boolean` | Returns true if a token exists in localStorage. |

---

### 10.2 DataService

General data access for the main admin entities.

| Method | Endpoint | Description |
|---|---|---|
| `getAdminPatients` | GET `/admin/patients` | Fetch all patients |
| `getDashboardStats` | GET `/admin/stats` | Fetch aggregated dashboard statistics |
| `getRecentSessions` | GET `/admin/sessions?limit=N` | Fetch the N most recent sessions |
| `getWeeklyStats` | GET `/admin/weekly-stats` | Fetch weekly session statistics |
| `getAdminPrograms` | GET `/admin/programs` | Fetch all programs |
| `getExercises` | GET `/exercises` | Fetch all exercises |
| `createPatient` | POST `/admin/patients` | Create a new patient |
| `updatePatient` | PUT `/admin/patients/:id` | Update an existing patient |
| `deletePatient` | DELETE `/admin/patients/:id` | Delete a patient |
| `createProgram` | POST `/admin/programs` | Create a program |
| `updateProgram` | PUT `/admin/programs/:id` | Update a program |
| `deleteProgram` | DELETE `/admin/programs/:id` | Delete a program |
| `createExercise` | POST `/admin/exercises` | Create an exercise |
| `updateExercise` | PUT `/admin/exercises/:id` | Update an exercise |
| `deleteExercise` | DELETE `/admin/exercises/:id` | Delete an exercise |
| `createSession` | POST `/admin/sessions` | Create a session |
| `updateSession` | PUT `/admin/sessions/:id` | Update a session |
| `deleteSession` | DELETE `/admin/sessions/:id` | Delete a session |
| `getDoctors` | GET `/admin/doctors` | Fetch all doctors |
| `createDoctor` | POST `/admin/doctors` | Create a doctor |
| `updateDoctor` | PUT `/admin/doctors/:id` | Update a doctor |
| `deleteDoctor` | DELETE `/admin/doctors/:id` | Delete a doctor |

---

### 10.3 ExerciseRequestService

Manages exercise requests submitted by doctors.

| Method | Endpoint | Description |
|---|---|---|
| `createRequest` | POST `/exercise-requests` | Submit a new request (doctor) |
| `getMyRequests` | GET `/exercise-requests/my` | Fetch requests for the authenticated doctor |
| `getAllRequests` | GET `/exercise-requests` | Fetch all requests (admin) |
| `getRequestById` | GET `/exercise-requests/:id` | Fetch a single request |
| `updateRequestStatus` | PATCH `/exercise-requests/:id/status` | Update status with optional admin notes |

---

### 10.4 NotificationService

Manages in-app notifications.

| Method | Endpoint | Description |
|---|---|---|
| `getMyNotifications` | GET `/notifications` | Fetch paginated notifications |
| `getUnreadCount` | GET `/notifications/unread-count` | Fetch the count of unread notifications |
| `markRead` | PATCH `/notifications/:id/read` | Mark a single notification as read |
| `markAllRead` | POST `/notifications/mark-all-read` | Mark all notifications as read |

Notifications are also pushed in real time via the `notification:created` Socket.IO event.

---

### 10.5 AuditLogService

Provides read-only access to the audit trail.

| Method | Endpoint | Description |
|---|---|---|
| `getAllLogs` | GET `/audit-logs` | Fetch all audit log entries |

---

### 10.6 ExoskeletonService

Controls the physical exoskeleton hardware through the backend relay.

| Method | Endpoint | Description |
|---|---|---|
| `initSession` | POST `/sessions/:id/exo/init` | Initialize hardware for the session with a duration |
| `getState` | GET `/sessions/:id/exo/state` | Fetch current hardware state |
| `start` | POST `/sessions/:id/exo/start` | Start the session |
| `pause` | POST `/sessions/:id/exo/pause` | Pause the session |
| `resume` | POST `/sessions/:id/exo/resume` | Resume a paused session |
| `stop` | POST `/sessions/:id/exo/stop` | Stop the session gracefully |
| `emergencyStop` | POST `/sessions/:id/exo/emergency-stop` | Trigger emergency stop with optional reason |
| `setExercise` | POST `/sessions/:id/exo/exercise` | Set the active exercise on the hardware |

---

### 10.7 SocketService

**File:** `src/services/socket.ts`

A singleton class that manages a single shared Socket.IO connection used by all components in the application (except `LiveSessionView`, which manages its own dedicated connection for hardware events).

**Class: SocketService**

| Method | Description |
|---|---|
| `connect()` | Establishes a WebSocket connection to `VITE_SOCKET_URL`. Idempotent; does nothing if already connected. Supports `websocket` and `polling` transports. |
| `disconnect()` | Disconnects and nulls the socket reference. |
| `on(event, callback)` | Registers a listener for a named event. |
| `off(event, callback)` | Removes a previously registered listener. |

The service uses an internal `listeners` map to allow multiple components to subscribe to the same event independently. When a Socket.IO `onAny` event is received, all registered callbacks for that event name are called in registration order.

**Usage in App.tsx:**

The socket connects on successful authentication and disconnects on logout. The following data change events trigger a full dashboard data reload:

```
patient:created    patient:updated    patient:deleted
doctor:created     doctor:updated     doctor:deleted
session:created    session:updated    session:deleted
program:created    program:updated    program:deleted
exercise:created   exercise:updated   exercise:deleted
```

---

## 11. Data Types Reference

All types are defined in `src/types.ts`.

### Patient

```typescript
interface Patient {
  id: string;           // Formatted ID, e.g. "MC-00018"
  rawId?: number;       // Numeric database ID used for API calls
  name: string;
  avatar: string;       // URL to avatar image
  age: number;
  gender: 'Male' | 'Female' | 'Unknown';
  condition: string;    // Assigned doctor name or "Unassigned"
  program: string;      // Assigned program name or "No Program"
  lastSessionDate: string;
  lastSessionTime: string;
  status: 'Active' | 'Inactive';
  email: string;
  phone: string;
  joinDate: string;
  notes?: string;
}
```

### Doctor

```typescript
interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  created_at?: string;
}
```

### Session

```typescript
interface Session {
  id: number;
  status: SessionStatus;
  date: string;
  duration: number;
  patient_name: string;
  program_name: string;
  exo_state?: ExoSessionState;
  elapsed_seconds?: number;
}
```

### ExoSessionLiveState

```typescript
interface ExoSessionLiveState {
  session_id: number;
  state: ExoSessionState;
  motor_state: string;
  current_exercise_id: number | null;
  exercise_name: string | null;
  elapsed_seconds: number;
  countdown_remaining: number;
  total_duration_seconds?: number;
  error_code: string | null;
  updated_at: string;
}
```

### ExerciseRequest

```typescript
interface ExerciseRequest {
  id: number;
  status: ExerciseRequestStatus;
  notes: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  doctor_id?: number;
  doctor_name: string;
  doctor_email: string;
  patient_id?: number;
  patient_name: string;
  exercise_id: number;
  exercise_name: string;
  exercise_description?: string;
}
```

### AuditLog

```typescript
interface AuditLog {
  id: number;
  user_id: number | null;
  user_name: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  payload: string | null;    // JSON string of changed data
  ip: string | null;
  created_at: string;
}
```

### Notification

```typescript
interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: number;          // 0 = unread, 1 = read
  created_at: string;
}
```

### SidebarTab (union type)

```typescript
type SidebarTab =
  | 'dashboard'
  | 'patients'
  | 'doctors'
  | 'programs'
  | 'exercises'
  | 'sessions'
  | 'live-session'
  | 'exercise-requests'
  | 'progress'
  | 'analytics'
  | 'audit-logs'
  | 'support'
  | 'settings';
```

---

## 12. Real-Time Updates

The application maintains two distinct WebSocket connections:

### Global Application Socket (socketService)

- Singleton instance shared across the application.
- Connected in `App.tsx` after authentication.
- Listens to 15 data change events across patients, doctors, sessions, programs, and exercises.
- Any received event triggers `loadDashboardData()`, which re-fetches patients, dashboard stats, recent sessions, and doctors from the API.
- Also listens for `notification:created` in `DashboardView` to refresh the notification bell.

### Live Session Socket (LiveSessionView)

- Created per live session mount and destroyed on unmount.
- Connects to `http://localhost:5000` (currently hardcoded; not driven by environment variable).
- Emits `join_session` with the session ID on connect to subscribe to hardware events.
- Emits `leave_session` before disconnecting.
- Listens to `exo:state_update` and updates the hardware state display instantly.

---

## 13. State Management

The application uses React's built-in `useState` and `useEffect` hooks for all state management. There is no external state management library (no Redux, Zustand, MobX, etc.).

### Shared State in App.tsx

All shared cross-module state lives in `App.tsx` and is passed down as props:

| State Variable | Type | Purpose |
|---|---|---|
| `isAuthenticated` | `boolean` | Controls whether LoginView or the main layout is rendered |
| `activeTab` | `SidebarTab` | Controls which module component is rendered |
| `sidebarCollapsed` | `boolean` | Controls sidebar visibility |
| `activeLiveSessionId` | `number or null` | The session ID currently being controlled in live mode |
| `theme` | `'light' or 'dark'` | Active UI theme |
| `patients` | `Patient[]` | Shared patient list, populated from API |
| `recentSessions` | `RecentSession[]` | Shared recent sessions list, populated from API |
| `dashboardStats` | `object or null` | Aggregated platform statistics from API |
| `doctors` | `{id, name}[]` | Doctor ID-name pairs used in patient assignment dropdowns |
| `isLoadingData` | `boolean` | Indicates a data fetch is in progress |
| `doctor` | `{name, role, avatar}` | Admin profile displayed in sidebar and settings |
| `selectedEditPatient` | `Patient or null` | Pre-selects a patient for editing when navigating from Dashboard to Patients |

### Local State

Each view component manages its own local state for UI concerns such as modal open/close, form field values, search input, active filter tabs, pagination page, and sort order.

---

## 14. Theme System

The application supports light and dark themes using Tailwind CSS v4's dark mode class strategy.

### Mechanism

- The current theme is stored in `localStorage` under the key `mc-theme`.
- On application mount, the theme is read from `localStorage` (defaulting to `'light'`).
- A `useEffect` in `App.tsx` applies or removes the `dark` CSS class on the `<html>` element whenever the `theme` state changes.
- Tailwind generates `dark:` variant styles, which activate when `dark` is present on the root element.

### Toggling

The theme can be toggled from the Settings module. The `onThemeChange` callback in `SettingsView` updates the `theme` state in `App.tsx`, which triggers the `useEffect` to update the DOM class and `localStorage`.

---

## 15. Build and Deployment

### Production Build

```bash
npm run build
```

Vite compiles the TypeScript, bundles all modules, and outputs static assets to the `dist/` directory. The output is suitable for deployment to any static hosting service (Nginx, Apache, CDN, Firebase Hosting, Vercel, Netlify, etc.).

### Vite Configuration

**File:** `vite.config.ts`

- **Plugins**: `@vitejs/plugin-react` for JSX fast refresh, `@tailwindcss/vite` for integrated CSS processing.
- **Alias**: `@` resolves to the project root directory.
- **HMR**: Hot Module Replacement is disabled when the environment variable `DISABLE_HMR=true` is set. File watching is also disabled in that mode to reduce CPU usage.

### Previewing the Production Build

```bash
npm run build
npm run preview
```

### Cleaning Build Artifacts

```bash
npm run clean
```

---

## 16. API Endpoint Reference

All endpoints are relative to `VITE_API_URL` (default: `http://localhost:5000/api`). All endpoints except `/auth/admin/login` require the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/admin/login` | Admin login |

### Admin Resources

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Dashboard aggregated statistics |
| GET | `/admin/weekly-stats` | Weekly session statistics |
| GET | `/admin/patients` | List all patients |
| POST | `/admin/patients` | Create patient |
| PUT | `/admin/patients/:id` | Update patient |
| DELETE | `/admin/patients/:id` | Delete patient |
| GET | `/admin/doctors` | List all doctors |
| POST | `/admin/doctors` | Create doctor |
| PUT | `/admin/doctors/:id` | Update doctor |
| DELETE | `/admin/doctors/:id` | Delete doctor |
| GET | `/admin/programs` | List all programs |
| POST | `/admin/programs` | Create program |
| PUT | `/admin/programs/:id` | Update program |
| DELETE | `/admin/programs/:id` | Delete program |
| GET | `/admin/sessions` | List sessions (supports `?limit=N`) |
| POST | `/admin/sessions` | Create session |
| PUT | `/admin/sessions/:id` | Update session |
| DELETE | `/admin/sessions/:id` | Delete session |
| GET | `/admin/exercises` | List exercises (admin scoped) |
| POST | `/admin/exercises` | Create exercise |
| PUT | `/admin/exercises/:id` | Update exercise |
| DELETE | `/admin/exercises/:id` | Delete exercise |

### Shared Resources

| Method | Endpoint | Description |
|---|---|---|
| GET | `/exercises` | List all exercises (public within auth) |

### Exercise Requests

| Method | Endpoint | Description |
|---|---|---|
| GET | `/exercise-requests` | List all requests (admin) |
| POST | `/exercise-requests` | Submit new request (doctor) |
| GET | `/exercise-requests/my` | List own requests (doctor) |
| GET | `/exercise-requests/:id` | Get single request |
| PATCH | `/exercise-requests/:id/status` | Update status and admin notes |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | List notifications (supports `?limit=N`) |
| GET | `/notifications/unread-count` | Get unread count |
| PATCH | `/notifications/:id/read` | Mark one as read |
| POST | `/notifications/mark-all-read` | Mark all as read |

### Audit Logs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/audit-logs` | List all audit log entries |

### Exoskeleton Control

| Method | Endpoint | Description |
|---|---|---|
| POST | `/sessions/:id/exo/init` | Initialize hardware session |
| GET | `/sessions/:id/exo/state` | Get current hardware state |
| POST | `/sessions/:id/exo/start` | Start the session |
| POST | `/sessions/:id/exo/pause` | Pause the session |
| POST | `/sessions/:id/exo/resume` | Resume a paused session |
| POST | `/sessions/:id/exo/stop` | Stop the session |
| POST | `/sessions/:id/exo/emergency-stop` | Emergency stop |
| POST | `/sessions/:id/exo/exercise` | Set active exercise |

### WebSocket Events

| Event Direction | Event Name | Description |
|---|---|---|
| Server to Client | `patient:created` | A patient was created |
| Server to Client | `patient:updated` | A patient was updated |
| Server to Client | `patient:deleted` | A patient was deleted |
| Server to Client | `doctor:created` | A doctor was created |
| Server to Client | `doctor:updated` | A doctor was updated |
| Server to Client | `doctor:deleted` | A doctor was deleted |
| Server to Client | `session:created` | A session was created |
| Server to Client | `session:updated` | A session was updated |
| Server to Client | `session:deleted` | A session was deleted |
| Server to Client | `program:created` | A program was created |
| Server to Client | `program:updated` | A program was updated |
| Server to Client | `program:deleted` | A program was deleted |
| Server to Client | `exercise:created` | An exercise was created |
| Server to Client | `exercise:updated` | An exercise was updated |
| Server to Client | `exercise:deleted` | An exercise was deleted |
| Server to Client | `notification:created` | A new notification was pushed to the user |
| Server to Client | `exo:state_update` | Hardware state changed for an active session |
| Client to Server | `join_session` | Subscribe to hardware events for a session ID |
| Client to Server | `leave_session` | Unsubscribe from hardware events for a session ID |
