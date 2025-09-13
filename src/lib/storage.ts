// localStorage utilities for persisting user data

export interface StreakData {
  count: number;
  lastCompletedDate: string | null;
  totalSessions: number;
}

export interface StressData {
  pre: number | null;
  post: number | null;
  sessionDate: string;
}

// Streak management
export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { count: 0, lastCompletedDate: null, totalSessions: 0 };
  }

  try {
    const stored = localStorage.getItem('wren-streak');
    if (!stored) {
      return { count: 0, lastCompletedDate: null, totalSessions: 0 };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to load streak data:', error);
    return { count: 0, lastCompletedDate: null, totalSessions: 0 };
  }
}

export function updateStreakData(completed: boolean = true): StreakData {
  if (typeof window === 'undefined') {
    return { count: 0, lastCompletedDate: null, totalSessions: 0 };
  }

  const current = getStreakData();
  const today = new Date().toDateString();
  
  if (!completed) {
    return current;
  }

  // If already completed today, don't update streak
  if (current.lastCompletedDate === today) {
    return current;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  let newCount = current.count;
  
  if (current.lastCompletedDate === yesterdayStr) {
    // Continuing streak
    newCount = current.count + 1;
  } else if (current.lastCompletedDate === null || current.lastCompletedDate !== today) {
    // Starting new streak or breaking streak
    newCount = 1;
  }

  const updated: StreakData = {
    count: newCount,
    lastCompletedDate: today,
    totalSessions: current.totalSessions + 1
  };

  try {
    localStorage.setItem('wren-streak', JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save streak data:', error);
  }

  return updated;
}

// Stress level management
export function getStressData(): StressData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('wren-stress');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load stress data:', error);
    return null;
  }
}

export function saveStressData(data: Partial<StressData>): void {
  if (typeof window === 'undefined') {
    return;
  }

  const current = getStressData() || {
    pre: null,
    post: null,
    sessionDate: new Date().toISOString()
  };

  const updated = {
    ...current,
    ...data,
    sessionDate: data.sessionDate || current.sessionDate
  };

  try {
    localStorage.setItem('wren-stress', JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save stress data:', error);
  }
}

// Session state management
export function getSessionState(): string {
  if (typeof window === 'undefined') {
    return 'idle';
  }

  try {
    return localStorage.getItem('wren-session-state') || 'idle';
  } catch (error) {
    console.warn('Failed to load session state:', error);
    return 'idle';
  }
}

export function saveSessionState(state: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('wren-session-state', state);
  } catch (error) {
    console.warn('Failed to save session state:', error);
  }
}

// Session management
export function getCurrentSession(): any {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('wren-current-session');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load current session:', error);
    return null;
  }
}

export function updateCurrentSession(data: any): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('wren-current-session', JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save current session:', error);
  }
}

export function clearCurrentSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('wren-current-session');
  } catch (error) {
    console.warn('Failed to clear current session:', error);
  }
}

// Clear all data (for testing/reset)
export function clearAllData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('wren-streak');
    localStorage.removeItem('wren-stress');
    localStorage.removeItem('wren-session-state');
    localStorage.removeItem('wren-current-session');
  } catch (error) {
    console.warn('Failed to clear data:', error);
  }
}

// Listen for storage changes (for cross-tab sync)
export function onStorageChange(callback: (key: string, newValue: any) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (e: StorageEvent) => {
    if (e.key && e.key.startsWith('wren-') && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(e.key, parsed);
      } catch (error) {
        console.warn('Failed to parse storage change:', error);
      }
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}