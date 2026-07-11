/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Search, Edit2, Trash2, X, Stethoscope, Mail, Calendar, Users } from 'lucide-react';
import { Doctor } from '../types';
import { DataService } from '../services/api';
import { socketService } from '../services/socket';

export default function DoctorsView() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' });
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const res = await DataService.getDoctors();
      if (res?.data) setDoctors(res.data);
    } catch (e) {
      console.error('Failed to load doctors:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  useEffect(() => {
    const handleDoctorChange = () => {
      console.log('Real-time doctor update received! Refreshing list...');
      loadDoctors();
    };

    socketService.on('doctor:created', handleDoctorChange);
    socketService.on('doctor:updated', handleDoctorChange);
    socketService.on('doctor:deleted', handleDoctorChange);

    return () => {
      socketService.off('doctor:created', handleDoctorChange);
      socketService.off('doctor:updated', handleDoctorChange);
      socketService.off('doctor:deleted', handleDoctorChange);
    };
  }, []);

  const openAddModal = () => {
    setEditingDoctor(null);
    setForm({ name: '', email: '', password: '', specialization: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setForm({ name: doc.name, email: doc.email, password: '', specialization: doc.specialization || '' });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || (!editingDoctor && !form.email.trim())) {
      setFormError('Name and email are required.');
      return;
    }
    setIsSaving(true);
    setFormError('');
    try {
      if (editingDoctor) {
        await DataService.updateDoctor(editingDoctor.id, {
          name: form.name,
          specialization: form.specialization,
        });
      } else {
        await DataService.createDoctor({
          name: form.name,
          email: form.email,
          password: form.password || 'password123',
          specialization: form.specialization,
        });
      }
      setShowModal(false);
      await loadDoctors();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Failed to save doctor.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (doc: Doctor) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doc.name}? This cannot be undone.`)) return;
    try {
      await DataService.deleteDoctor(doc.id);
      setDoctors(prev => prev.filter(d => d.id !== doc.id));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete doctor.');
    }
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avatarColors = [
    '#0e9f9f', '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
  ];

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-cyan-600" />
            Doctors
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage all registered doctors in the system
          </p>
        </div>
        <button
          onClick={openAddModal}
          id="btn-add-doctor"
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Doctors', value: doctors.length, icon: Users, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30' },
          { label: 'Active This Month', value: doctors.length, icon: Stethoscope, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
          { label: 'Specializations', value: [...new Set(doctors.map(d => d.specialization).filter(Boolean))].length, icon: UserCog, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
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
          placeholder="Search doctors…"
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
            Loading doctors…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <UserCog className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-medium">
              {searchQuery ? 'No doctors match your search.' : 'No doctors registered yet.'}
            </p>
            {!searchQuery && (
              <button onClick={openAddModal} className="mt-2 text-xs text-cyan-600 hover:underline font-medium">
                + Add the first doctor
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Doctor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specialization</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filtered.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                    {/* Avatar + Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}
                        >
                          {getInitials(doc.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{doc.name}</p>
                          <p className="text-xs text-slate-400">ID #{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {doc.email}
                      </div>
                    </td>
                    {/* Specialization */}
                    <td className="px-5 py-3.5">
                      {doc.specialization ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold rounded-full">
                          <Stethoscope className="w-3 h-3" />
                          {doc.specialization}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {doc.created_at
                          ? new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(doc)}
                          title="Edit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                  <UserCog className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {formError && (
                <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Dr. John Smith"
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200"
                />
              </div>

              {!editingDoctor && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="doctor@motioncare.io"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                      Password <span className="text-slate-400 font-normal">(default: password123)</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Leave blank for default"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Specialization</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                  placeholder="e.g. Physiotherapy, Orthopedics…"
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400/40 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 px-5 pb-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors disabled:opacity-60"
              >
                {isSaving ? 'Saving…' : editingDoctor ? 'Save Changes' : 'Add Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
