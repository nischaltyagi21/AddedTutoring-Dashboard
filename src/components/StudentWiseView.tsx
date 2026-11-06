/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Layers,
  ChevronRight,
  BookOpen,
  Calendar,
  X,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Clock,
} from 'lucide-react';
import { useTutoring } from '../context/TutoringContext';
import { AggregatedStudent, StudentTutorHours } from '../types/tutoring';

export const StudentWiseView: React.FC = () => {
  const { data } = useTutoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutorFilter, setSelectedTutorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'renewal_needed' | 'completed' | 'inactive'>('all');
  const [selectedStudent, setSelectedStudent] = useState<AggregatedStudent | null>(null);

  // All unique tutors
  const allTutors = Array.from(
    new Set(data.aggregatedStudents.flatMap((s) => s.tutorNames))
  ).sort();

  // Filter students
  const filteredStudents = data.aggregatedStudents.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.tutorNames.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTutor =
      selectedTutorFilter === 'all'
        ? true
        : student.tutorNames.includes(selectedTutorFilter);

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'inactive'
        ? student.status === 'inactive' || student.isRedLined
        : statusFilter === 'renewal_needed'
        ? student.status !== 'inactive' && student.totalRemainingHours <= 1 && student.totalCompletedHours > 0
        : statusFilter === 'completed'
        ? student.status !== 'inactive' && student.totalRemainingHours === 0
        : student.status !== 'inactive' && student.totalRemainingHours > 0;

    return matchesSearch && matchesTutor && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-800/80">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name or assigned tutor..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-indigo-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tutor Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Working with:</span>
            <select
              value={selectedTutorFilter}
              onChange={(e) => setSelectedTutorFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200"
            >
              <option value="all">All Tutors ({allTutors.length})</option>
              {allTutors.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Buttons */}
          <div className="flex rounded-xl border border-gray-200 p-0.5 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/60">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              All ({data.aggregatedStudents.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-700 shadow-sm dark:bg-gray-800 dark:text-emerald-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Active ({data.totalActiveStudents})
            </button>
            <button
              onClick={() => setStatusFilter('renewal_needed')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'renewal_needed'
                  ? 'bg-white text-amber-700 shadow-sm dark:bg-gray-800 dark:text-amber-400'
                  : 'text-amber-600 hover:text-amber-700 dark:text-amber-400'
              }`}
            >
              Needs Renewal
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-white text-rose-700 shadow-sm dark:bg-gray-800 dark:text-rose-400'
                  : 'text-rose-600 hover:text-rose-700 dark:text-rose-400'
              }`}
            >
              Inactive / Red-Lined ({data.totalInactiveStudents})
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Sheet Aggregation Indicator */}
      <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
        <Layers className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <span>
          <strong>Student Hours Aggregation:</strong> When a student takes tutoring with multiple tutors across separate Google Sheets, their hours are summed together here while preserving the individual tutor breakdown.
        </span>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => {
          const totalPlanned = Math.max(
            student.totalRenewalHours,
            student.totalCompletedHours + student.totalRemainingHours
          );
          const percentCompleted =
            totalPlanned > 0
              ? Math.min(100, Math.round((student.totalCompletedHours / totalPlanned) * 100))
              : 0;
          const isInactive = student.status === 'inactive' || student.isRedLined;
          const isRenewalNeeded =
            !isInactive && student.totalRemainingHours <= 1 && student.totalCompletedHours > 0;
          const isMultiTutor = student.tutorNames.length > 1;

          return (
            <div
              key={student.normalizedName}
              onClick={() => setSelectedStudent(student)}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                isInactive
                  ? 'border-rose-300 bg-rose-50/30 dark:border-rose-900/60 dark:bg-rose-950/20'
                  : isRenewalNeeded
                  ? 'border-amber-200 bg-white dark:border-amber-900/50 dark:bg-gray-800/80'
                  : 'border-gray-200/90 bg-white dark:border-gray-800 dark:bg-gray-800/80'
              }`}
            >
              <div>
                {/* Header: Student Name & Multi-Tutor Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${
                        isInactive
                          ? 'bg-rose-600'
                          : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                      }`}
                    >
                      {student.studentName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {student.studentName}
                        </h4>
                      </div>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {student.tutorNames.length === 1 ? '1 Tutor' : `${student.tutorNames.length} Tutors`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {isInactive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        <span>Red-Lined Inactive</span>
                      </span>
                    ) : isMultiTutor ? (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        Multi-Tutor
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        Single Tutor
                      </span>
                    )}
                  </div>
                </div>

                {/* Working With Whom Banner */}
                <div className="mt-3.5 rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 dark:border-gray-700/50 dark:bg-gray-900/40">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Working With Tutor{student.tutorNames.length > 1 ? 's' : ''}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.tutorNames.map((tutor) => (
                      <span
                        key={tutor}
                        className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-gray-800 shadow-2xs border border-gray-200/80 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span>{tutor}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hours Stats Row */}
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-gray-100 bg-white p-2.5 text-center shadow-2xs dark:border-gray-700/50 dark:bg-gray-900/60">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-gray-400">
                      Purchased
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {student.totalRenewalHours}h
                    </span>
                  </div>
                  <div className="border-x border-gray-100 dark:border-gray-700/60">
                    <span className="block text-[10px] font-semibold uppercase text-gray-400">
                      Completed
                    </span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {student.totalCompletedHours}h
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-gray-400">
                      Remaining
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isInactive
                          ? 'text-rose-600 dark:text-rose-400'
                          : student.totalRemainingHours === 0
                          ? 'text-red-600 dark:text-red-400'
                          : isRenewalNeeded
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {student.totalRemainingHours}h
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                    <span>Session Progress</span>
                    <span className="font-semibold">{percentCompleted}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isInactive
                          ? 'bg-rose-400'
                          : isRenewalNeeded
                          ? 'bg-amber-500'
                          : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${percentCompleted}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 text-xs dark:border-gray-700/60">
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    isInactive
                      ? 'text-rose-600 dark:text-rose-400'
                      : student.totalRemainingHours === 0
                      ? 'text-red-600 dark:text-red-400'
                      : isRenewalNeeded
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isInactive ? (
                    <span>Red line on sheet • Status Inactive</span>
                  ) : student.totalRemainingHours === 0 ? (
                    <span>0 hours left • Renew now</span>
                  ) : isRenewalNeeded ? (
                    <span>1 hour left • Send renewal</span>
                  ) : (
                    <span>{student.totalRemainingHours} hours active</span>
                  )}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform dark:text-indigo-400">
                  <span>Breakdown</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
          <BookOpen className="h-10 w-10 text-gray-400" />
          <h4 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
            No students found matching your filters
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Try clearing the search query or changing the tutor filter.
          </p>
        </div>
      )}

      {/* Student Detailed Breakdown Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-base font-bold text-white shadow">
                  {selectedStudent.studentName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedStudent.studentName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assigned Tutors: <strong>{selectedStudent.tutorNames.join(', ')}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Overall Aggregation Summary */}
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-center dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Combined Purchased
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.totalRenewalHours}h
                  </span>
                </div>
                <div className="border-x border-indigo-200 dark:border-indigo-900">
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Combined Completed
                  </span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedStudent.totalCompletedHours}h
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Combined Remaining
                  </span>
                  <span
                    className={`text-xl font-bold ${
                      selectedStudent.totalRemainingHours === 0
                        ? 'text-red-600'
                        : selectedStudent.totalRemainingHours <= 1
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {selectedStudent.totalRemainingHours}h
                  </span>
                </div>
              </div>

              {/* Per Tutor Sheets Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  <span>Individual Tutor Sheets & Session Logs</span>
                </h4>

                {selectedStudent.tutors.map((tutorRecord, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700/60 dark:bg-gray-800/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-3 dark:border-gray-700/60">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                          Tutor Sheet: "{tutorRecord.tutorName} - Session Tracker"
                        </span>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                          Tutor: {tutorRecord.tutorName}
                        </h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Sub-Sheet Tab: "{tutorRecord.studentTabName}"
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {tutorRecord.dateOfRenewal && (
                          <div className="rounded-lg bg-white px-2.5 py-1 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <span className="text-gray-400">Renewal Date: </span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {tutorRecord.dateOfRenewal}
                            </span>
                          </div>
                        )}
                        <div className="rounded-lg bg-white px-2.5 py-1 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                          <span className="text-gray-400">Remaining: </span>
                          <strong className="text-indigo-600 dark:text-indigo-400">
                            {tutorRecord.remainingHours}h
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Session Log Items */}
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Recorded Sessions with {tutorRecord.tutorName} ({tutorRecord.sessions.length}):
                      </span>

                      {tutorRecord.sessions.length === 0 ? (
                        <p className="mt-1 text-xs italic text-gray-400">
                          Total hours completed: {tutorRecord.completedHours}h (individual line items logged in spreadsheet).
                        </p>
                      ) : (
                        <div className="mt-2 max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {tutorRecord.sessions.map((sess) => (
                            <div
                              key={sess.id}
                              className="flex items-center justify-between rounded-lg bg-white p-2 text-xs border border-gray-200/60 dark:bg-gray-900/60 dark:border-gray-700/40"
                            >
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  {sess.date}
                                </span>
                                {sess.tutorsFeedback && (
                                  <span className="text-gray-600 dark:text-gray-300 truncate max-w-sm">
                                    • {sess.tutorsFeedback}
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                {sess.duration} hr
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-gray-100 p-4 dark:border-gray-800">
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
