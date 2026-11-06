/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SessionRecord {
  id: string;
  date: string;
  duration: number; // in hours, e.g. 1, 1.5, 2
  tutorsFeedback?: string;
  nextSessionHomework?: string;
  homeworkStatus?: string;
  testScore?: string;
}

export interface StudentTutorHours {
  tutorName: string;
  sheetId?: string;
  studentTabName: string;
  dateOfRenewal?: string;
  renewalHours: number;
  completedHours: number;
  remainingHours: number;
  isRedLined?: boolean; // If a red line / strikethrough / red tab is on the sheet
  sessions: SessionRecord[];
}

export interface AggregatedStudent {
  studentName: string;
  normalizedName: string;
  totalRenewalHours: number;
  totalCompletedHours: number;
  totalRemainingHours: number;
  isRedLined?: boolean; // Red-lined in Google sheet
  tutors: StudentTutorHours[];
  tutorNames: string[];
  status: 'active' | 'renewal_needed' | 'completed' | 'inactive';
  lastSessionDate?: string;
}

export interface TutorProfile {
  tutorName: string;
  totalStudents: number;
  totalHoursRenewal: number;
  totalHoursCompleted: number;
  totalHoursRemaining: number;
  students: {
    studentName: string;
    renewalHours: number;
    completedHours: number;
    remainingHours: number;
    dateOfRenewal?: string;
    isRedLined?: boolean;
    status: 'active' | 'renewal_needed' | 'completed' | 'inactive';
    sessionCount: number;
    lastSessionDate?: string;
  }[];
}

export interface TutorStudentPair {
  tutorName: string;
  studentName: string;
  renewalHours: number;
  completedHours: number;
  remainingHours: number;
  dateOfRenewal?: string;
  isRedLined?: boolean;
  sessionCount: number;
  status: 'active' | 'renewal_needed' | 'completed' | 'inactive';
}

export interface DriveFolderConfig {
  studentHoursFolderId: string;
  studentHoursFolderName?: string;
  autoSyncIntervalMinutes: number; // 0 for off, 1, 5, 15
}

export interface TutoringAppData {
  aggregatedStudents: AggregatedStudent[];
  tutorProfiles: TutorProfile[];
  tutorStudentPairs: TutorStudentPair[];
  
  // Hours KPIs
  totalActiveStudents: number;
  totalInactiveStudents: number;
  totalTutorsCount: number;
  totalHoursCompleted: number;
  totalHoursRemaining: number;
  totalHoursPurchased: number;
  renewalNeededCount: number;
  
  lastSyncedAt: string;
  dataSource: 'live_google_drive' | 'demo_snapshot';
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}
