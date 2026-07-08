/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PatientsView from './components/PatientsView';
import ExercisesView from './components/ExercisesView';
import ProgramsView from './components/ProgramsView';
import SessionsView from './components/SessionsView';
import AnalyticsView from './components/AnalyticsView';
import SupportCenterView from './components/SupportCenterView';
import SettingsView from './components/SettingsView';
import { SidebarTab, Patient, ScheduleItem } from './types';
import { INITIAL_PATIENTS, INITIAL_SCHEDULE, INITIAL_RECENT_SESSIONS } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Theme state: 'light' | 'dark' — default is 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('mc-theme') as 'light' | 'dark') || 'light';
  });

  // Apply / remove 'dark' class on <html> whenever theme changes
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('mc-theme', theme);
  }, [theme]);

  // Shared Central State
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [recentSessions, setRecentSessions] = useState(INITIAL_RECENT_SESSIONS);

  // Doctor credentials state
  const [doctor, setDoctor] = useState({
    name: 'Teacher Serine',
    role: 'Teacher',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120&h=120'
  });

  // Patient detailed view callback helper
  const [selectedEditPatient, setSelectedEditPatient] = useState<Patient | null>(null);

  // --- CRUD Callback Handlers ---
  
  // Add Patient
  const handleAddPatient = (newPatient: Omit<Patient, 'id'>) => {
    const nextIdNumber = patients.length > 0 
      ? Math.max(...patients.map(p => parseInt(p.id.replace('MC-', '')) || 0)) + 1 
      : 18;
    const padId = String(nextIdNumber).padStart(5, '0');
    const fullPatient: Patient = {
      ...newPatient,
      id: `MC-${padId}`
    };

    setPatients([fullPatient, ...patients]);

    // Also add a quick recent session log placeholder
    setRecentSessions([
      {
        id: `RS-${Date.now()}`,
        patientName: fullPatient.name,
        patientAvatar: fullPatient.avatar,
        programName: fullPatient.program,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: 'Pending',
        status: 'Checked'
      },
      ...recentSessions
    ]);
  };

  // Update Patient
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
    
    // Propagate rename to schedules or sessions
    setSchedule(
      schedule.map((s) => 
        s.patientId === updatedPatient.id 
          ? { ...s, patientName: updatedPatient.name, patientAvatar: updatedPatient.avatar } 
          : s
      )
    );
  };

  // Delete Patient
  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id));
    // Also remove any booked sessions for them
    setSchedule(schedule.filter((s) => s.patientId !== id));
  };

  // Add Schedule slot
  const handleAddSchedule = (newSlot: Omit<ScheduleItem, 'id'>) => {
    const fullSlot: ScheduleItem = {
      ...newSlot,
      id: `S-${Date.now()}`
    };
    setSchedule([...schedule, fullSlot]);
  };

  // Delete Schedule slot
  const handleDeleteSchedule = (id: string) => {
    setSchedule(schedule.filter((s) => s.id !== id));
  };

  // Doctor modification
  const handleUpdateDoctor = (name: string, role: string, avatar: string) => {
    setDoctor({ name, role, avatar });
  };

  // Modal routing help
  const triggerEditFlow = (patient: Patient) => {
    setSelectedEditPatient(patient);
    setActiveTab('patients');
  };

  const triggerViewFlow = (patient: Patient) => {
    setSelectedEditPatient(patient);
    setActiveTab('patients');
  };

  return (
    <div className="flex bg-slate-50/50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-300">
      {/* Interactive Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedEditPatient(null);
        }}
        doctorName={doctor.name}
        doctorRole={doctor.role}
        doctorAvatar={doctor.avatar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Floating Menu Button (visible when sidebar is hidden) */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        title="Show sidebar"
        className={`fixed top-6 left-6 z-50 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md rounded-xl text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 cursor-pointer ${
          sidebarCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
        }`}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content Workspace viewport */}
      <main className={`flex-1 overflow-y-auto h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : ''}`}>
        {activeTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            schedule={schedule}
            recentSessions={recentSessions}
            doctorName={doctor.name}
            onAddPatientClick={() => setActiveTab('patients')}
            onAddScheduleClick={() => setActiveTab('sessions')}
            onViewPatient={triggerViewFlow}
            onEditPatient={triggerEditFlow}
            onDeletePatient={handleDeletePatient}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'patients' && (
          <PatientsView
            patients={patients}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {activeTab === 'programs' && <ProgramsView />}

        {activeTab === 'exercises' && <ExercisesView />}

        {activeTab === 'sessions' && (
          <SessionsView
            schedule={schedule}
            patients={patients}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}

        {(activeTab === 'progress' || activeTab === 'analytics') && <AnalyticsView />}

        {activeTab === 'support' && <SupportCenterView />}

        {activeTab === 'settings' && (
          <SettingsView
            doctorName={doctor.name}
            doctorRole={doctor.role}
            doctorAvatar={doctor.avatar}
            onUpdateDoctor={handleUpdateDoctor}
            theme={theme}
            onThemeChange={(t) => setTheme(t as 'light' | 'dark')}
          />
        )}
      </main>
    </div>
  );
}
