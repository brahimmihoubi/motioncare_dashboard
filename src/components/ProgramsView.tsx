/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, CheckCircle, XCircle, Trash2, X, User, Activity } from 'lucide-react';
import { DataService } from '../services/api';
import { socketService } from '../services/socket';

export default function ProgramsView() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProg, setNewProg] = useState({ name: '', patient_id: '', doctor_id: '' });
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const [progRes, patRes, docRes] = await Promise.all([
        DataService.getAdminPrograms().catch(() => ({ data: [] })),
        DataService.getAdminPatients().catch(() => ({ data: [] })),
        DataService.getDoctors().catch(() => ({ data: [] })),
      ]);
      if (progRes?.data) setPrograms(progRes.data);
      if (patRes?.data) setPatients(patRes.data);
      if (docRes?.data) setDoctors(docRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const handleProgramChange = () => {
      console.log('Real-time program update received! Refreshing list...');
      loadAll();
    };

    socketService.on('program:created', handleProgramChange);
    socketService.on('program:updated', handleProgramChange);
    socketService.on('program:deleted', handleProgramChange);

    return () => {
      socketService.off('program:created', handleProgramChange);
      socketService.off('program:updated', handleProgramChange);
      socketService.off('program:deleted', handleProgramChange);
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProg.name || !newProg.patient_id || !newProg.doctor_id) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      await DataService.createProgram({
        name: newProg.name,
        patient_id: parseInt(newProg.patient_id),
        doctor_id: parseInt(newProg.doctor_id),
      });
      setIsAddOpen(false);
      setNewProg({ name: '', patient_id: '', doctor_id: '' });
      await loadAll();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to create program.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this program?')) return;
    try {
      await DataService.deleteProgram(id);
      setPrograms(prev => prev.filter((p: any) => p.id !== id));
    } catch (e) {
      alert('Failed to delete program.');
    }
  };

  const filtered = programs.filter((p: any) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-600" />
            Therapy Programs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            All rehabilitation programs created across the system
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Programs', value: programs.length, icon: Briefcase, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30' },
          { label: 'Active Programs', value: programs.filter((p: any) => p.active).length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'Inactive Programs', value: programs.filter((p: any) => !p.active).length, icon: XCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30' },
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
        <input
          type="text"
          placeholder="Search programs…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading programs…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Briefcase className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-medium">{searchQuery ? 'No programs match your search.' : 'No programs found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Exercises</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((prog: any) => (
                  <tr key={prog.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4 text-cyan-600" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{prog.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {prog.patientName || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {prog.doctorName ? `Dr. ${prog.doctorName}` : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
                        <Activity className="w-3 h-3" />
                        {prog.exerciseCount ?? 0} exercises
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {prog.active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-full">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {prog.created_at ? new Date(prog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(prog.id)} title="Delete"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
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
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Create Program</h2>
              <button onClick={() => setIsAddOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Program Name *</label>
                <input type="text" required value={newProg.name} onChange={e => setNewProg(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Knee Rehabilitation Phase 1"
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Patient *</label>
                <select required value={newProg.patient_id} onChange={e => setNewProg(f => ({ ...f, patient_id: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200">
                  <option value="">Select patient…</option>
                  {patients.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Assigned Doctor *</label>
                <select required value={newProg.doctor_id} onChange={e => setNewProg(f => ({ ...f, doctor_id: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200">
                  <option value="">Select doctor…</option>
                  {doctors.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors">
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
