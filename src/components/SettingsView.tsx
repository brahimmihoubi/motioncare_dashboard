/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Bell, Shield, Save, CheckCircle2, Sun, Moon } from 'lucide-react';

interface SettingsViewProps {
  doctorName: string;
  doctorRole: string;
  doctorAvatar: string;
  onUpdateDoctor: (name: string, role: string, avatar: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function SettingsView({
  doctorName,
  doctorRole,
  doctorAvatar,
  onUpdateDoctor,
  theme,
  onThemeChange,
}: SettingsViewProps) {
  const [name, setName] = useState(doctorName);
  const [role, setRole] = useState(doctorRole);
  const [avatar, setAvatar] = useState(doctorAvatar);
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    sessionAlert: true,
    newPatient: true,
    weeklyReport: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDoctor(name, role, avatar);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isDark = theme === 'dark';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Clinical Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure your therapist profile, workspace thresholds, and data alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation panel */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-4 space-y-1.5 h-fit md:col-span-1">
          <div className="px-3 py-2 text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Settings Group</div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100/50 dark:border-cyan-700/40 text-cyan-800 dark:text-cyan-300 rounded-xl font-semibold text-xs text-left">
            <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Therapist Profile
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-300 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-xs text-left">
            <Bell className="w-4 h-4 text-slate-400" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-300 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-xs text-left">
            <Shield className="w-4 h-4 text-slate-400" />
            Security &amp; HIPAA
          </button>
        </div>

        {/* Content Workspace */}
        <div className="md:col-span-2 space-y-6">

          {/* ── Appearance ── */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Appearance</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-0.5">
                  Currently using <span className="font-semibold text-slate-600 dark:text-slate-300">{isDark ? 'Dark' : 'Light'}</span> theme
                </p>
              </div>

              {/* Toggle button */}
              <button
                type="button"
                onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-sm border cursor-pointer
                  ${isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    Switch to Light
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Switch to Dark
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Therapist Profile & Notifications ── */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <User className="w-4 h-4 text-cyan-500" />
              My Therapist Credentials
            </h2>

            {saved && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Clinician credentials saved successfully!
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={avatar}
                  alt="Therapist Profile"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-sm shrink-0"
                />
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Clinician Avatar URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 transition-all font-mono bg-white dark:bg-slate-800 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 transition-all font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Specialization / Role *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 transition-all font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 dark:bg-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notification Subscriptions
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'sessionAlert' as const, label: 'Therapy Session Alerts', desc: 'Receive sounds when a tele-rehab slot is due in 5 mins' },
                  { key: 'newPatient' as const, label: 'Patient Enrollment Notices', desc: 'Get logs when a new patient registers through external portal' },
                  { key: 'weeklyReport' as const, label: 'Weekly Clinical Performance Analytics', desc: 'Receive summary reports of completion rate overviews' },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors">
                    <div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400">{desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifs[key]}
                      onChange={(e) => setNotifs({ ...notifs, [key]: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
