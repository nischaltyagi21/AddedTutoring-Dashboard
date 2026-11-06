/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Clock,
  Hourglass,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { useTutoring } from '../context/TutoringContext';
import { TutorProfile } from '../types/tutoring';

export const TutorWiseView: React.FC = () => {
  const { data } = useTutoring();
  const [selectedTutorName, setSelectedTutorName] = useState<string>('all');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [searchStudentTerm, setSearchStudentTerm] = useState('');

  // Find all tutor profiles
  const tutors = data.tutorProfiles;

  const currentTutors =
    selectedTutorName === 'all'
      ? tutors
      : tutors.filter((t) => t.tutorName === selectedTutorName);

  return (
    <div className="space-y-6">
      {/* Tutor Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Tutor-Wise Hours Filter
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a tutor to see all assigned students and session hours
            </p>
          </div>
        </div>

        {/* Tutor Selector Pills & Dropdown */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTutorName('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedTutorName === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All Tutors ({tutors.length})
          </button>

          {tutors.map((t) => (
            <button
              key={t.tutorName}
              onClick={() => setSelectedTutorName(t.tutorName)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedTutorName === t.tutorName
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {t.tutorName} ({t.students.length})
            </button>
          ))}
        </div>
      </div>

      {/* Tutor Cards / Details */}
      <div className="space-y-6">
        {currentTutors.map((tutor) => {
          // Filter students within this tutor if search term is active
          const filteredStudents = tutor.students.filter((s) =>
            s.studentName.toLowerCase().includes(searchStudentTerm.toLowerCase())
          );

          const tutorCompletion =
            tutor.totalHoursRenewal > 0
              ? Math.round((tutor.totalHoursCompleted / tutor.totalHoursRenewal) * 100)
              : 0;

          return (
            <div
              key={tutor.tutorName}
              className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/80"
            >
              {/* Tutor Header Ribbon */}
              <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700/60 dark:bg-gray-900/40">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-base font-bold text-white shadow-sm">
                    {tutor.tutorName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {tutor.tutorName}
                      </h4>
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {tutor.students.length} Students Assigned
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Spreadsheet: "{tutor.tutorName} - Session Tracker"
                    </p>
                  </div>
                </div>

                {/* Tutor Hours Stats Banner */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-center dark:border-gray-700 dark:bg-gray-800">
                    <span className="block text-[10px] font-bold uppercase text-gray-400">
                      Purchased
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {tutor.totalHoursRenewal}h
                    </span>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <span className="block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {tutor.totalHoursCompleted}h
                    </span>
                  </div>

                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-center dark:border-indigo-900/50 dark:bg-indigo-950/20">
                    <span className="block text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                      Remaining
                    </span>
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {tutor.totalHoursRemaining}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Roster Table for this Tutor */}
              <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Students Working With {tutor.tutorName}
                  </h5>
                  <span className="text-xs text-gray-400">
                    Click any student row to view individual session notes
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-700 font-semibold dark:bg-gray-900/60 dark:text-gray-300">
                      <tr>
                        <th className="py-2.5 px-4">Student Name</th>
                        <th className="py-2.5 px-4 text-center">Renewal Date</th>
                        <th className="py-2.5 px-4 text-center">Purchased</th>
                        <th className="py-2.5 px-4 text-center">Completed</th>
                        <th className="py-2.5 px-4 text-center">Remaining</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
                      {filteredStudents.map((st) => {
                        const isInactive = st.status === 'inactive' || st.isRedLined;
                        const isExpanded = expandedStudent === `${tutor.tutorName}-${st.studentName}`;
                        const isRenewal = !isInactive && st.remainingHours <= 1;

                        // Find full session records for this student and tutor
                        const rawItem = data.aggregatedStudents
                          .find((s) => s.normalizedName === st.studentName.toLowerCase().trim() || s.studentName === st.studentName)
                          ?.tutors.find((t) => t.tutorName === tutor.tutorName);

                        return (
                          <React.Fragment key={st.studentName}>
                            <tr
                              onClick={() =>
                                setExpandedStudent(isExpanded ? null : `${tutor.tutorName}-${st.studentName}`)
                              }
                              className={`cursor-pointer transition-colors ${
                                isInactive
                                  ? 'bg-rose-50/40 hover:bg-rose-50/70 dark:bg-rose-950/20 dark:hover:bg-rose-950/30'
                                  : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/30'
                              }`}
                            >
                              <td className="py-3 px-4 font-bold">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-900 dark:text-white">
                                    {st.studentName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                                {st.dateOfRenewal || '—'}
                              </td>
                              <td className="py-3 px-4 text-center font-medium text-gray-700 dark:text-gray-300">
                                {st.renewalHours}h
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                                {st.completedHours}h
                              </td>
                              <td className="py-3 px-4 text-center font-bold">
                                <span
                                  className={`rounded-lg px-2 py-0.5 ${
                                    isInactive
                                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                      : st.remainingHours === 0
                                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                      : isRenewal
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  }`}
                                >
                                  {st.remainingHours}h left
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {isInactive ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                    <span>Red-Lined (Inactive)</span>
                                  </span>
                                ) : st.remainingHours === 0 ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Hours Expired</span>
                                  </span>
                                ) : isRenewal ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Renewal Due</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Active</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                  <span>{isExpanded ? 'Hide Notes' : 'View Notes'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </span>
                              </td>
                            </tr>

                            {/* Expanded Sessions Row */}
                            {isExpanded && (
                              <tr className="bg-indigo-50/30 dark:bg-indigo-950/20">
                                <td colSpan={7} className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                                      <span>
                                        Session Log Entries for {st.studentName} ({rawItem?.sessions.length || 0} recorded sessions)
                                      </span>
                                      <span className="text-[11px] text-gray-500">
                                        Tab: "{st.studentName}"
                                      </span>
                                    </div>

                                    {!rawItem || rawItem.sessions.length === 0 ? (
                                      <p className="text-xs italic text-gray-500 py-1">
                                        No individual session rows logged yet. Total hours completed: {st.completedHours}h.
                                      </p>
                                    ) : (
                                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                        {rawItem.sessions.map((sess) => (
                                          <div
                                            key={sess.id}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200/80 bg-white p-2.5 text-xs shadow-sm dark:border-gray-700/60 dark:bg-gray-800"
                                          >
                                            <div className="flex items-center gap-3">
                                              <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                                                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                                {sess.date}
                                              </span>
                                              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                {sess.duration} hr{sess.duration > 1 ? 's' : ''}
                                              </span>
                                              {sess.tutorsFeedback && (
                                                <span className="text-gray-600 dark:text-gray-300">
                                                  <strong>Feedback:</strong> {sess.tutorsFeedback}
                                                </span>
                                              )}
                                            </div>

                                            {sess.nextSessionHomework && (
                                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                                Homework: {sess.nextSessionHomework}
                                              </span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
