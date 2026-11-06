/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GoogleSheetTabInfo {
  sheetId: number;
  title: string;
  index: number;
  rowCount?: number;
  columnCount?: number;
  tabColor?: { red?: number; green?: number; blue?: number };
}

export interface GoogleSpreadsheetMetadata {
  id: string;
  title: string;
  sheets: GoogleSheetTabInfo[];
}

export interface SheetValueRange {
  range: string;
  majorDimension?: string;
  values?: (string | number | boolean | null)[][] | any[][];
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Searches for folders in Google Drive
 */
export async function searchDriveFolders(
  accessToken: string,
  searchName?: string
): Promise<GoogleDriveFile[]> {
  let query = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
  if (searchName && searchName.trim().length > 0) {
    const escaped = searchName.replace(/'/g, "\\'");
    query += ` and name contains '${escaped}'`;
  }

  const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,modifiedTime)&pageSize=50&orderBy=name`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to list folders from Google Drive (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Gets details for a single Google Drive folder
 */
export async function getDriveFolder(
  accessToken: string,
  folderId: string
): Promise<GoogleDriveFile> {
  const url = `${DRIVE_API_BASE}/files/${folderId}?fields=id,name,mimeType,modifiedTime`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch folder details for ${folderId}: ${errText}`);
  }

  return await res.json();
}

/**
 * Lists all Google Sheets located inside a specific Drive folder
 */
export async function listSpreadsheetsInFolder(
  accessToken: string,
  folderId: string
): Promise<GoogleDriveFile[]> {
  const query = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
  const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=100&orderBy=name`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to list spreadsheets in folder ${folderId}: ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Fetches spreadsheet metadata including all sheet tabs and tab colors
 */
export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<GoogleSpreadsheetMetadata> {
  const url = `${SHEETS_API_BASE}/${spreadsheetId}?fields=properties.title,sheets.properties(sheetId,title,index,gridProperties,tabColor)`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch spreadsheet ${spreadsheetId} metadata: ${errText}`);
  }

  const data = await res.json();
  return {
    id: spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId,
      title: s.properties?.title,
      index: s.properties?.index,
      rowCount: s.properties?.gridProperties?.rowCount,
      columnCount: s.properties?.gridProperties?.columnCount,
      tabColor: s.properties?.tabColor,
    })),
  };
}

/**
 * Fetches values from a range of a sheet
 */
export async function getSheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<SheetValueRange> {
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch sheet range ${range}: ${errText}`);
  }

  return await res.json();
}

/**
 * Batch fetches multiple ranges from a spreadsheet
 */
export async function batchGetSheetValues(
  accessToken: string,
  spreadsheetId: string,
  ranges: string[]
): Promise<SheetValueRange[]> {
  if (ranges.length === 0) return [];

  // Google Sheets limits ranges per request, chunk if necessary
  const chunkSize = 50;
  const allResults: SheetValueRange[] = [];

  for (let i = 0; i < ranges.length; i += chunkSize) {
    const slice = ranges.slice(i, i + chunkSize);
    const params = slice.map((r) => `ranges=${encodeURIComponent(r)}`).join('&');
    const url = `${SHEETS_API_BASE}/${spreadsheetId}/values:batchGet?${params}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Batch get values failed for ${spreadsheetId}: ${errText}`);
    }

    const data = await res.json();
    if (data.valueRanges) {
      allResults.push(...data.valueRanges);
    }
  }

  return allResults;
}

/**
 * Helper to extract folder ID from either a bare ID or a full Google Drive URL
 */
export function extractDriveFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Match https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ
  const folderUrlMatch = trimmed.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (folderUrlMatch && folderUrlMatch[1]) {
    return folderUrlMatch[1];
  }
  // Match https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit
  const docUrlMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (docUrlMatch && docUrlMatch[1]) {
    return docUrlMatch[1];
  }
  return trimmed;
}
