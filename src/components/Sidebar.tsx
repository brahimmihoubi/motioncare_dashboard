/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Briefcase,
  Activity,
  Calendar,
  TrendingUp,
  BarChart2,
  LifeBuoy,
  Settings,
  ChevronDown,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { SidebarTab } from '../types';
import motionCareLogo from '../assets/MotionCare_logo.png';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  doctorName: string;
  doctorRole: string;
  doctorAvatar: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  doctorName,
  doctorRole,
  doctorAvatar,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as SidebarTab, label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'patients'  as SidebarTab, label: 'Patients',       icon: Users },
    { id: 'doctors'   as SidebarTab, label: 'Doctors',        icon: UserCog },
    { id: 'programs'  as SidebarTab, label: 'Programs',       icon: Briefcase },
    { id: 'exercises' as SidebarTab, label: 'Exercises',      icon: Activity },
    { id: 'sessions'  as SidebarTab, label: 'Sessions',       icon: Calendar },
    { id: 'progress'  as SidebarTab, label: 'Progress',       icon: TrendingUp },
    { id: 'analytics' as SidebarTab, label: 'Analytics',      icon: BarChart2 },
    { id: 'support'   as SidebarTab, label: 'Support Center', icon: LifeBuoy },
    { id: 'settings'  as SidebarTab, label: 'Settings',       icon: Settings },
  ];

  return (
    <aside
      className={`
        bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700
        flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-10
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed ? 'w-0 border-r-0' : 'w-64'}
      `}
    >
      {/* ── Brand Header ── */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between gap-2 shrink-0">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-slate-100">
          <img
            src={motionCareLogo}
            alt="MotionCare"
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Close / hide button inside the sidebar */}
        <button
          onClick={onToggleCollapse}
          title="Hide sidebar"
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-700 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-200 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-2 space-y-0.5 py-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-cyan-50/70 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm border border-cyan-100/40 dark:border-cyan-700/30 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 dark:text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* ── Doctor Profile Footer ── */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-700 relative shrink-0">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700/50 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
            <img
              src={doctorAvatar}
              alt={doctorName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-sm shrink-0"
            />
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{doctorName}</div>
              <div className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-xs truncate font-medium">{doctorRole}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {profileOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-50 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Clinical Workspace</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">{doctorName}</p>
            </div>
            <button
              onClick={() => { setProfileOpen(false); setActiveTab('settings'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              My Profile
            </button>
            <button
              onClick={() => { setProfileOpen(false); alert('Sign out simulated successfully!'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
