/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart2, TrendingUp, CalendarDays, Percent, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AnalyticsView() {
  const [selectedCohort, setSelectedCohort] = useState('All Kids Cohort');

  // Recovery Progress over weeks (Flexion Degrees log)
  const progressLogs = [
    { week: 'Week 1', extension: 10, flexion: 75 },
    { week: 'Week 2', extension: 8, flexion: 85 },
    { week: 'Week 3', extension: 5, flexion: 95 },
    { week: 'Week 4', extension: 3, flexion: 105 },
    { week: 'Week 5', extension: 1, flexion: 115 },
    { week: 'Week 6', extension: 0, flexion: 120 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recovery & Joint Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track mean biomechanical gains and flexion milestones across cohorts</p>
        </div>
        <select
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          className="px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 outline-none focus:border-cyan-500 font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-3xs"
        >
          <option value="All Kids Cohort">All Kids Cohort</option>
          <option value="ACL Reconstruction Only">ACL Reconstruction Only</option>
          <option value="Lower Body Strength Cohort">Lower Body Strength Cohort</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric A */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <span>Mean Flexion Range</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">114.2°</div>
          <p className="text-[10px] text-emerald-600 font-bold">↑ 8.5° from last week</p>
        </div>

        {/* Metric B */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <span>Active Compliance Rate</span>
            <Percent className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">92.4%</div>
          <p className="text-[10px] text-emerald-600 font-bold">↑ 2.1% compliance gain</p>
        </div>

        {/* Metric C */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <span>Daily Rep Target Achieved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">84/100</div>
          <p className="text-[10px] text-slate-400 font-semibold">16 pending sessions today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Joint Mobility Progression bar chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Joint Flexion Range Progression (Target: 120°)</h2>
          <div className="space-y-4">
            {progressLogs.map((item) => (
              <div key={item.week} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>{item.week}</span>
                  <span className="text-cyan-600">{item.flexion}°</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.flexion / 120) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Recovery summary card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-400 fill-current" />
            Milestone Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Patients in the <strong className="text-slate-700 dark:text-slate-200">{selectedCohort}</strong> show an accelerated rate of muscle hypertrophy. Extension stiffness decreased by an average of 14% due to early dynamic hamstring loads.
          </p>

          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3 text-xs font-semibold">
            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinical Guidance</h3>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <span>Prescribe Heel Slide routine twice daily.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <span>Ensure passive flexion does not exceed 110° in week 1.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
