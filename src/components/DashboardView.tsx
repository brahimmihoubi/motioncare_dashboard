/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Bell,
  CalendarDays,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Clock,
  ChevronDown,
  Eye,
  Edit,
  MoreVertical,
  Plus,
  Filter,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Info
} from 'lucide-react';
import { Patient, ScheduleItem, RecentSession, SidebarTab, Notification } from '../types';
import { NotificationService } from '../services/api';
import { socketService } from '../services/socket';

interface DashboardViewProps {
  patients: Patient[];
  schedule: ScheduleItem[];
  recentSessions: RecentSession[];
  doctorName: string;
  dashboardStats: {
    totalPatients: number;
    totalSessions: number;
    completedSessions: number;
    missedSessions: number;
    complianceRate: number;
    totalDoctors: number;
  } | null;
  isLoadingData?: boolean;
  onAddPatientClick: () => void;
  onAddScheduleClick: () => void;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onNavigateTab: (tab: SidebarTab) => void;
}

export default function DashboardView({
  patients,
  schedule,
  recentSessions,
  dashboardStats,
  isLoadingData = false,
  doctorName,
  onAddPatientClick,
  onAddScheduleClick,
  onViewPatient,
  onEditPatient,
  onDeletePatient,
  onNavigateTab
}: DashboardViewProps) {
  // Local states for search/filter in the bottom table
  const [patientSearch, setPatientSearch] = useState('');
  const [patientTab, setPatientTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Global search input state
  const [globalSearch, setGlobalSearch] = useState('');

  // Dropdowns & Notifications
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        NotificationService.getMyNotifications({ limit: 5 }),
        NotificationService.getUnreadCount()
      ]);
      setNotifications(notifsRes?.data?.rows || []);
      setUnreadCount(countRes?.data?.count || 0);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  React.useEffect(() => {
    loadNotifications();

    const handleNewNotification = () => {
      loadNotifications();
    };

    socketService.on('notification:created', handleNewNotification);
    return () => {
      socketService.off('notification:created', handleNewNotification);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllRead();
      loadNotifications();
    } catch (e) {}
  };

  // SVG Line Chart interactive hover day
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);

  // Weekly Completion Chart Data
  const weeklyData = [
    { day: 'Mon', completed: 20, missed: 2 },
    { day: 'Tue', completed: 28, missed: 4 },
    { day: 'Wed', completed: 32, missed: 3 },
    { day: 'Thu', completed: 29, missed: 4 },
    { day: 'Fri', completed: 34, missed: 3 },
    { day: 'Sat', completed: 31, missed: 4 },
    { day: 'Sun', completed: 33, missed: 3 }
  ];

  // Exercises breakdown data
  const exerciseData = [
    { name: 'Lying Leg Raises', count: 32, percentage: 25, color: '#3b82f6' },
    { name: 'Heel Slide', count: 29, percentage: 23, color: '#10b981' },
    { name: 'Leg Curl', count: 31, percentage: 24, color: '#f59e0b' },
    { name: 'Seated Knee Flexion-Extension', count: 36, percentage: 28, color: '#a855f7' }
  ];

  // Interactive line coordinates calculation for the custom SVG chart
  const paddingX = 40;
  const paddingY = 30;
  const width = 360;
  const height = 150;
  const pointsCount = weeklyData.length;

  const getCoordinates = (value: number, index: number, isMissed = false) => {
    // scale 0 to 40
    const maxVal = 40;
    const x = paddingX + (index / (pointsCount - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (value / maxVal) * (height - paddingY * 2);
    return { x, y };
  };

  const completedPath = useMemo(() => {
    return weeklyData
      .map((d, i) => {
        const { x, y } = getCoordinates(d.completed, i);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, []);

  const missedPath = useMemo(() => {
    return weeklyData
      .map((d, i) => {
        const { x, y } = getCoordinates(d.missed, i, true);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, []);

  // Filter bottom Patient list
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesTab = patientTab === 'All' || p.status === patientTab;
      const matchesSearch =
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.condition.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.program.toLowerCase().includes(patientSearch.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [patients, patientTab, patientSearch]);

  // Paginated patients for table
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;

  // Active counts
  const activeCount = patients.filter((p) => p.status === 'Active').length;
  const inactiveCount = patients.filter((p) => p.status === 'Inactive').length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 select-none">
      {/* 1. Header with Title & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back, {doctorName} 👋</p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-4.5 w-full md:w-auto">
          {/* Global search */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients, programs..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setPatientSearch(e.target.value); // Syncs to patient table search
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:border-slate-600 focus:border-cyan-500 rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium shadow-2xs"
            />
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotifsOpen(!notifsOpen)}
              className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-xl shadow-2xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-all relative cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifsOpen && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="text-[10px] text-cyan-600 font-bold uppercase cursor-pointer hover:underline" onClick={handleMarkAllRead}>Mark all read</button>
                  )}
                </div>
                <div className="space-y-1 py-1 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-lg text-xs font-semibold transition-colors ${n.read ? 'text-slate-600 hover:bg-slate-50' : 'bg-cyan-50 text-slate-800'}`}>
                        <p className={n.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}>{n.title}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{n.body}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date Widget */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-2xs text-xs font-bold text-slate-600 dark:text-slate-300 cursor-default">
            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
            <span>May 12, 2024</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metrics Grid (6 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 - Total Patients (real) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-tight">Total Patients</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isLoadingData ? <span className="animate-pulse text-slate-300">...</span> : (dashboardStats?.totalPatients ?? patients.length)}
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-0.5">
              <span>{dashboardStats ? `${dashboardStats.totalDoctors} doctor(s)` : 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Metric 2 - Total Sessions (real) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-tight">Total Sessions</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isLoadingData ? <span className="animate-pulse text-slate-300">...</span> : (dashboardStats?.totalSessions ?? '—')}
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-0.5">
              <span>All time</span>
            </div>
          </div>
        </div>

        {/* Metric 3 - Completed Sessions (real) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-tight">Completed</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isLoadingData ? <span className="animate-pulse text-slate-300">...</span> : (dashboardStats?.completedSessions ?? '—')}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <span>{dashboardStats && dashboardStats.totalSessions > 0 ? `${((dashboardStats.completedSessions / dashboardStats.totalSessions) * 100).toFixed(0)}% rate` : 'No data'}</span>
            </div>
          </div>
        </div>

        {/* Metric 4 - Missed Sessions (real) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-tight">Missed</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isLoadingData ? <span className="animate-pulse text-slate-300">...</span> : (dashboardStats?.missedSessions ?? '—')}
            </div>
            <div className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-0.5">
              <span>{dashboardStats && dashboardStats.totalSessions > 0 ? `${((dashboardStats.missedSessions / dashboardStats.totalSessions) * 100).toFixed(0)}% of total` : 'No data'}</span>
            </div>
          </div>
        </div>

        {/* Metric 5 - Compliance Rate (real) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-tight">Compliance</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isLoadingData ? <span className="animate-pulse text-slate-300">...</span> : (dashboardStats ? `${dashboardStats.complianceRate}%` : '—')}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <span>Overall rate</span>
            </div>
          </div>
        </div>

        {/* Metric 6 - Active Patients */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-tight">Active Patients</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {isLoadingData ? <span className="animate-pulse text-slate-300">...</span> : patients.filter(p => p.status === 'Active').length}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <span>in the system</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: SVG line chart, Completion Donut, Exercise breakdown, and Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* A. Weekly Completion Overview Line Chart (2 cols width) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-2xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Weekly Completion Overview</h2>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                Completed
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                Missed
              </div>
            </div>
          </div>

          {/* Line Chart Area */}
          <div className="relative pt-2 h-44 flex items-center justify-center">
            {/* SVG line graph */}
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              {[0, 10, 20, 30, 40].map((val) => {
                const scaledY = height - paddingY - (val / 40) * (height - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={scaledY}
                      x2={width - paddingX}
                      y2={scaledY}
                      className="stroke-slate-100 dark:stroke-slate-700"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={scaledY + 3}
                      textAnchor="end"
                      className="fill-slate-400 dark:fill-slate-500"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical line highlight on hover */}
              {hoveredDayIdx !== null && (
                <line
                  x1={getCoordinates(0, hoveredDayIdx).x}
                  y1={paddingY}
                  x2={getCoordinates(0, hoveredDayIdx).x}
                  y2={height - paddingY}
                  className="stroke-slate-200 dark:stroke-slate-600"
                  strokeWidth="1.5"
                  strokeDasharray="4"
                />
              )}

              {/* X axis labels */}
              {weeklyData.map((d, i) => {
                const { x } = getCoordinates(0, i);
                return (
                  <text
                    key={i}
                    x={x}
                    y={height - paddingY + 16}
                    textAnchor="middle"
                    className="fill-slate-400 dark:fill-slate-500"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {d.day}
                  </text>
                );
              })}

              {/* Completed Line Plot (Teal) */}
              <path
                d={completedPath}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Missed Line Plot (Red) */}
              <path
                d={missedPath}
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Areas */}
              {weeklyData.map((d, i) => {
                const compCoord = getCoordinates(d.completed, i);
                const missCoord = getCoordinates(d.missed, i, true);
                const xPos = paddingX + (i / (pointsCount - 1)) * (width - paddingX * 2);
                return (
                  <g key={i}>
                    {/* Circle indicators for Completed */}
                    <circle
                      cx={compCoord.x}
                      cy={compCoord.y}
                      r={hoveredDayIdx === i ? "5" : "3"}
                      fill="#14b8a6"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="transition-all"
                    />

                    {/* Circle indicators for Missed */}
                    <circle
                      cx={missCoord.x}
                      cy={missCoord.y}
                      r={hoveredDayIdx === i ? "5" : "3"}
                      fill="#f87171"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="transition-all"
                    />

                    {/* Full Height Invisible Hover Slices */}
                    <rect
                      x={xPos - 15}
                      y={0}
                      width={30}
                      height={height}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDayIdx(i)}
                      onMouseLeave={() => setHoveredDayIdx(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Floating Day Tooltip */}
            {hoveredDayIdx !== null && (
              <div
                className="absolute bg-slate-900/95 text-white text-[10px] rounded-xl px-3 py-2 shadow-md space-y-0.5 border border-slate-800 z-10 pointer-events-none transition-all duration-75 animate-in fade-in"
                style={{
                  left: `${((getCoordinates(0, hoveredDayIdx).x - paddingX) / (width - paddingX * 2)) * 80 + 10}%`,
                  bottom: '50px'
                }}
              >
                <div className="font-bold text-slate-300">{weeklyData[hoveredDayIdx].day}</div>
                <div className="text-teal-400 font-semibold flex items-center gap-1">Completed: <span className="font-bold">{weeklyData[hoveredDayIdx].completed}</span></div>
                <div className="text-red-400 font-semibold flex items-center gap-1">Missed: <span className="font-bold">{weeklyData[hoveredDayIdx].missed}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* B. Completion Rate Donut Widget */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Completion Rate</h2>

          <div className="flex flex-col items-center justify-center space-y-3.5 flex-1 pt-1">
            {/* Circular Donut ring */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-slate-50"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-cyan-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - (dashboardStats ? dashboardStats.complianceRate / 100 : 0))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {dashboardStats ? `${dashboardStats.complianceRate}%` : '—'}
                </div>
              </div>
            </div>

            <div className="text-slate-500 font-bold text-[10px] text-center">
              {dashboardStats && dashboardStats.totalSessions > 0 ? `${dashboardStats.completedSessions} of ${dashboardStats.totalSessions} sessions` : 'No sessions yet'}
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-50">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" />Completed</span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{dashboardStats ? `${dashboardStats.complianceRate}%` : '—'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />Missed</span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{dashboardStats ? `${(100 - dashboardStats.complianceRate).toFixed(2)}%` : '—'}</span>
            </div>
          </div>
        </div>

        {/* C. Sessions by Exercise Donut & Legend */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Sessions by Exercise</h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 flex-1 pt-1">
            {/* Interactive Donut */}
            <div className="relative w-26 h-26 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="52" cy="52" r="38" className="stroke-slate-50" strokeWidth="6" fill="transparent" />
                {/* 25% Blue */}
                <circle
                  cx="52"
                  cy="52"
                  r="38"
                  className="stroke-blue-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.25)}
                />
                {/* 23% Green (Starts after Blue) */}
                <circle
                  cx="52"
                  cy="52"
                  r="38"
                  className="stroke-emerald-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.23)}
                  transform="rotate(90, 52, 52)"
                />
                {/* 24% Yellow */}
                <circle
                  cx="52"
                  cy="52"
                  r="38"
                  className="stroke-amber-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.24)}
                  transform="rotate(172.8, 52, 52)"
                />
                {/* 28% Purple */}
                <circle
                  cx="52"
                  cy="52"
                  r="38"
                  className="stroke-purple-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.28)}
                  transform="rotate(259.2, 52, 52)"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</div>
                <div className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">128</div>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-1.5 w-full flex-1">
              {exerciseData.map((ex) => (
                <div key={ex.name} className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ex.color }} />
                    <span className="truncate" title={ex.name}>{ex.name}</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-bold ml-1.5 shrink-0">{ex.count} ({ex.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Today's Schedule, Patients Table, Recent Sessions & Help Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* A. Today's Schedule (takes 1 col) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-2xs space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Today's Schedule</h2>
            <button
              onClick={() => onNavigateTab('sessions')}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.patientAvatar}
                    alt={item.patientName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 shrink-0 shadow-3xs"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{item.patientName}</h3>
                    <div className="text-[10px] text-slate-400 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
                      <span>{item.timeRange}</span>
                      <span>•</span>
                      <span className="text-cyan-600 truncate">{item.program}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Starting therapy session for ${item.patientName}! Launching Tele-Rehab panel.`);
                    onNavigateTab('exercises');
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white rounded-lg text-[10px] font-bold transition-all shadow-3xs cursor-pointer"
                >
                  Session
                </button>
              </div>
            ))}
          </div>

          {/* Add Session Trigger Button */}
          <button
            onClick={onAddScheduleClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-50/60 hover:bg-cyan-100/60 text-cyan-700 hover:text-cyan-800 border border-cyan-100/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Session
          </button>
        </div>

        {/* B. Patients Table (takes 2 cols) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xs lg:col-span-2 overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Patients</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Clinical Registry</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Tab filters inside Table */}
              <div className="flex bg-slate-50 dark:bg-slate-700/50 p-1 rounded-lg border border-slate-100 dark:border-slate-700">
                {(['All', 'Active', 'Inactive'] as const).map((tab) => {
                  const count = tab === 'All'
                    ? patients.length
                    : tab === 'Active' ? activeCount : inactiveCount;
                  const isActive = patientTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setPatientTab(tab);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        isActive ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-3xs' : 'text-slate-400 hover:text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Add Patient */}
              <button
                onClick={onAddPatientClick}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-[10px] font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Patient
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Age / Gender</th>
                  <th className="px-5 py-3">Condition</th>
                  <th className="px-5 py-3">Program</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 dark:text-slate-200 text-xs">
                {paginatedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      No patients match filters
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 shadow-3xs shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100 hover:text-cyan-600 cursor-pointer" onClick={() => onViewPatient(patient)}>
                              {patient.name}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">{patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">
                        {patient.age} years / {patient.gender}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {patient.condition}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-400 truncate max-w-[120px]" title={patient.program}>
                        {patient.program}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          patient.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View Patient Details"
                            onClick={() => onViewPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Edit Patient"
                            onClick={() => onEditPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete Patient"
                            onClick={() => {
                              if (confirm(`Delete patient ${patient.name}?`)) {
                                onDeletePatient(patient.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between p-4.5 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
            <div>
              Showing {Math.min(filteredPatients.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
              {Math.min(filteredPatients.length, currentPage * itemsPerPage)} of {filteredPatients.length} patients
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-6 h-6 rounded-md font-bold text-[9px] transition-all ${
                    currentPage === idx + 1
                      ? 'bg-cyan-600 text-white shadow-3xs'
                      : 'border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* C. Recent Sessions & Help Banner Panel (takes 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Sessions List */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Sessions</h2>
              <button
                onClick={() => onNavigateTab('sessions')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {recentSessions.slice(0, 5).map((session) => {
                const isChecked = session.status === 'Checked';
                return (
                  <div key={session.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={session.patientAvatar}
                        alt={session.patientName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 shadow-3xs shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{session.patientName}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold truncate leading-normal">
                          {session.programName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                          {session.date.replace(', 2024', '')}
                        </div>
                        <div className="text-[9px] text-slate-400 font-semibold">{session.time}</div>
                      </div>

                      {isChecked ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-3xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shadow-3xs">
                          <X className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Center Callout Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-cyan-50 rounded-full translate-x-4 translate-y-4 -z-0" />

            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-cyan-50/60 border border-cyan-100/50 flex items-center justify-center text-cyan-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Support Center</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                  Need help? Our system specialists are here to configure range angles.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('support')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-all relative z-10 shadow-3xs cursor-pointer text-center"
            >
              Go to Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
