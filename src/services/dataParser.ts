/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentTutorHours, SessionRecord } from '../types/tutoring';
import { GoogleSheetTabInfo } from './driveSheetsApi';

/**
 * Cleans string into numeric amount
 */
export function parseNumeric(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Extracts tutor's name from spreadsheet title (e.g. "Mohseena Ma'am - Session Tracker" -> "Mohseena Ma'am")
 */
export function extractTutorNameFromTitle(title: string): string {
  if (!title) return 'Unknown Tutor';
  const clean = title.replace(/[-–—]?\s*(session|hours|tracker|sheet|tutoring).*/i, '').trim();
  return clean || title.trim();
}

/**
 * Parses a single Tutor Google Sheet (containing one tab per student)
 * Matches layout shown in Image 1:
 * - Columns A-G: Date (DD/MM/YY), Duration, Tutor's Feedback, Next Session Homework, Homework Status, Test score
 * - Columns I-L: Summary block:
 *     Date of renewal | Number Hours | Total hours completed = 10
 *                                    Total hours renew = 10
 *                                    Hours remaning = 0
 */
export function parseTutorSpreadsheet(
  spreadsheetId: string,
  spreadsheetTitle: string,
  tabs: GoogleSheetTabInfo[],
  tabDataMap: Map<string, (string | number | boolean | null)[][]>
): StudentTutorHours[] {
  const tutorName = extractTutorNameFromTitle(spreadsheetTitle);
  const result: StudentTutorHours[] = [];

  for (const tab of tabs) {
    const tabTitle = tab.title.trim();
    // Skip general template or instruction tabs
    if (/^(template|master|summary|instructions|overview|sheet1$)/i.test(tabTitle)) {
      continue;
    }

    const rows = tabDataMap.get(tabTitle) || [];
    if (!rows || rows.length === 0) continue;

    let renewalHours = 0;
    let completedHours = 0;
    let remainingHours = 0;
    let dateOfRenewal = '';
    let isRedLined = false;
    const sessions: SessionRecord[] = [];

    // Check if tab has a red tabColor set in Google Sheets (red line indicator)
    if (tab.tabColor && (tab.tabColor.red || 0) > 0.6 && (tab.tabColor.green || 0) < 0.4) {
      isRedLined = true;
    }

    // Check if tab title has inactive or red-line markers (e.g. "Testing Student", "[Red]", "(Inactive)")
    if (
      /testing\s*student/i.test(tabTitle) ||
      /inactive/i.test(tabTitle) ||
      /red\s*line/i.test(tabTitle) ||
      /\[red\]/i.test(tabTitle) ||
      /\(inactive\)/i.test(tabTitle) ||
      /\(paused\)/i.test(tabTitle)
    ) {
      isRedLined = true;
    }

    // Scan cells for the Summary block (Columns I-L or wherever "Total hours completed" is written)
    let foundSummaryBlock = false;

    for (let r = 0; r < Math.min(rows.length, 30); r++) {
      const row = rows[r];
      if (!row) continue;

      for (let c = 0; c < row.length; c++) {
        const cell = String(row[c] || '').trim();

        // Check for red line or inactive text marker in cells
        if (
          /red\s*line/i.test(cell) ||
          /inactive/i.test(cell) ||
          /testing\s*student/i.test(cell) ||
          /status:\s*inactive/i.test(cell)
        ) {
          isRedLined = true;
        }

        // Check for "Date of renewal"
        if (/date\s*of\s*renewal/i.test(cell)) {
          // Look in next row or next column
          const val = row[c + 1] ?? rows[r + 1]?.[c];
          if (val) dateOfRenewal = String(val).trim();
        }

        // Check for "Total hours completed"
        if (/total\s*hours\s*completed/i.test(cell)) {
          foundSummaryBlock = true;
          const val = row[c + 1] ?? rows[r + 1]?.[c];
          completedHours = parseNumeric(val);
        }

        // Check for "Total hours renew" or "Number Hours"
        if (/total\s*hours\s*renew/i.test(cell) || /renewal\s*hours/i.test(cell)) {
          foundSummaryBlock = true;
          const val = row[c + 1] ?? rows[r + 1]?.[c];
          renewalHours = parseNumeric(val);
        }

        // Check for "Hours remaning" or "Hours remaining"
        if (/hours\s*reman/i.test(cell)) {
          foundSummaryBlock = true;
          const val = row[c + 1] ?? rows[r + 1]?.[c];
          remainingHours = parseNumeric(val);
        }
      }
    }

    // Parse individual session rows (Row 0 is header: Date, Duration, Feedback, etc.)
    let computedDurationSum = 0;
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const dateVal = String(row[0] || '').trim();
      const durVal = parseNumeric(row[1]);

      if (dateVal && (durVal > 0 || row[2])) {
        if (durVal > 0) computedDurationSum += durVal;
        sessions.push({
          id: `${tabTitle}-${r}`,
          date: dateVal,
          duration: durVal || 1,
          tutorsFeedback: row[2] ? String(row[2]).trim() : undefined,
          nextSessionHomework: row[3] ? String(row[3]).trim() : undefined,
          homeworkStatus: row[5] ? String(row[5]).trim() : undefined,
          testScore: row[6] ? String(row[6]).trim() : undefined,
        });
      }
    }

    // If summary block didn't provide completedHours or if computed sessions sum is valid, reconcile
    if (!foundSummaryBlock || completedHours === 0) {
      completedHours = computedDurationSum;
    }
    if (renewalHours === 0 && completedHours > 0) {
      renewalHours = Math.max(10, completedHours);
    }
    if (remainingHours === 0 && renewalHours > 0) {
      remainingHours = Math.max(0, renewalHours - completedHours);
    }

    result.push({
      tutorName,
      sheetId: spreadsheetId,
      studentTabName: tabTitle,
      dateOfRenewal: dateOfRenewal || undefined,
      renewalHours,
      completedHours,
      remainingHours,
      isRedLined,
      sessions,
    });
  }

  return result;
}
