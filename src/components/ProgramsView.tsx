/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, Clock, Users, Plus, Star, BookOpen, AlertCircle, X } from 'lucide-react';
import { PROGRAMS_LIST } from '../mockData';

export default function ProgramsView() {
  const [programs, setPrograms] = useState(PROGRAMS_LIST);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProg, setNewProg] = useState({
    name: '',
    description: '',
    duration: '8 weeks',
    patientCount: 0,
    exercises: ''
  });

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProg.name || !newProg.description) {
      alert('Please fill in the program name and description.');
      return;
    }
    const exercisesArray = newProg.exercises
      ? newProg.exercises.split(',').map((x) => x.trim())
      : ['General Mobilization'];

    const added = {
      id: `prog-${Date.now()}`,
      name: newProg.name,
      description: newProg.description,
      duration: newProg.duration,
      patientCount: 0,
      exercises: exercisesArray
    };

    setPrograms([...programs, added]);
    setIsAddOpen(false);
    setNewProg({ name: '', description: '', duration: '8 weeks', patientCount: 0, exercises: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Therapy Programs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Design multi-week rehabilitation programs and track student cohorts</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-100/30">
                  Clinical Pathway
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  Highly Effective
                </div>
              </div>

              <div>
                <h2 className="text-md font-bold text-slate-800 dark:text-slate-100">{prog.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                  {prog.description}
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Duration: {prog.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Enrollment: {prog.patientCount} active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Prescribed Routine List</h3>
              <div className="flex flex-wrap gap-1.5">
                {prog.exercises.map((ex) => (
                  <span
                    key={ex}
                    className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Create Rehabilitation Program</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProgram} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Program Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hip Flexor Mobilization Clinic"
                  value={newProg.name}
                  onChange={(e) => setNewProg({ ...newProg, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail recovery milestones, age limits, and biomechanical targets..."
                  value={newProg.description}
                  onChange={(e) => setNewProg({ ...newProg, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Prescribed Duration</label>
                  <select
                    value={newProg.duration}
                    onChange={(e) => setNewProg({ ...newProg, duration: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 bg-white dark:bg-slate-800 transition-all"
                  >
                    <option value="4 weeks">4 weeks</option>
                    <option value="8 weeks">8 weeks</option>
                    <option value="12 weeks">12 weeks</option>
                    <option value="16 weeks">16 weeks</option>
                    <option value="24 weeks">24 weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Target Cohort</label>
                  <div className="px-3 py-2 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs rounded-xl font-medium">
                    0 initial patients
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Exercises (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Quad Sets, Heel Slides, Knee Extension"
                  value={newProg.exercises}
                  onChange={(e) => setNewProg({ ...newProg, exercises: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                />
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
