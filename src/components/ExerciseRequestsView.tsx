import React, { useState, useEffect } from 'react';
import { ExerciseRequest } from '../types';
import { ExerciseRequestService, DataService } from '../services/api';
import { RefreshCw, CheckCircle, XCircle, Clock, Truck, Plus, Check } from 'lucide-react';

interface ExerciseRequestsViewProps {
  userRole: 'admin' | 'doctor';
}

export default function ExerciseRequestsView({ userRole }: ExerciseRequestsViewProps) {
  const [requests, setRequests] = useState<ExerciseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  
  // New request form
  const [newReqPatient, setNewReqPatient] = useState('');
  const [newReqExercise, setNewReqExercise] = useState('');
  const [newReqNotes, setNewReqNotes] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      let fetchedRequests: any[] = [];
      let res: any;
      if (userRole === 'admin') {
        res = await ExerciseRequestService.getAllRequests();
        fetchedRequests = res.rows || [];
      } else {
        res = await ExerciseRequestService.getMyRequests();
        fetchedRequests = res.data || [];
      }
      setRequests(fetchedRequests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const pRes = await DataService.getAdminPatients();
      setPatients(pRes.data || []);
      const eRes = await DataService.getExercises();
      setExercises(eRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRequests();
    if (userRole === 'doctor') {
      loadFormData();
    }
  }, [userRole]);

  const handleSubmit = async () => {
    if (!newReqPatient || !newReqExercise) return alert('Patient and Exercise required');
    try {
      await ExerciseRequestService.createRequest({
        patient_id: parseInt(newReqPatient),
        exercise_id: parseInt(newReqExercise),
        notes: newReqNotes
      });
      setShowNewModal(false);
      setNewReqPatient('');
      setNewReqExercise('');
      setNewReqNotes('');
      loadRequests();
    } catch (e) {
      alert('Failed to submit request');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await ExerciseRequestService.updateRequestStatus(id, status);
      loadRequests();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'under_review': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Under Review</span>;
      case 'accepted': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3.5 h-3.5" /> Accepted</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'delivered': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck className="w-3.5 h-3.5" /> Delivered</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Exercise Requests</h1>
          <p className="text-slate-500 mt-2">Manage custom exercise requests for patients.</p>
        </div>
        {userRole === 'doctor' && (
          <button 
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No requests found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-semibold">Doctor</th>}
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Exercise</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-slate-200 font-medium">
                      {req.doctor_name || 'N/A'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-slate-200">
                    {req.patient_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {req.name || req.exercise_name || 'N/A'}
                        </span>
                        {req.name && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            Custom
                          </span>
                        )}
                      </div>
                      {(req.description || req.notes) && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[250px] truncate" title={req.description || req.notes}>
                          {req.description || req.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatus(req.status)}
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'pending' && (
                          <button onClick={() => handleUpdateStatus(req.id, 'under_review')} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium transition-colors">Review</button>
                        )}
                        {req.status === 'under_review' && (
                          <>
                            <button onClick={() => handleUpdateStatus(req.id, 'accepted')} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-xs font-medium transition-colors">Accept</button>
                            <button onClick={() => handleUpdateStatus(req.id, 'rejected')} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium transition-colors">Reject</button>
                          </>
                        )}
                        {req.status === 'accepted' && (
                          <button onClick={() => handleUpdateStatus(req.id, 'delivered')} className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-xs font-medium transition-colors">Mark Delivered</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">New Exercise Request</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                <select 
                  value={newReqPatient} 
                  onChange={(e) => setNewReqPatient(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl"
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exercise</label>
                <select 
                  value={newReqExercise} 
                  onChange={(e) => setNewReqExercise(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl"
                >
                  <option value="">Select Exercise</option>
                  {exercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea 
                  value={newReqNotes}
                  onChange={(e) => setNewReqNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl resize-none h-24"
                  placeholder="Explain why this exercise is needed..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
