/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Folder,
  FolderSearch,
  Check,
  RefreshCw,
  AlertCircle,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTutoring } from '../context/TutoringContext';
import {
  searchDriveFolders,
  extractDriveFolderId,
  GoogleDriveFile,
} from '../services/driveSheetsApi';

interface DriveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriveConfigModal: React.FC<DriveConfigModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    accessToken,
    login,
    driveConfig,
    updateDriveConfig,
    syncWithGoogleDrive,
    loadDemoData,
  } = useTutoring();

  const [studentHoursInput, setStudentHoursInput] = useState(driveConfig.studentHoursFolderId || '');
  const [intervalMinutes, setIntervalMinutes] = useState(driveConfig.autoSyncIntervalMinutes || 5);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [driveFolders, setDriveFolders] = useState<GoogleDriveFile[]>([]);
  const [isSearchingFolders, setIsSearchingFolders] = useState(false);

  useEffect(() => {
    setStudentHoursInput(driveConfig.studentHoursFolderId || '');
    setIntervalMinutes(driveConfig.autoSyncIntervalMinutes || 5);
  }, [driveConfig, isOpen]);

  if (!isOpen) return null;

  const handleBrowseFolders = async () => {
    if (!accessToken) {
      await login();
    }
    setIsBrowsing(true);
    setIsSearchingFolders(true);
    try {
      const folders = await searchDriveFolders(accessToken || '', '');
      setDriveFolders(folders);
    } catch (err) {
      console.error('Error listing drive folders:', err);
    } finally {
      setIsSearchingFolders(false);
    }
  };

  const handleSelectFolder = (folder: GoogleDriveFile) => {
    setStudentHoursInput(folder.id);
    updateDriveConfig({
      studentHoursFolderId: folder.id,
      studentHoursFolderName: folder.name,
    });
    setIsBrowsing(false);
  };

  const handleSaveAndSync = async () => {
    const cleanStudentId = extractDriveFolderId(studentHoursInput);

    updateDriveConfig({
      studentHoursFolderId: cleanStudentId,
      autoSyncIntervalMinutes: Number(intervalMinutes),
    });

    onClose();
    await syncWithGoogleDrive();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <FolderSearch className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Connect Student Hours Drive Folder
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sync tutor spreadsheets and student sub-sheet session tabs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* User Sign-In Banner */}
          {!user ? (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Sign in with Google to allow folder scanning and automatic sync.</span>
              </div>
              <button
                onClick={login}
                className="rounded-lg bg-indigo-600 px-3 py-1 font-semibold text-white shadow hover:bg-indigo-700"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Connected as <strong>{user.email}</strong></span>
              </div>
            </div>
          )}

          {/* Folder Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Folder className="h-4 w-4 text-indigo-500" />
                <span>Student Hours Google Drive Folder</span>
              </label>
              <button
                type="button"
                onClick={handleBrowseFolders}
                disabled={!user}
                className="text-xs font-semibold text-indigo-600 hover:underline disabled:opacity-50 dark:text-indigo-400"
              >
                Browse My Drive...
              </button>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Paste your Google Drive folder link or ID. Every Google Sheet inside is treated as a Tutor sheet (e.g. "Mohseena Ma'am - Session Tracker"), with sub-sheets for each student.
            </p>
            <input
              type="text"
              value={studentHoursInput}
              onChange={(e) => setStudentHoursInput(e.target.value)}
              placeholder="e.g. https://drive.google.com/drive/folders/1aBcDeFg... or Folder ID"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Folder Picker Sub-panel */}
          {isBrowsing && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Select Student Hours Folder
                </span>
                <button
                  onClick={() => setIsBrowsing(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>

              {isSearchingFolders ? (
                <div className="py-4 text-center text-xs text-indigo-600 dark:text-indigo-400">
                  <RefreshCw className="mx-auto h-5 w-5 animate-spin mb-1" />
                  Scanning Google Drive folders...
                </div>
              ) : driveFolders.length === 0 ? (
                <p className="py-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  No folders found. You can paste the folder URL directly into the input above.
                </p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {driveFolders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFolder(f)}
                      className="flex w-full items-center justify-between rounded-lg bg-white p-2 text-left text-xs hover:bg-indigo-100/60 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        📁 {f.name}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">Select</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Auto-Sync Frequency */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 dark:text-gray-100">
              Automatic Sync Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Manual Only', value: 0 },
                { label: 'Every 1 min', value: 1 },
                { label: 'Every 5 min (Recommended)', value: 5 },
                { label: 'Every 15 min', value: 15 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIntervalMinutes(opt.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    intervalMinutes === opt.value
                      ? 'bg-indigo-600 text-white shadow'
                      : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndSync}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Save & Sync Live
          </button>
        </div>
      </div>
    </div>
  );
};
