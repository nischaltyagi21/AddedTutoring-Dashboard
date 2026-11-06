/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  TutoringAppData,
  DriveFolderConfig,
  StudentTutorHours,
} from '../types/tutoring';
import {
  MOCK_STUDENT_TUTOR_HOURS,
  aggregateStudents,
  buildTutorProfiles,
  buildTutorStudentPairs,
} from '../data/mockData';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  setAccessTokenInMemory,
} from '../services/auth';
import {
  listSpreadsheetsInFolder,
  getSpreadsheetMetadata,
  batchGetSheetValues,
} from '../services/driveSheetsApi';
import { parseTutorSpreadsheet } from '../services/dataParser';

interface TutoringContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticating: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  driveConfig: DriveFolderConfig;
  updateDriveConfig: (config: Partial<DriveFolderConfig>) => void;
  data: TutoringAppData;
  login: () => Promise<void>;
  logoutUser: () => Promise<void>;
  syncWithGoogleDrive: () => Promise<void>;
  loadDemoData: () => void;
}

const STORAGE_KEY_DRIVE_CONFIG = 'ae_tutoring_hours_drive_config';
const STORAGE_KEY_THEME = 'ae_tutoring_theme_v2';

const initialDriveConfig: DriveFolderConfig = {
  studentHoursFolderId: '',
  studentHoursFolderName: '',
  autoSyncIntervalMinutes: 5,
};

function computeAppData(
  tutorHours: StudentTutorHours[],
  dataSource: 'live_google_drive' | 'demo_snapshot',
  syncStatus: 'idle' | 'syncing' | 'success' | 'error' = 'idle',
  errorMessage?: string
): TutoringAppData {
  const aggregatedStudents = aggregateStudents(tutorHours);
  const tutorProfiles = buildTutorProfiles(tutorHours);
  const tutorStudentPairs = buildTutorStudentPairs(tutorHours);

  let totalHoursCompleted = 0;
  let totalHoursRemaining = 0;
  let totalHoursPurchased = 0;
  let renewalNeededCount = 0;
  let totalActiveStudents = 0;
  let totalInactiveStudents = 0;

  for (const s of aggregatedStudents) {
    if (s.status === 'inactive' || s.isRedLined) {
      totalInactiveStudents++;
      continue;
    }
    totalHoursCompleted += s.totalCompletedHours;
    totalHoursRemaining += s.totalRemainingHours;
    totalHoursPurchased += s.totalRenewalHours;
    if (s.totalRemainingHours <= 1 && s.totalCompletedHours > 0) {
      renewalNeededCount++;
    }
    if (s.totalRemainingHours > 0 || s.totalCompletedHours > 0) {
      totalActiveStudents++;
    }
  }

  return {
    aggregatedStudents,
    tutorProfiles,
    tutorStudentPairs,
    totalActiveStudents,
    totalInactiveStudents,
    totalTutorsCount: tutorProfiles.length,
    totalHoursCompleted,
    totalHoursRemaining,
    totalHoursPurchased,
    renewalNeededCount,
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dataSource,
    syncStatus,
    errorMessage,
  };
}

const TutoringContext = createContext<TutoringContextType | undefined>(undefined);

