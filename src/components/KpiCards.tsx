/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  GraduationCap,
  Clock,
  Hourglass,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useTutoring } from '../context/TutoringContext';

export const KpiCards: React.FC = () => {
  const { data } = useTutoring();

  const completionRate =
    data.totalHoursPurchased > 0
      ? Math.round((data.totalHoursCompleted / data.totalHoursPurchased) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Active Students */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Active Students
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {data.totalActiveStudents}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">students</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {data.totalInactiveStudents > 0 ? (
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {data.totalInactiveStudents} red-lined (inactive)
            </span>
          ) : (
            'Enrolled in sessions'
          )}
        </p>
      </div>

      {/* 2. Total Tutors */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tutors
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <GraduationCap className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {data.totalTutorsCount}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">tutor sheets</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          Teaching roster
        </p>
      </div>

      {/* 3. Hours Completed */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Completed
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {data.totalHoursCompleted}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">hrs</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {completionRate}% of purchased
        </p>
      </div>

      {/* 4. Hours Remaining */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Remaining
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Hourglass className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            {data.totalHoursRemaining}
          </span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">hrs</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          Sessions backlog
        </p>
      </div>

      {/* 5. Total Hours Purchased */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Purchased
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {data.totalHoursPurchased}
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">hrs</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          Renewed session hours
        </p>
      </div>

      {/* 6. Needs Renewal */}
      <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 shadow-sm transition-all hover:shadow-md dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            Needs Renewal
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
            {data.renewalNeededCount}
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-300">students</span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          ≤ 1 hr remaining
        </p>
      </div>
    </div>
  );
};
