/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, ScheduleItem, RecentSession } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'MC-00018',
    name: 'Youssef Ali',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    age: 8,
    gender: 'Male',
    condition: 'Post ACL Reconstruction',
    program: 'Knee Rehabilitation Program',
    lastSessionDate: 'May 12, 2024',
    lastSessionTime: '9:00 AM',
    status: 'Active',
    email: 'youssef.ali@example.com',
    phone: '+20 100 123 4567',
    joinDate: 'Jan 15, 2024',
    notes: 'Patient shows stable recovery. Target: Increase flexion range to 120 degrees.'
  },
  {
    id: 'MC-00019',
    name: 'Lina Khaled',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    age: 10,
    gender: 'Female',
    condition: 'Post ACL Reconstruction',
    program: 'Post ACL Reconstruction',
    lastSessionDate: 'May 12, 2024',
    lastSessionTime: '10:00 AM',
    status: 'Active',
    email: 'lina.khaled@example.com',
    phone: '+20 111 234 5678',
    joinDate: 'Feb 10, 2024',
    notes: 'Focus on quad activation and extension control. Slight pain reported during extension.'
  },
  {
    id: 'MC-00020',
    name: 'Adam Samy',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    age: 7,
    gender: 'Male',
    condition: 'Leg Strengthening',
    program: 'Leg Strengthening Program',
    lastSessionDate: 'May 12, 2024',
    lastSessionTime: '11:00 AM',
    status: 'Active',
    email: 'adam.samy@example.com',
    phone: '+20 122 345 6789',
    joinDate: 'Mar 05, 2024',
    notes: 'Excellent cooperation. Motor control is high. Strength metrics up by 15%.'
  },
  {
    id: 'MC-00021',
    name: 'Malak Wael',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    age: 8,
    gender: 'Female',
    condition: 'Neuromuscular Rehab',
    program: 'Neuromuscular Rehab',
    lastSessionDate: 'May 11, 2024',
    lastSessionTime: '1:00 PM',
    status: 'Active',
    email: 'malak.wael@example.com',
    phone: '+20 105 555 6789',
    joinDate: 'Apr 02, 2024',
    notes: 'Balance tracking shows steady improvements. Working on ankle stability exercises.'
  },
  {
    id: 'MC-00022',
    name: 'Omar Hossam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    age: 9,
    gender: 'Male',
    condition: 'Neuromuscular Rehab',
    program: 'Neuromuscular Rehab',
    lastSessionDate: 'May 11, 2024',
    lastSessionTime: '2:00 PM',
    status: 'Inactive',
    email: 'omar.hossam@example.com',
    phone: '+20 102 987 6543',
    joinDate: 'Jan 28, 2024',
    notes: 'Paused program due to school examinations. Resuming late May.'
  },
  {
    id: 'MC-00023',
    name: 'Jana Sherif',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120',
    age: 11,
    gender: 'Female',
    condition: 'Ankle Sprain Grade II',
    program: 'Ankle Rehab Program',
    lastSessionDate: 'May 10, 2024',
    lastSessionTime: '3:00 PM',
    status: 'Active',
    email: 'jana.sherif@example.com',
    phone: '+20 106 333 4444',
    joinDate: 'Apr 10, 2024',
    notes: 'Active ankle inversion/eversion exercises. High pain tolerance.'
  },
  {
    id: 'MC-00024',
    name: 'Kareem Ahmed',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120',
    age: 12,
    gender: 'Male',
    condition: 'Post-Fracture Wrist Stiffness',
    program: 'Wrist Mobility Clinic',
    lastSessionDate: 'May 09, 2024',
    lastSessionTime: '11:30 AM',
    status: 'Active',
    email: 'kareem.ahmed@example.com',
    phone: '+20 101 222 3333',
    joinDate: 'Mar 18, 2024',
    notes: 'Grip strength test: 18kg (R) vs 25kg (L). Progress is positive.'
  },
  {
    id: 'MC-00025',
    name: 'Hana Mahmoud',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120&h=120',
    age: 9,
    gender: 'Female',
    condition: 'Scoliosis Core Stability',
    program: 'Core Alignment Clinic',
    lastSessionDate: 'May 08, 2024',
    lastSessionTime: '4:00 PM',
    status: 'Active',
    email: 'hana.m@example.com',
    phone: '+20 109 444 5555',
    joinDate: 'Feb 22, 2024',
    notes: 'Focus on breathing patterns and symmetric core activation.'
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'S-1',
    patientId: 'MC-00018',
    patientName: 'Youssef Ali',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    timeRange: '9:00 AM - 9:30 AM',
    program: 'Knee Rehab',
    status: 'Session'
  },
  {
    id: 'S-2',
    patientId: 'MC-00019',
    patientName: 'Lina Khaled',
    patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    timeRange: '10:00 AM - 10:30 AM',
    program: 'Post ACL Reconstruction',
    status: 'Session'
  },
  {
    id: 'S-3',
    patientId: 'MC-00020',
    patientName: 'Adam Samy',
    patientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    timeRange: '11:00 AM - 11:30 AM',
    program: 'Leg Strengthening',
    status: 'Session'
  },
  {
    id: 'S-4',
    patientId: 'MC-00021',
    patientName: 'Malak Wael',
    patientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    timeRange: '1:00 PM - 1:30 PM',
    program: 'Neuromuscular Rehab',
    status: 'Session'
  }
];

