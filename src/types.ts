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
  gender: 'Male' | 'Female';
  condition: string;
  program: string;
  lastSessionDate: string;
  lastSessionTime: string;
  status: StatusType;
  email: string;
  phone: string;
  joinDate: string;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  timeRange: string; // e.g. "9:00 AM - 9:30 AM"
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

export type SidebarTab =
  | 'dashboard'
  | 'patients'
  | 'programs'
  | 'exercises'
  | 'sessions'
  | 'progress'
  | 'analytics'
  | 'support'
  | 'settings';
