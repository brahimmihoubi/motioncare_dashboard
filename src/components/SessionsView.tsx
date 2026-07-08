/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, Users, CheckCircle, Video, Trash2, X, AlertCircle } from 'lucide-react';
import { Patient, ScheduleItem } from '../types';

interface SessionsViewProps {
  schedule: ScheduleItem[];
  patients: Patient[];
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  onDeleteSchedule: (id: string) => void;
}

export default function SessionsView({
  schedule,
  patients,
  onAddSchedule,
  onDeleteSchedule
}: SessionsViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    timeRange: '9:00 AM - 9:30 AM',
    program: 'Knee Rehab'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      alert('Please select a patient.');
      return;
    }
    const matchedPatient = patients.find((p) => p.id === formData.patientId);
    if (!matchedPatient) return;

    onAddSchedule({
      patientId: matchedPatient.id,
      patientName: matchedPatient.name,
      patientAvatar: matchedPatient.avatar,
      timeRange: formData.timeRange,
      program: formData.program,
      status: 'Session'
    });

    setIsAddOpen(false);
    setFormData({ patientId: '', timeRange: '9:00 AM - 9:30 AM', program: 'Knee Rehab' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Therapy Appointments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and schedule active clinical rehabilitation session slots</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Dynamic Schedule Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Upcoming Clinical Sessions Today</h2>
            <div className="space-y-3">
              {schedule.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-medium">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No sessions scheduled for today. Click "Schedule Session" above to add one.
                </div>
              ) : (
                schedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.patientAvatar}
                        alt={item.patientName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600 shadow-xs"
                      />
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.patientName}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.timeRange}
                          </span>
                          <span className="text-slate-200">•</span>
                          <span className="text-cyan-600">{item.program}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {item.status}
                      </span>
                      <button
                        title="Delete Schedule Slot"
                        onClick={() => onDeleteSchedule(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Virtual Rehabilitation Platform Info */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="p-4 bg-cyan-50/50 border border-cyan-100/50 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-cyan-800 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-cyan-600" />
              Tele-Rehab Hub
            </h3>
            <p className="text-xs text-cyan-900/80 leading-relaxed font-medium">
              Conduct secure HD video rehabilitation sessions directly through the clinical dashboard. Track joint motion angles in real-time.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduling Guidelines</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium">
              <li className="flex gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>Verify patient range of motion limits before the video call.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>Keep sessions limited to 30 mins to avoid joint muscle fatigue.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>Log final flexion degrees in the patient file immediately post-session.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Book Therapy Slot</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Select Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Scheduled Time Slot</label>
                <select
                  value={formData.timeRange}
                  onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                >
                  <option value="9:00 AM - 9:30 AM">9:00 AM - 9:30 AM</option>
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                  <option value="1:00 PM - 1:30 PM">1:00 PM - 1:30 PM</option>
                  <option value="2:00 PM - 2:30 PM">2:00 PM - 2:30 PM</option>
                  <option value="3:00 PM - 3:30 PM">3:00 PM - 3:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Program Focus</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                >
                  <option value="Knee Rehab">Knee Rehab</option>
                  <option value="Post ACL Reconstruction">Post ACL Reconstruction</option>
                  <option value="Leg Strengthening">Leg Strengthening</option>
                  <option value="Neuromuscular Rehab">Neuromuscular Rehab</option>
                  <option value="Core Stability">Core Stability</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4.5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
