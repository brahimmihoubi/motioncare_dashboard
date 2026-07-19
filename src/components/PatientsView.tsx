/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CalendarDays,
  User,
  Heart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Patient, StatusType } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  doctors?: {id: number, name: string}[];
  onAddPatient: (patient: any) => void;
  onUpdatePatient: (patient: any) => void;
  onDeletePatient: (id: string) => void;
}

export default function PatientsView({
  patients,
  doctors = [],
  onAddPatient,
  onUpdatePatient,
  onDeletePatient
}: PatientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    condition: '',
    program: '',
    status: 'Active' as StatusType,
    email: '',
    phone: '',
    notes: '',
    doctor_id: '',
    password: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Search
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.program.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  // Paginated patients
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;

  // Handle opening Add Modal
  const openAddModal = () => {
    setFormData({
      name: '',
      age: '10',
      gender: 'Male',
      condition: '',
      program: '',
      status: 'Active',
      email: '',
      phone: '',
      notes: '',
      doctor_id: doctors.length > 0 ? String(doctors[0].id) : '',
      password: 'password123' // default for admin creation
    });
    setIsAddOpen(true);
  };

  // Handle Submit Add
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.condition || !formData.program) {
      alert('Please fill in Name, Condition and Program.');
      return;
    }
    if (!formData.doctor_id) {
      alert('Please select a doctor. A doctor must be assigned to every patient.');
      return;
    }
    onAddPatient({
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      password: formData.password || 'password123',
      age: parseInt(formData.age) || 10,
      notes: formData.notes,
      doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : null
    });
    setIsAddOpen(false);
  };

  // Handle opening Edit Modal
  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      condition: patient.condition,
      program: patient.program,
      status: patient.status,
      email: patient.email,
      phone: patient.phone,
      notes: patient.notes || '',
      doctor_id: '',
      password: ''
    });
    setIsEditOpen(true);
  };

  // Handle Submit Edit
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    onUpdatePatient({
      ...editingPatient,
      name: formData.name,
      age: parseInt(formData.age) || 10,
      notes: formData.notes,
      doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : null
    });
    if (selectedPatient && selectedPatient.id === editingPatient.id) {
      setSelectedPatient({
        ...selectedPatient,
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age) || 10,
        condition: formData.condition,
        program: formData.program,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes
      });
    }
    setIsEditOpen(false);
    setEditingPatient(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Patient Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View, search, update and enroll rehabilitation patients</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Tab Filters & Search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        {/* Left Side: Status Tabs */}
        <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700 self-start">
          {(['All', 'Active', 'Inactive'] as const).map((tab) => {
            const count = tab === 'All'
              ? patients.length
              : patients.filter((p) => p.status === tab).length;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs border border-slate-200 dark:border-slate-600/50'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Right Side: Search */}
        <div className="flex flex-1 md:max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, program or condition..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:bg-slate-700/70 focus:bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-cyan-500 rounded-xl outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: List + Detail Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left side: List (takes 2 cols if patient selected, else full 3 cols) */}
        <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 ${
          selectedPatient ? 'lg:col-span-2' : 'lg:col-span-3'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Assigned Program</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 dark:text-slate-200 text-sm">
                {paginatedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span>No patients match your search criteria.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map((patient) => {
                    const isSelected = selectedPatient?.id === patient.id;
                    return (
                      <tr
                        key={patient.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                          isSelected ? 'bg-cyan-50/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">

                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-100 hover:text-cyan-600 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                                {patient.name}
                              </div>
                              <div className="text-xs text-slate-400 font-mono font-medium">{patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-slate-600 dark:text-slate-300 font-medium">
                          {patient.age} years / {patient.gender}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            {patient.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 font-medium">
                          {patient.program}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            patient.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              title="View Patient Details"
                              onClick={() => setSelectedPatient(patient)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                isSelected ? 'bg-cyan-50 text-cyan-600' : 'text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Edit Patient"
                              onClick={() => openEditModal(patient)}
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              title="Delete Patient"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
                                  onDeletePatient(patient.id);
                                  if (selectedPatient?.id === patient.id) setSelectedPatient(null);
                                }
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-slate-50 gap-4 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <div>
              Showing <span className="text-slate-800 dark:text-slate-100 font-bold">{Math.min(filteredPatients.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
              <span className="text-slate-800 dark:text-slate-100 font-bold">{Math.min(filteredPatients.length, currentPage * itemsPerPage)}</span> of{' '}
              <span className="text-slate-800 dark:text-slate-100 font-bold">{filteredPatients.length}</span> patients
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Detailed Panel */}
        {selectedPatient && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-md p-6 space-y-6 relative animate-in slide-in-from-right-4 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Profile Summary */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-700">
              <img
                src={selectedPatient.avatar}
                alt={selectedPatient.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-cyan-100 shadow-xs mb-3 bg-slate-50 dark:bg-slate-700/50"
              />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedPatient.name}</h2>
              <p className="text-xs font-mono text-slate-400 font-semibold mb-1">{selectedPatient.id}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                selectedPatient.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
              }`}>
                {selectedPatient.status}
              </span>
            </div>

            {/* Profile Contact info */}
            <div className="space-y-3.5 text-xs">
              <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">Patient Bio & Contact</h3>
              
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedPatient.age} years old</span> • {selectedPatient.gender}
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate hover:text-cyan-600 cursor-pointer">{selectedPatient.email}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{selectedPatient.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Joined {selectedPatient.joinDate}</span>
              </div>
            </div>

            {/* Therapy Context */}
            <div className="space-y-3.5 text-xs pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">Therapy Assignment</h3>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Condition</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{selectedPatient.condition}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Active Program</div>
                  <div className="font-semibold text-cyan-700 mt-0.5">{selectedPatient.program}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Last Active Session</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium mt-0.5">{selectedPatient.lastSessionDate} at {selectedPatient.lastSessionTime}</div>
                </div>
              </div>
            </div>

            {/* Therapist Notes */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Therapist Notes
              </h3>
              <p className="text-slate-600 dark:text-slate-300 bg-slate-50/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30 leading-relaxed font-medium">
                {selectedPatient.notes || 'No notes left. Use the Edit tool to add observations on flexion capabilities or recovery speeds.'}
              </p>
            </div>

            {/* Mini action triggers */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => openEditModal(selectedPatient)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD PATIENT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-lg w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-md font-bold text-slate-800 dark:text-slate-100">Enroll New Patient</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jana Ahmed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    placeholder="e.g. 11"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Condition / Injury *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Post ACL Reconstruction, Ankle Sprain Grade II"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Assigned Rehab Program *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Knee Rehabilitation Program, Post ACL Reconstruction"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Phone</label>
                  <input
                    type="text"
                    placeholder="+20 100 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Assign Doctor</label>
                  <select
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="" disabled>Select a Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusType })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Therapy Observation Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter special clinical details, weight limits, range of motion bounds, etc..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
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
                  Enroll Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PATIENT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-lg w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-md font-bold text-slate-800 dark:text-slate-100">Edit Patient Profile</h2>
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingPatient(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Condition / Injury *</label>
                  <input
                    type="text"
                    required
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Assigned Rehab Program *</label>
                  <input
                    type="text"
                    required
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Assign Doctor</label>
                  <select
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="">No Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusType })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Therapy Observation Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingPatient(null);
                  }}
                  className="px-4.5 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
