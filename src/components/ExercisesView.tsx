/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Dumbbell, Play, RotateCcw, Flame, CheckCircle, ShieldAlert } from 'lucide-react';
import { EXERCISE_ITEMS } from '../mockData';

export default function ExercisesView() {
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_ITEMS[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'guide'>('details');

  // Interactive rep counter state
  const [repCount, setRepCount] = useState(0);
  const [isActiveTraining, setIsActiveTraining] = useState(false);

  const triggerTrainingRep = () => {
    if (repCount >= 10) {
      alert(`Awesome! You have completed a full set of ${selectedExercise.name}!`);
      setRepCount(0);
      setIsActiveTraining(false);
      return;
    }
    setRepCount((prev) => prev + 1);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Exercise Library</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage prescription routines, targets, and interactive rep logging</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Exercise List */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-4 space-y-3 lg:col-span-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Available Routines</h2>
          <div className="space-y-1">
            {EXERCISE_ITEMS.map((ex) => {
              const isSelected = selectedExercise.id === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    setSelectedExercise(ex);
                    setRepCount(0);
                    setIsActiveTraining(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-50 border border-cyan-100/50 text-cyan-800'
                      : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: ex.color }}
                    />
                    <div>
                      <div className="font-semibold text-sm">{ex.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{ex.category}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50/50 px-2.5 py-1 rounded-lg">
                    {ex.count} logs
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Detail Workspace & Interactive Simulator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            {/* Header banner */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: selectedExercise.color }}
                >
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedExercise.name}</h2>
                  <p className="text-xs text-slate-400 font-semibold">{selectedExercise.category}</p>
                </div>
              </div>
              <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg self-start">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'details' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'guide' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Clinical Guide
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {activeTab === 'details' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Descriptions */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                        {selectedExercise.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Muscles</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedExercise.targetMuscles.split(', ').map((muscle) => (
                          <span
                            key={muscle}
                            className="px-2.5 py-1 bg-cyan-50 border border-cyan-100/50 text-cyan-700 text-xs font-semibold rounded-lg"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Frequency Specs */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Prescription</div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mt-1 text-sm">{selectedExercise.sets}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Frequency</div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mt-1 text-sm">{selectedExercise.frequency}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Average Duration</div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mt-1 text-sm">15 mins</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Difficulty</div>
                        <div className="font-bold text-amber-600 mt-1 text-sm">Moderate</div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-600/50 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Provides high quad tendon load & active stretching
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Correct Posture & Alignment</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Ensure the pelvis remains neutral. Place a small rolled-up towel under the knee if necessary to prevent hyper-extension during the static contraction phase.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Eccentric Control Emphasis</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Instruct the patient to lower the leg slowly over 3 seconds. Do not let the foot collapse onto the clinical table to maximize eccentric motor recruitment.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">Contraindications & Warning Flags</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Stop immediately if acute retropatellar clicking or sharp patella tendon pain occurs. Standard dull muscle burn is expected and safe.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Rep Logging Widget */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
            <div className="space-y-2 relative">
              <span className="inline-flex px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                Prescription Simulator
              </span>
              <h3 className="text-md font-bold">Interactive Movement Log</h3>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                Test-run this routine or count live repetitions with patients. Complete 10 reps to log a successful set.
              </p>
            </div>

            <div className="flex items-center gap-5 relative">
              {/* Rep Indicator Circle */}
              <div className="w-18 h-18 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950 font-mono">
                <span className="text-xl font-bold text-cyan-400">{repCount}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">/10 reps</span>
              </div>

              {/* Action Triggers */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={triggerTrainingRep}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Perform Rep
                </button>
                <button
                  onClick={() => setRepCount(0)}
                  disabled={repCount === 0}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
