/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTutoring } from '../context/TutoringContext';

export const RosterView: React.FC = () => {
  const { data } = useTutoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const pairs = data.tutorStudentPairs;
  const allTutors = Array.from(new Set(pairs.map((p) => p.tutorName))).sort();

  // Filter pairs
  const filteredPairs = pairs.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tutorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTutor = selectedTutor === 'all' ? true : p.tutorName === selectedTutor;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'inactive'
        ? p.status === 'inactive' || p.isRedLined
        : statusFilter === 'renewal_needed'
        ? p.status !== 'inactive' && p.remainingHours <= 1 && p.completedHours > 0
        : statusFilter === 'completed'
        ? p.status !== 'inactive' && p.remainingHours === 0
        : p.status !== 'inactive' && p.remainingHours > 0;

    return matchesSearch && matchesTutor && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Tutor Name', 'Purchased Hours', 'Completed Hours', 'Remaining Hours', 'Renewal Date', 'Status'];
    const rows = filteredPairs.map((p) => [
      `"${p.studentName.replace(/"/g, '""')}"`,
      `"${p.tutorName.replace(/"/g, '""')}"`,
      p.renewalHours,
      p.completedHours,
      p.remainingHours,
      `"${p.dateOfRenewal || ''}"`,
      `"${p.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tutor_student_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Table & Controls Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/80">
        {/* Controls Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700/60 dark:bg-gray-900/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Who Works With Whom (Complete Roster)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct student-to-tutor assignment map and session hour balances
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or tutor..."
                className="rounded-xl border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Filter by Tutor */}
            <select
              value={selectedTutor}
              onChange={(e) => setSelectedTutor(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">All Tutors ({allTutors.length})</option>
              {allTutors.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Hours</option>
              <option value="renewal_needed">Needs Renewal</option>
              <option value="inactive">Inactive / Red-Lined</option>
              <option value="completed">0h Left</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-100/80 text-gray-700 font-semibold dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Works With Tutor</th>
                <th className="py-2.5 px-4 text-center">Renewal Date</th>
                <th className="py-2.5 px-4 text-center">Purchased</th>
                <th className="py-2.5 px-4 text-center">Completed</th>
                <th className="py-2.5 px-4 text-center">Remaining</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredPairs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No matching student-tutor assignments found.
                  </td>
                </tr>
              ) : (
                filteredPairs.map((pair, idx) => {
                  const isInactive = pair.status === 'inactive' || pair.isRedLined;
                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isInactive
                          ? 'bg-rose-50/40 hover:bg-rose-50/70 dark:bg-rose-950/20 dark:hover:bg-rose-950/30'
                          : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold">
                        <span className="text-gray-900 dark:text-white">
                          {pair.studentName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span>{pair.tutorName}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                        {pair.dateOfRenewal || '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-gray-700 dark:text-gray-300">
                        {pair.renewalHours}h
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {pair.completedHours}h
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span
                          className={`rounded-lg px-2 py-0.5 ${
                            isInactive
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : pair.remainingHours === 0
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : pair.remainingHours <= 1
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {pair.remainingHours}h left
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isInactive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                            <span>Red-Lined (Inactive)</span>
                          </span>
                        ) : pair.remainingHours === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Hours Finished</span>
                          </span>
                        ) : pair.remainingHours <= 1 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Renewal Needed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
