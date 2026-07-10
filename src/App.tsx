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
import { SidebarTab, Patient, ScheduleItem, RecentSession } from './types';
import LoginView from './components/LoginView';
import { AuthService, DataService } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AuthService.isAuthenticated());
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

  // Shared Central State — start empty, fill from API
  const [patients, setPatients] = useState<Patient[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [dashboardStats, setDashboardStats] = useState<{
    totalPatients: number;
    totalSessions: number;
    completedSessions: number;
    missedSessions: number;
    complianceRate: number;
    totalDoctors: number;
  } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load ALL data from API concurrently
  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoadingData(true);

    // Avatar fallbacks by index for variety
    const avatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120&h=120',
    ];

    Promise.all([
      DataService.getAdminPatients().catch(() => ({ data: [] })),
      DataService.getDashboardStats().catch(() => ({ data: null })),
      DataService.getRecentSessions(10).catch(() => ({ data: [] })),
    ]).then(([patientsRes, statsRes, sessionsRes]) => {
      // --- Map Patients ---
      const rawPatients = Array.isArray(patientsRes?.data) ? patientsRes.data : [];
      if (rawPatients.length > 0) {
        const mappedPatients: Patient[] = rawPatients.map((p: any, idx: number) => ({
          id: `MC-${String(p.id).padStart(5, '0')}`,
          name: p.name || 'Unknown Patient',
          avatar: avatars[idx % avatars.length],
          age: p.age || 0,
          gender: 'Unknown' as const,
          condition: 'General Rehab',
          program: 'Assigned Program',
          lastSessionDate: 'N/A',
          lastSessionTime: 'N/A',
          status: 'Active' as const,
          email: p.email || '',
          phone: 'N/A',
          joinDate: p.created_at
            ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString(),
          notes: p.notes || ''
        }));
        setPatients(mappedPatients);
      }

      // --- Map Stats ---
      if (statsRes?.data) {
        setDashboardStats(statsRes.data);
      }

      // --- Map Recent Sessions ---
      const rawSessions = Array.isArray(sessionsRes?.data) ? sessionsRes.data : [];
      if (rawSessions.length > 0) {
        const mappedSessions: RecentSession[] = rawSessions.map((s: any, idx: number) => ({
          id: `RS-${s.id}`,
          patientName: s.patientName || 'Unknown',
          patientAvatar: avatars[idx % avatars.length],
          programName: s.programName || 'Unknown Program',
          date: s.date
            ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
          time: s.date
            ? new Date(s.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : 'N/A',
          status: s.status === 'completed' ? 'Checked' : 'Crossed'
        }));
        setRecentSessions(mappedSessions);
      }
    }).catch(err => {
      console.error('Failed to load dashboard data:', err);
    }).finally(() => {
      setIsLoadingData(false);
    });
  }, [isAuthenticated]);

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

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  // Restore doctor profile on load if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const profileStr = localStorage.getItem('mc_admin_profile');
      if (profileStr) {
        try {
          const profile = JSON.parse(profileStr);
          setDoctor((prev) => ({ ...prev, name: profile.name || prev.name, role: profile.role || prev.role }));
        } catch (e) {}
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

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
            dashboardStats={dashboardStats}
            isLoadingData={isLoadingData}
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
        
        {/* Temporary Logout button for testing since SettingsView might not have one */}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-4xl mx-auto">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
