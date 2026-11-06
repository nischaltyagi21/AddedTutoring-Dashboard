/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sun,
  Moon,
  RefreshCw,
  FolderSync,
  LogOut,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { useTutoring } from '../context/TutoringContext';

interface HeaderProps {
  onOpenDriveModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDriveModal }) => {
  const {
    user,
    isAuthenticating,
    theme,
    toggleTheme,
    data,
    login,
    logoutUser,
    syncWithGoogleDrive,
  } = useTutoring();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand & Title with Live Dot Motion Graphic in Upper-Left Corner */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
            {/* Blinking Live Dot Motion Graphic on upper-left corner */}
            <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center" title="Live data active">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
            </span>
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl dark:text-white">
                AddedTutoring
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-90" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Live data
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Last Synced Indicator */}
          {data.lastSyncedAt && (
            <span className="hidden text-xs text-gray-500 sm:inline dark:text-gray-400">
              Updated {data.lastSyncedAt}
            </span>
          )}

          {/* Sync Button */}
          <button
            onClick={() => syncWithGoogleDrive()}
            disabled={data.syncStatus === 'syncing'}
            title="Refresh & sync data from Google Drive sheets"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${data.syncStatus === 'syncing' ? 'animate-spin text-indigo-500' : ''}`} />
            <span>{data.syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          {/* Google Drive Folder Settings */}
          <button
            onClick={onOpenDriveModal}
            title="Configure Google Drive Student Hours Folder"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <FolderSync className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Drive Folder</span>
          </button>

          {/* Single Theme Toggle Button (Sun & Moon Icon Only, No Text) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 bg-white p-2 text-gray-700 shadow-sm transition-all hover:bg-gray-100 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Google Auth Status / Button */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-2 dark:border-gray-700">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="h-7 w-7 rounded-full border border-indigo-300 object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden flex-col text-left lg:flex">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Connected</span>
              </div>
              <button
                onClick={logoutUser}
                title="Sign out of Google"
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isAuthenticating ? 'Connecting...' : 'Connect Drive'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner if any */}
      {data.errorMessage && (
        <div className="flex items-center gap-2 border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{data.errorMessage}</span>
        </div>
      )}
    </header>
  );
};
