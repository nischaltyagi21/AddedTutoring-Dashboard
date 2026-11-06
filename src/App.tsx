/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { TutoringProvider, useTutoring } from './context/TutoringContext';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { TutorWiseView } from './components/TutorWiseView';
import { StudentWiseView } from './components/StudentWiseView';
import { RosterView } from './components/RosterView';
import { DriveConfigModal } from './components/DriveConfigModal';

function DashboardContent() {
  const { data } = useTutoring();
  const [activeTab, setActiveTab] = useState<'tutorwise' | 'studentwise' | 'roster'>('tutorwise');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100 flex flex-col justify-between">
      <div>
        {/* Main Header with working Light/Dark Toggle and Drive Status */}
        <Header onOpenDriveModal={() => setIsDriveModalOpen(true)} />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
          {/* Executive Hours & Student KPIs Ribbon */}
          <KpiCards />

          {/* Navigation Pill Bar: Tutor-wise, Student-wise, Who Works With Whom */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-2 dark:border-gray-800">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {/* Tutor-wise filter button */}
              <button
                onClick={() => setActiveTab('tutorwise')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === 'tutorwise'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-gray-600 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Tutor-Wise View</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-current">
                  {data.tutorProfiles.length} Tutors
                </span>
              </button>

              {/* Student-wise filter button */}
              <button
                onClick={() => setActiveTab('studentwise')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === 'studentwise'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-gray-600 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Student-Wise View</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-current">
                  {data.aggregatedStudents.length} Students
                </span>
              </button>

              {/* Who Works With Whom (Roster Matrix) */}
              <button
                onClick={() => setActiveTab('roster')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === 'roster'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-gray-600 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Who Works With Whom</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-current">
                  {data.tutorStudentPairs.length} Assignments
                </span>
              </button>
            </div>

          </div>

          {/* Active Tab View */}
          {activeTab === 'tutorwise' && <TutorWiseView />}
          {activeTab === 'studentwise' && <StudentWiseView />}
          {activeTab === 'roster' && <RosterView />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-6 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>
              Student & Tutor Hours Tracker • Google Drive Sync • Multi-Tutor Aggregation
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Configure Drive Folder
            </button>
          </div>
        </div>
      </footer>

      {/* Drive Folder Modal */}
      <DriveConfigModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <TutoringProvider>
      <DashboardContent />
    </TutoringProvider>
  );
}