export const TutoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Theme state: defaults to 'light' for clean readability
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default to light mode as requested
  });

  // Google Drive folder config
  const [driveConfig, setDriveConfigState] = useState<DriveFolderConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DRIVE_CONFIG);
    if (saved) {
      try {
        return { ...initialDriveConfig, ...JSON.parse(saved) };
      } catch {}
    }
    return initialDriveConfig;
  });

  // Raw data buffers
  const [rawTutorHours, setRawTutorHours] = useState<StudentTutorHours[]>(MOCK_STUDENT_TUTOR_HOURS);
  const [dataSource, setDataSource] = useState<'live_google_drive' | 'demo_snapshot'>('demo_snapshot');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // Computed data
  const appData = computeAppData(rawTutorHours, dataSource, syncStatus, errorMessage);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const updateDriveConfig = (partial: Partial<DriveFolderConfig>) => {
    setDriveConfigState((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY_DRIVE_CONFIG, JSON.stringify(updated));
      return updated;
    });
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, token) => {
        setUser(authedUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async () => {
    setIsAuthenticating(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        if (driveConfig.studentHoursFolderId) {
          setTimeout(() => {
            syncWithGoogleDriveInternal(result.accessToken, driveConfig);
          }, 300);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Google sign-in failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setAccessTokenInMemory(null);
  };

  const syncWithGoogleDriveInternal = async (token: string, config: DriveFolderConfig) => {
    if (!token) {
      setSyncStatus('error');
      setErrorMessage('Please sign in with Google to sync with Google Drive.');
      return;
    }

    if (!config.studentHoursFolderId) {
      setSyncStatus('error');
      setErrorMessage('Please set your Student Hours Drive Folder in Settings to sync live sheets.');
      return;
    }

    setSyncStatus('syncing');
    setErrorMessage(undefined);

    try {
      const parsedTutorHours: StudentTutorHours[] = [];
      const tutorFiles = await listSpreadsheetsInFolder(token, config.studentHoursFolderId);

      for (const file of tutorFiles) {
        const metadata = await getSpreadsheetMetadata(token, file.id);
        const ranges = metadata.sheets.map((s) => `'${s.title}'!A1:L35`);
        const valueRanges = await batchGetSheetValues(token, file.id, ranges);

        const tabDataMap = new Map<string, (string | number | boolean | null)[][]>();
        for (let i = 0; i < metadata.sheets.length; i++) {
          const tabTitle = metadata.sheets[i].title;
          const rangeData = valueRanges[i]?.values || [];
          tabDataMap.set(tabTitle, rangeData);
        }

        const parsedFromSheet = parseTutorSpreadsheet(file.id, file.name, metadata.sheets, tabDataMap);
        parsedTutorHours.push(...parsedFromSheet);
      }

      if (parsedTutorHours.length > 0) {
        setRawTutorHours(parsedTutorHours);
      }

      setDataSource('live_google_drive');
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 4000);
    } catch (err: any) {
      console.error('Sync failed:', err);
      setSyncStatus('error');
      setErrorMessage(err.message || 'Failed to sync with Google Drive');
    }
  };

  const syncWithGoogleDrive = useCallback(async () => {
    let token = accessToken;
    if (!token) {
      token = await getAccessToken();
    }
    if (!token) {
      await login();
      token = await getAccessToken();
    }
    if (token) {
      await syncWithGoogleDriveInternal(token, driveConfig);
    }
  }, [accessToken, driveConfig]);

  const loadDemoData = () => {
    setRawTutorHours(MOCK_STUDENT_TUTOR_HOURS);
    setDataSource('demo_snapshot');
    setSyncStatus('idle');
    setErrorMessage(undefined);
  };

  // Auto-sync interval timer
  useEffect(() => {
    if (
      driveConfig.autoSyncIntervalMinutes <= 0 ||
      dataSource !== 'live_google_drive' ||
      !accessToken
    ) {
      return;
    }

    const intervalMs = driveConfig.autoSyncIntervalMinutes * 60 * 1000;
    const timer = setInterval(() => {
      syncWithGoogleDrive();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [driveConfig.autoSyncIntervalMinutes, dataSource, accessToken, syncWithGoogleDrive]);

  return (
    <TutoringContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticating,
        theme,
        setTheme,
        toggleTheme,
        driveConfig,
        updateDriveConfig,
        data: appData,
        login,
        logoutUser,
        syncWithGoogleDrive,
        loadDemoData,
      }}
    >
      {children}
    </TutoringContext.Provider>
  );
};

export const useTutoring = () => {
  const context = useContext(TutoringContext);
  if (!context) {
    throw new Error('useTutoring must be used within a TutoringProvider');
  }
  return context;
};
