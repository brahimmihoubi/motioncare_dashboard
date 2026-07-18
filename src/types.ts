/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatusType = 'Active' | 'Inactive';

export interface Patient {
  id: string; // e.g. MC-00018
  name: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female' | 'Unknown';
  condition: string;
  program: string;
  lastSessionDate: string;
  lastSessionTime: string;
  status: StatusType;
  email: string;
  phone: string;
  joinDate: string;
  notes?: string;
  rawId?: number;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  created_at?: string;
}

export interface ScheduleItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  timeRange: string;
  program: string;
  status: 'Session' | 'In Progress' | 'Completed';
}

export interface RecentSession {
  id: string;
  patientName: string;
  patientAvatar: string;
  programName: string;
  date: string;
  time: string;
  status: 'Checked' | 'Crossed';
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  subtitle?: string;
}

// SRS Exercise Request types
export type ExerciseRequestStatus = 'pending' | 'under_review' | 'accepted' | 'rejected' | 'delivered';

export interface ExerciseRequest {
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

// SRS Notification types
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  type: NotificationType;
  read: number; // 0 | 1
  created_at: string;
}

// SRS Audit Log types
export interface AuditLog {
  id: number;
  user_id: number | null;
  user_name: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  payload: string | null;
  ip: string | null;
  created_at: string;
}

// SRS Exoskeleton Session types
export type ExoSessionState =
  | 'pending'
  | 'countdown'
  | 'running'
  | 'paused'
  | 'stopped'
  | 'completed'
  | 'emergency_stop';

export interface ExoSessionLiveState {
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

// Session (full SRS statuses)
export type SessionStatus =
  | 'pending'
  | 'countdown'
  | 'running'
  | 'paused'
  | 'stopped'
  | 'completed'
  | 'missed'
  | 'emergency_stop';

export interface Session {
  id: number;
  status: SessionStatus;
  date: string;
  duration: number;
  patient_name: string;
  program_name: string;
  exo_state?: ExoSessionState;
  elapsed_seconds?: number;
}

export type SidebarTab =
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

export type UserRole = 'admin' | 'doctor';
