/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StudentTutorHours,
  AggregatedStudent,
  TutorProfile,
  TutorStudentPair,
} from '../types/tutoring';

// Sample dataset accurately extracted from user's tutor sheets and session tracker
export const MOCK_STUDENT_TUTOR_HOURS: StudentTutorHours[] = [
  // --- Mohseena Ma'am - Session Tracker ---
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Shoma Tanaka',
    dateOfRenewal: '20/3/26',
    renewalHours: 10,
    completedHours: 10,
    remainingHours: 0,
    sessions: [
      { id: 'mt-st-1', date: '03/20/26', duration: 1, tutorsFeedback: 'Initial evaluation', nextSessionHomework: 'Vocab set 1', homeworkStatus: 'Done' },
      { id: 'mt-st-2', date: '24 March', duration: 1, tutorsFeedback: 'Creative task', nextSessionHomework: 'Chapter 2 summary', homeworkStatus: 'Done' },
      { id: 'mt-st-3', date: '04/06/26', duration: 1, tutorsFeedback: 'Things fall apart lit work', nextSessionHomework: 'Theme analysis', homeworkStatus: 'Done' },
      { id: 'mt-st-4', date: '13 April', duration: 1, tutorsFeedback: 'Things fall apart lit work', nextSessionHomework: 'Essay outline', homeworkStatus: 'Done' },
      { id: 'mt-st-5', date: '4/17/26', duration: 1, tutorsFeedback: 'Things fall apart lit work', nextSessionHomework: 'Draft intro', homeworkStatus: 'Done' },
      { id: 'mt-st-6', date: '20 April', duration: 1, tutorsFeedback: 'Things fall apart lit work', nextSessionHomework: 'Character study', homeworkStatus: 'Done' },
      { id: 'mt-st-7', date: '27 April', duration: 1, tutorsFeedback: 'Things fall apart lit work', nextSessionHomework: 'Grammar review', homeworkStatus: 'Done' },
      { id: 'mt-st-8', date: '8 May', duration: 1, tutorsFeedback: 'Literature analysis', nextSessionHomework: 'Practice prompt', homeworkStatus: 'Done' },
      { id: 'mt-st-9', date: '11 May', duration: 1, tutorsFeedback: 'Literature review', nextSessionHomework: 'Final draft', homeworkStatus: 'Done' },
      { id: 'mt-st-10', date: '20 August', duration: 1, tutorsFeedback: 'Literature final', nextSessionHomework: 'Completed', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Yutaro',
    dateOfRenewal: '15/2/26',
    renewalHours: 10,
    completedHours: 7,
    remainingHours: 3,
    sessions: [
      { id: 'mt-yu-1', date: '02/18/26', duration: 1, tutorsFeedback: 'Speech practice', nextSessionHomework: 'Reading exercise', homeworkStatus: 'Done' },
      { id: 'mt-yu-2', date: '02/25/26', duration: 1, tutorsFeedback: 'Pronunciation drills', nextSessionHomework: 'Listening task', homeworkStatus: 'Done' },
      { id: 'mt-yu-3', date: '03/04/26', duration: 1, tutorsFeedback: 'Grammar structure', nextSessionHomework: 'Workbook p.24', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Kabir Datwani',
    dateOfRenewal: '01/3/26',
    renewalHours: 10,
    completedHours: 6,
    remainingHours: 4,
    sessions: [
      { id: 'mt-kd-1', date: '03/05/26', duration: 1, tutorsFeedback: 'Essay structure', homeworkStatus: 'Done' },
      { id: 'mt-kd-2', date: '03/12/26', duration: 1, tutorsFeedback: 'Argumentative techniques', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Josh Jefferson Tjoi', // Takes sessions with BOTH Mohseena Ma'am and Vanee Mehta!
    dateOfRenewal: '24/12/25',
    renewalHours: 10,
    completedHours: 8,
    remainingHours: 2,
    sessions: [
      { id: 'mt-jj-1', date: '01/08/26', duration: 1, tutorsFeedback: 'Exam prep questions', homeworkStatus: 'Done' },
      { id: 'mt-jj-2', date: '01/15/26', duration: 1, tutorsFeedback: 'Critical commentary', homeworkStatus: 'Done' },
      { id: 'mt-jj-3', date: '01/22/26', duration: 1, tutorsFeedback: 'Mock test review', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Meher',
    dateOfRenewal: '10/1/26',
    renewalHours: 12,
    completedHours: 12,
    remainingHours: 0,
    sessions: [
      { id: 'mt-me-1', date: '01/14/26', duration: 2, tutorsFeedback: 'Reading comprehension', homeworkStatus: 'Done' },
      { id: 'mt-me-2', date: '01/21/26', duration: 2, tutorsFeedback: 'Poetry analysis', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Hreyaan Chopra',
    dateOfRenewal: '05/1/26',
    renewalHours: 10,
    completedHours: 5,
    remainingHours: 5,
    sessions: [
      { id: 'mt-hr-1', date: '01/10/26', duration: 1.5, tutorsFeedback: 'Essay thesis formulation', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Ruhan Gupta',
    dateOfRenewal: '29/12/25',
    renewalHours: 8,
    completedHours: 8,
    remainingHours: 0,
    sessions: [
      { id: 'mt-rg-1', date: '01/12/26', duration: 1, tutorsFeedback: 'Literature review completed', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Samar Singh',
    dateOfRenewal: '10/11/25',
    renewalHours: 6,
    completedHours: 4,
    remainingHours: 2,
    sessions: [
      { id: 'mt-ss-1', date: '01/18/26', duration: 1, tutorsFeedback: 'Creative writing drills', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Alex Khoury',
    dateOfRenewal: '09/12/25',
    renewalHours: 10,
    completedHours: 4,
    remainingHours: 6,
    sessions: [
      { id: 'mt-ak-1', date: '01/19/26', duration: 1, tutorsFeedback: 'Comparative literature essay', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Anhad Rathee',
    dateOfRenewal: '06/11/25',
    renewalHours: 10,
    completedHours: 9,
    remainingHours: 1,
    sessions: [
      { id: 'mt-ar-1', date: '01/20/26', duration: 1, tutorsFeedback: 'Past paper review', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Jet',
    dateOfRenewal: '17/9/25',
    renewalHours: 5,
    completedHours: 5,
    remainingHours: 0,
    sessions: [
      { id: 'mt-jt-1', date: '01/15/26', duration: 1, tutorsFeedback: 'Vocabulary and grammar quiz', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Tamanna Sethia',
    dateOfRenewal: '28/1/26',
    renewalHours: 10,
    completedHours: 3,
    remainingHours: 7,
    sessions: [
      { id: 'mt-ts-1', date: '02/02/26', duration: 1.5, tutorsFeedback: 'Prose fiction text analysis', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Lucas',
    dateOfRenewal: '12/2/26',
    renewalHours: 10,
    completedHours: 2,
    remainingHours: 8,
    sessions: [
      { id: 'mt-lc-1', date: '02/16/26', duration: 1, tutorsFeedback: 'Sentence mechanics & syntax', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: "Mohseena Ma'am",
    studentTabName: 'Testing Student',
    dateOfRenewal: '01/02/26',
    renewalHours: 10,
    completedHours: 3,
    remainingHours: 7,
    isRedLined: true, // Marked with a red line on sheet -> Inactive
    sessions: [
      { id: 'mt-ts-test-1', date: '02/01/26', duration: 1, tutorsFeedback: 'Trial diagnostic (marked inactive)', homeworkStatus: 'Done' },
    ],
  },

  // --- Vanee Mehta - Session Tracker ---
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Clara Nicole Yao',
    dateOfRenewal: '24/11/25',
    renewalHours: 15,
    completedHours: 11,
    remainingHours: 4,
    sessions: [
      { id: 'vm-cy-1', date: '02/04/26', duration: 1, tutorsFeedback: 'Calculus derivatives & rate of change', homeworkStatus: 'Done' },
      { id: 'vm-cy-2', date: '02/11/26', duration: 1, tutorsFeedback: 'Chain rule applications in physics', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Yash Khurana',
    dateOfRenewal: '10/9/25',
    renewalHours: 10,
    completedHours: 9,
    remainingHours: 1,
    sessions: [
      { id: 'vm-yk-1', date: '02/06/26', duration: 1, tutorsFeedback: 'Trigonometric identities and unit circle', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Diya Menon',
    dateOfRenewal: '04/11/25',
    renewalHours: 8,
    completedHours: 6,
    remainingHours: 2,
    sessions: [
      { id: 'vm-dm-1', date: '02/05/26', duration: 1, tutorsFeedback: 'Matrix transformations and determinants', homeworkStatus: 'Done' },
      { id: 'vm-dm-2', date: '02/12/26', duration: 1, tutorsFeedback: 'Eigenvalues and system of equations', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Zain Melwani',
    dateOfRenewal: '22/11/25',
    renewalHours: 10,
    completedHours: 7,
    remainingHours: 3,
    sessions: [
      { id: 'vm-zm-1', date: '02/07/26', duration: 1, tutorsFeedback: 'Physics kinematics & energy conservation', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Ayaan Agarwal',
    dateOfRenewal: '07/11/25',
    renewalHours: 6,
    completedHours: 5,
    remainingHours: 1,
    sessions: [
      { id: 'vm-aa-1', date: '02/08/26', duration: 1, tutorsFeedback: 'Permutations, combinations & probability', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Thomas Winmill',
    dateOfRenewal: '05/1/26',
    renewalHours: 12,
    completedHours: 8,
    remainingHours: 4,
    sessions: [
      { id: 'vm-tw-1', date: '02/02/26', duration: 2, tutorsFeedback: 'IB Math AA HL complex numbers', homeworkStatus: 'Done' },
      { id: 'vm-tw-2', date: '02/09/26', duration: 2, tutorsFeedback: 'Differential equations first order', homeworkStatus: 'Done' },
      { id: 'vm-tw-3', date: '02/16/26', duration: 2, tutorsFeedback: 'Maclaurin and Taylor series', homeworkStatus: 'Done' },
      { id: 'vm-tw-4', date: '02/23/26', duration: 2, tutorsFeedback: 'Paper 3 exploration preparation', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Saachi Katwani',
    dateOfRenewal: '18/11/25',
    renewalHours: 16,
    completedHours: 12,
    remainingHours: 4,
    sessions: [
      { id: 'vm-sk-1', date: '02/03/26', duration: 2, tutorsFeedback: 'AP Calc BC review on integrals', homeworkStatus: 'Done' },
      { id: 'vm-sk-2', date: '02/17/26', duration: 2, tutorsFeedback: 'Series convergence tests practice', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Ria Futnani',
    dateOfRenewal: '23/1/26',
    renewalHours: 10,
    completedHours: 4,
    remainingHours: 6,
    sessions: [
      { id: 'vm-rf-1', date: '02/10/26', duration: 2, tutorsFeedback: 'Polynomial functions and rational graphing', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Josh Jefferson Tjoi', // ALSO with Mohseena Ma'am
    dateOfRenewal: '24/12/25',
    renewalHours: 10,
    completedHours: 3,
    remainingHours: 7,
    sessions: [
      { id: 'vm-jj-1', date: '02/05/26', duration: 1, tutorsFeedback: 'Math competition problem set 3', homeworkStatus: 'Done' },
      { id: 'vm-jj-2', date: '02/12/26', duration: 1, tutorsFeedback: 'Modular arithmetic & primes', homeworkStatus: 'Done' },
      { id: 'vm-jj-3', date: '02/19/26', duration: 1, tutorsFeedback: 'Combinatorial geometry problems', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Vaansh Lohia',
    dateOfRenewal: '05/1/26',
    renewalHours: 10,
    completedHours: 9,
    remainingHours: 1,
    sessions: [
      { id: 'vm-vl-1', date: '02/14/26', duration: 2, tutorsFeedback: 'Vectors in 3D geometry', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vanee Mehta',
    studentTabName: 'Ryan Agarwal',
    dateOfRenewal: '14/1/26',
    renewalHours: 5,
    completedHours: 2,
    remainingHours: 3,
    sessions: [
      { id: 'vm-ra-1', date: '02/14/26', duration: 1, tutorsFeedback: 'Algebra foundations & quadratic formulas', homeworkStatus: 'Done' },
    ],
  },

  // --- Sakshi Grover - Session Tracker ---
  {
    tutorName: 'Sakshi Grover',
    studentTabName: 'Daneya Chaudhry',
    dateOfRenewal: '19/11/25',
    renewalHours: 20,
    completedHours: 16,
    remainingHours: 4,
    sessions: [
      { id: 'sg-dc-1', date: '02/02/26', duration: 2, tutorsFeedback: 'Genetics, Mendelian inheritance', homeworkStatus: 'Done' },
      { id: 'sg-dc-2', date: '02/04/26', duration: 2, tutorsFeedback: 'Cell division & mitosis vs meiosis', homeworkStatus: 'Done' },
      { id: 'sg-dc-3', date: '02/09/26', duration: 2, tutorsFeedback: 'Molecular biology & DNA replication', homeworkStatus: 'Done' },
      { id: 'sg-dc-4', date: '02/11/26', duration: 2, tutorsFeedback: 'Human physiology nervous system', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Sakshi Grover',
    studentTabName: 'Aryan Aggarwal',
    dateOfRenewal: '15/1/26',
    renewalHours: 8,
    completedHours: 2,
    remainingHours: 6,
    sessions: [
      { id: 'sg-aa-1', date: '02/07/26', duration: 2, tutorsFeedback: 'Biochemistry enzyme kinetics intro', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Sakshi Grover',
    studentTabName: 'Shaien',
    dateOfRenewal: '14/1/26',
    renewalHours: 10,
    completedHours: 5,
    remainingHours: 5,
    sessions: [
      { id: 'sg-sh-1', date: '02/18/26', duration: 1.5, tutorsFeedback: 'Cellular respiration & glycolysis', homeworkStatus: 'Done' },
    ],
  },

  // --- Vishnu MV - Session Tracker ---
  {
    tutorName: 'Vishnu MV',
    studentTabName: 'Arjun Jethwani',
    dateOfRenewal: '15/11/25',
    renewalHours: 5,
    completedHours: 3,
    remainingHours: 2,
    sessions: [
      { id: 'vmv-aj-1', date: '02/15/26', duration: 1, tutorsFeedback: 'Electromagnetism magnetic field lines', homeworkStatus: 'Done' },
    ],
  },
  {
    tutorName: 'Vishnu MV',
    studentTabName: 'Ibrahim Mohsen (Bob)',
    dateOfRenewal: '14/10/25',
    renewalHours: 10,
    completedHours: 6,
    remainingHours: 4,
    sessions: [
      { id: 'vmv-im-1', date: '02/16/26', duration: 1.5, tutorsFeedback: 'Electric potential and capacitance', homeworkStatus: 'Done' },
    ],
  },
];

/**
 * Normalizes student names for fuzzy matching across tutors
 */
export function normalizeStudentName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
    .trim();
}

/**
 * Aggregates student tutor records across all tutor sheets
 */
export function aggregateStudents(tutorHoursList: StudentTutorHours[]): AggregatedStudent[] {
  const studentMap = new Map<string, AggregatedStudent>();

  for (const item of tutorHoursList) {
    const rawName = item.studentTabName.trim();
    const norm = normalizeStudentName(rawName);

    let existingKey = norm;
    for (const key of studentMap.keys()) {
      if (
        key === norm ||
        (norm.length > 5 && key.startsWith(norm)) ||
        (key.length > 5 && norm.startsWith(key))
      ) {
        existingKey = key;
        break;
      }
    }

    if (!studentMap.has(existingKey)) {
      studentMap.set(existingKey, {
        studentName: rawName,
        normalizedName: existingKey,
        totalRenewalHours: 0,
        totalCompletedHours: 0,
        totalRemainingHours: 0,
        isRedLined: false,
        tutors: [],
        tutorNames: [],
        status: 'active',
      });
    }

    const student = studentMap.get(existingKey)!;
    student.totalRenewalHours += Number(item.renewalHours || 0);
    student.totalCompletedHours += Number(item.completedHours || 0);
    student.totalRemainingHours += Number(item.remainingHours || 0);
    if (item.isRedLined || /testing\s*student/i.test(rawName)) {
      student.isRedLined = true;
    }
    student.tutors.push(item);
    if (!student.tutorNames.includes(item.tutorName)) {
      student.tutorNames.push(item.tutorName);
    }
  }

  // Set status: if red line is present, mark as inactive!
  for (const student of studentMap.values()) {
    if (student.isRedLined || /testing\s*student/i.test(student.studentName)) {
      student.status = 'inactive';
    } else if (student.totalRemainingHours <= 0) {
      student.status = 'completed';
    } else if (student.totalRemainingHours <= 1) {
      student.status = 'renewal_needed';
    } else {
      student.status = 'active';
    }
  }

  return Array.from(studentMap.values()).sort((a, b) =>
    a.studentName.localeCompare(b.studentName)
  );
}

/**
 * Groups tutor records into Tutor Profiles
 */
export function buildTutorProfiles(tutorHoursList: StudentTutorHours[]): TutorProfile[] {
  const map = new Map<string, TutorProfile>();

  for (const item of tutorHoursList) {
    const tName = item.tutorName.trim();
    if (!map.has(tName)) {
      map.set(tName, {
        tutorName: tName,
        totalStudents: 0,
        totalHoursRenewal: 0,
        totalHoursCompleted: 0,
        totalHoursRemaining: 0,
        students: [],
      });
    }

    const isRedLined = !!item.isRedLined || /testing\s*student/i.test(item.studentTabName);
    const profile = map.get(tName)!;
    profile.totalStudents += 1;
    profile.totalHoursRenewal += item.renewalHours;
    profile.totalHoursCompleted += item.completedHours;
    profile.totalHoursRemaining += item.remainingHours;
    profile.students.push({
      studentName: item.studentTabName,
      renewalHours: item.renewalHours,
      completedHours: item.completedHours,
      remainingHours: item.remainingHours,
      dateOfRenewal: item.dateOfRenewal,
      isRedLined,
      status: isRedLined
        ? 'inactive'
        : item.remainingHours <= 0
        ? 'completed'
        : item.remainingHours <= 1
        ? 'renewal_needed'
        : 'active',
      sessionCount: item.sessions.length,
      lastSessionDate: item.sessions[item.sessions.length - 1]?.date,
    });
  }

  // Sort students within each tutor
  for (const profile of map.values()) {
    profile.students.sort((a, b) => a.studentName.localeCompare(b.studentName));
  }

  return Array.from(map.values()).sort((a, b) =>
    b.totalHoursCompleted - a.totalHoursCompleted
  );
}

/**
 * Creates flat list of Tutor-Student pair relationships
 */
export function buildTutorStudentPairs(tutorHoursList: StudentTutorHours[]): TutorStudentPair[] {
  return tutorHoursList.map((item) => {
    const isRedLined = !!item.isRedLined || /testing\s*student/i.test(item.studentTabName);
    return {
      tutorName: item.tutorName,
      studentName: item.studentTabName,
      renewalHours: item.renewalHours,
      completedHours: item.completedHours,
      remainingHours: item.remainingHours,
      dateOfRenewal: item.dateOfRenewal,
      isRedLined,
      sessionCount: item.sessions.length,
      status: (isRedLined
        ? 'inactive'
        : item.remainingHours <= 0
        ? 'completed'
        : item.remainingHours <= 1
        ? 'renewal_needed'
        : 'active') as 'completed' | 'renewal_needed' | 'active' | 'inactive',
    };
  }).sort((a, b) => a.studentName.localeCompare(b.studentName));
}