export const INITIAL_RECENT_SESSIONS: RecentSession[] = [
  {
    id: 'RS-1',
    patientName: 'Youssef Ali',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    programName: 'Knee Rehabilitation',
    date: 'May 12, 2024',
    time: '9:00 AM',
    status: 'Checked'
  },
  {
    id: 'RS-2',
    patientName: 'Lina Khaled',
    patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    programName: 'Post ACL Reconstruction',
    date: 'May 12, 2024',
    time: '10:00 AM',
    status: 'Checked'
  },
  {
    id: 'RS-3',
    patientName: 'Adam Samy',
    programName: 'Leg Strengthening',
    patientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    date: 'May 12, 2024',
    time: '11:00 AM',
    status: 'Checked'
  },
  {
    id: 'RS-4',
    patientName: 'Malak Wael',
    programName: 'Neuromuscular Rehab',
    patientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    date: 'May 11, 2024',
    time: '1:00 PM',
    status: 'Checked'
  },
  {
    id: 'RS-5',
    patientName: 'Omar Hossam',
    programName: 'Neuromuscular Rehab',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    date: 'May 11, 2024',
    time: '2:00 PM',
    status: 'Crossed'
  }
];

export const EXERCISE_ITEMS = [
  {
    id: 'ex-1',
    name: 'Lying Leg Raises',
    category: 'Lower Body',
    description: 'Lie flat on your back, slowly lift your leg up keeping it straight, then lower it.',
    targetMuscles: 'Hip Flexors, Core, Quadriceps',
    sets: '3 sets of 10',
    frequency: 'Daily',
    color: '#3b82f6',
    count: 32,
    percentage: 25
  },
  {
    id: 'ex-2',
    name: 'Heel Slide',
    category: 'Knee Mobility',
    description: 'Slide your heel towards your buttocks while keeping your foot flat on the bed.',
    targetMuscles: 'Hamstrings, Knee Joint Flexors',
    sets: '3 sets of 12',
    frequency: 'Twice Daily',
    color: '#10b981',
    count: 29,
    percentage: 23
  },
  {
    id: 'ex-3',
    name: 'Leg Curl',
    category: 'Hamstring Strength',
    description: 'Lie on your stomach or stand, bend your knee to bring your heel towards your glutes.',
    targetMuscles: 'Hamstrings, Calves',
    sets: '3 sets of 15',
    frequency: 'Daily',
    color: '#f59e0b',
    count: 31,
    percentage: 24
  },
  {
    id: 'ex-4',
    name: 'Seated Knee Flexion-Extension',
    category: 'Knee Mobility',
    description: 'Sit upright on a stable chair, extend your knee fully, hold, then bend it back.',
    targetMuscles: 'Quadriceps, Knee Joint Extensors',
    sets: '4 sets of 10',
    frequency: 'Daily',
    color: '#a855f7',
    count: 36,
    percentage: 28
  }
];

export const PROGRAMS_LIST = [
  {
    id: 'prog-1',
    name: 'Knee Rehabilitation Program',
    description: 'Full post-injury or post-surgery knee joint rehabilitation focusing on flexion, extension and quad strength.',
    duration: '12 weeks',
    patientCount: 15,
    exercises: ['Lying Leg Raises', 'Heel Slide', 'Leg Curl']
  },
  {
    id: 'prog-2',
    name: 'Post ACL Reconstruction',
    description: 'Specialized physical therapy program designed for patients recovering from anterior cruciate ligament surgery.',
    duration: '24 weeks',
    patientCount: 12,
    exercises: ['Lying Leg Raises', 'Heel Slide', 'Seated Knee Flexion-Extension']
  },
  {
    id: 'prog-3',
    name: 'Leg Strengthening Program',
    description: 'Gradual hypertrophy and neuromuscular recruitment program targeting lower extremity weakness.',
    duration: '8 weeks',
    patientCount: 8,
    exercises: ['Lying Leg Raises', 'Leg Curl']
  },
  {
    id: 'prog-4',
    name: 'Neuromuscular Rehab',
    description: 'Proprioception, balance, and gait retraining for motor control and functional alignment improvement.',
    duration: '16 weeks',
    patientCount: 7,
    exercises: ['Heel Slide', 'Seated Knee Flexion-Extension']
  }
];
