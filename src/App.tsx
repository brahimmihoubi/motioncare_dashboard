/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PatientsView from './components/PatientsView';
import DoctorsView from './components/DoctorsView';
import ExercisesView from './components/ExercisesView';
import ProgramsView from './components/ProgramsView';
import SessionsView from './components/SessionsView';
import AnalyticsView from './components/AnalyticsView';
import SupportCenterView from './components/SupportCenterView';
import SettingsView from './components/SettingsView';
import { SidebarTab, Patient, RecentSession } from './types';
import LoginView from './components/LoginView';
import { AuthService, DataService } from './services/api';
import { socketService } from './services/socket';

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
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [dashboardStats, setDashboardStats] = useState<{
    totalPatients: number;
    totalSessions: number;
    completedSessions: number;
    missedSessions: number;
    complianceRate: number;
    totalDoctors: number;
  } | null>(null);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadDashboardData = () => {
    if (!isAuthenticated) return;
    setIsLoadingData(true);

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
      DataService.getDoctors().catch(() => ({ data: [] }))
    ]).then(([patientsRes, statsRes, sessionsRes, doctorsRes]) => {
      if (Array.isArray(doctorsRes?.data)) {
        setDoctors(doctorsRes.data.map((d: any) => ({ id: d.id, name: d.name })));
      }
      const rawPatients = Array.isArray(patientsRes?.data) ? patientsRes.data : [];
      if (rawPatients.length > 0) {
        const mappedPatients: Patient[] = rawPatients.map((p: any, idx: number) => ({
          id: `MC-${String(p.id).padStart(5, '0')}`,
          rawId: p.id,
          name: p.name || 'Unknown Patient',
          avatar: avatars[idx % avatars.length],
          age: p.age || 0,
          gender: 'Unknown' as const,
          condition: p.doctorName ? `Dr. ${p.doctorName}` : 'Unassigned',
          program: p.programName || 'No Program',
          lastSessionDate: p.lastSessionDate
            ? new Date(p.lastSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'No sessions yet',
          lastSessionTime: p.lastSessionDate
            ? new Date(p.lastSessionDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '—',
          status: (p.lastSessionStatus === 'missed' ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
          email: p.email || '',
          phone: 'N/A',
          joinDate: p.created_at
            ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString(),
          notes: p.notes || ''
        }));
        setPatients(mappedPatients);
      }

      if (statsRes?.data) {
        setDashboardStats(statsRes.data);
      }

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
  };

  // Connect socket and listen for live updates
  useEffect(() => {
    if (!isAuthenticated) return;
    
    loadDashboardData();
    socketService.connect();

    const handleDataChanged = () => {
      console.log('Real-time update received! Refreshing dashboard data...');
      loadDashboardData();
    };

    const events = [
      'patient:created', 'patient:updated', 'patient:deleted',
      'doctor:created', 'doctor:updated', 'doctor:deleted',
      'session:created', 'session:updated', 'session:deleted',
      'program:created', 'program:updated', 'program:deleted',
      'exercise:created', 'exercise:updated', 'exercise:deleted'
    ];

    events.forEach(event => socketService.on(event, handleDataChanged));

    return () => {
      events.forEach(event => socketService.off(event, handleDataChanged));
      socketService.disconnect();
    };
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
  const handleAddPatient = async (newPatient: any) => {
    try {
      await DataService.createPatient(newPatient);
      // Refresh patients list after adding
      const patientsRes = await DataService.getAdminPatients();
      const rawPatients = Array.isArray(patientsRes?.data) ? patientsRes.data : [];
      const avatars = [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
      ];
      setPatients(rawPatients.map((p: any, idx: number) => ({
        id: `MC-${String(p.id).padStart(5, '0')}`,
        name: p.name || 'Unknown',
        avatar: avatars[idx % avatars.length],
        age: p.age || 0,
        gender: 'Unknown',
        condition: 'General Rehab',
        program: 'Assigned',
        lastSessionDate: 'N/A',
        lastSessionTime: 'N/A',
        status: 'Active',
        email: p.email || '',
        phone: 'N/A',
        joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        notes: p.notes || '',
        // store raw ID for API operations
        rawId: p.id
      })));
    } catch (e) {
      console.error(e);
      alert('Failed to add patient');
    }
  };

  // Update Patient
  const handleUpdatePatient = async (updatedPatient: any) => {
    try {
      await DataService.updatePatient(updatedPatient.rawId, updatedPatient);
      setPatients(patients.map((p: any) => (p.rawId === updatedPatient.rawId ? updatedPatient : p)));
    } catch (e) {
      console.error(e);
      alert('Failed to update patient');
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id: string) => {
    try {
      const patient = patients.find(p => p.id === id);
      if (patient?.rawId) {
        await DataService.deletePatient(patient.rawId);
      }
      setPatients(patients.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete patient');
    }
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
            schedule={[]}
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
            doctors={doctors}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {activeTab === 'doctors' && <DoctorsView />}

        {activeTab === 'programs' && <ProgramsView />}

        {activeTab === 'exercises' && <ExercisesView />}

        {activeTab === 'sessions' && <SessionsView />}

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
