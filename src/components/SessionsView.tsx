/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, XCircle, Clock, Trash2, X, User, Search } from 'lucide-react';
import { DataService } from '../services/api';
import { socketService } from '../services/socket';

export default function SessionsView() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [form, setForm] = useState({ patient_id: '', program_id: '', status: 'completed', duration: '30' });
  const [isSaving, setIsSaving] = useState(false);

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const [sessRes, patRes, progRes] = await Promise.all([
        DataService.getRecentSessions(200).catch(() => ({ data: [] })),
        DataService.getAdminPatients().catch(() => ({ data: [] })),
        DataService.getAdminPrograms().catch(() => ({ data: [] })),
      ]);
      if (sessRes?.data) setSessions(sessRes.data);
      if (patRes?.data) setPatients(patRes.data);
      if (progRes?.data) setPrograms(progRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const handleSessionChange = () => {
      console.log('Real-time session update received! Refreshing list...');
      loadAll();
    };

    socketService.on('session:created', handleSessionChange);
    socketService.on('session:updated', handleSessionChange);
    socketService.on('session:deleted', handleSessionChange);

    return () => {
      socketService.off('session:created', handleSessionChange);
      socketService.off('session:updated', handleSessionChange);
      socketService.off('session:deleted', handleSessionChange);
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient_id || !form.program_id) {
      alert('Please select a patient and a program.');
      return;
    }
    setIsSaving(true);
    try {
      await DataService.createSession({
        patient_id: parseInt(form.patient_id),
        program_id: parseInt(form.program_id),
        status: form.status,
        duration: parseInt(form.duration) || 30,
      });
      setIsAddOpen(false);
      setForm({ patient_id: '', program_id: '', status: 'completed', duration: '30' });
      await loadAll();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to create session.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this session?')) return;
    try {
      await DataService.deleteSession(id);
      setSessions(prev => prev.filter((s: any) => s.id !== id));
    } catch (e) {
      alert('Failed to delete session.');
    }
  };

  const filtered = sessions.filter((s: any) =>
    (s.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.programName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig: Record<string, { label: string; icon: any; classes: string }> = {
    completed: { label: 'Completed', icon: CheckCircle, classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    missed: { label: 'Missed', icon: XCircle, classes: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300' },
    pending: { label: 'Pending', icon: Clock, classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  };

  const completedCount = sessions.filter((s: any) => s.status === 'completed').length;
  const missedCount = sessions.filter((s: any) => s.status === 'missed').length;
  const pendingCount = sessions.filter((s: any) => s.status === 'pending').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600" />
            Sessions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            All therapy sessions recorded across the system
          </p>
        </div>
        <button onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          Log Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: sessions.length, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30', icon: Calendar },
          { label: 'Completed', value: completedCount, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30', icon: CheckCircle },
          { label: 'Missed', value: missedCount, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30', icon: XCircle },
          { label: 'Pending', value: pendingCount, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', icon: Clock },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by patient, program, status…" value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading sessions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-medium">{searchQuery ? 'No sessions match.' : 'No sessions recorded yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((s: any) => {
                  const cfg = statusConfig[s.status] || statusConfig.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-100">{s.patientName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{s.programName || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${cfg.classes}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                        {s.duration ? `${s.duration} min` : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {s.date ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleDelete(s.id)} title="Delete"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Log a Session</h2>
              <button onClick={() => setIsAddOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Patient *</label>
                <select required value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200">
                  <option value="">Select patient…</option>
                  {patients.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Program *</label>
                <select required value={form.program_id} onChange={e => setForm(f => ({ ...f, program_id: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200">
                  <option value="">Select program…</option>
                  {programs.map((p: any) => <option key={p.id} value={p.id}>{p.name} {p.patientName ? `(${p.patientName})` : ''}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200">
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Duration (min)</label>
                  <input type="number" min="1" max="300" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors disabled:opacity-60">
                  {isSaving ? 'Saving…' : 'Log Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
