import { create } from 'zustand';
import { TimerSettings } from '../types';
import { DEFAULT_TIMER_SETTINGS } from '../utils/constants';

interface TimerState {
  settings: TimerSettings;
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  currentTaskId: string | null;
  timeRemaining: number; // in seconds
  updateSettings: (settings: Partial<TimerSettings>) => void;
  startTimer: (taskId: string, customDuration?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  startBreak: () => void;
  tick: () => void;
  resetTimer: () => void;
}

export const useTimerStore = create<TimerState>()((set) => ({
  settings: DEFAULT_TIMER_SETTINGS,
  isRunning: false,
  isPaused: false,
  isBreak: false,
  currentTaskId: null,
  timeRemaining: DEFAULT_TIMER_SETTINGS.focusDuration * 60,
  
  updateSettings: (newSettings) => 
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
      timeRemaining: state.isBreak 
        ? (newSettings.breakDuration ?? state.settings.breakDuration) * 60
        : (newSettings.focusDuration ?? state.settings.focusDuration) * 60
    })),
  
  startTimer: (taskId, customDuration) => 
    set((state) => ({
      isRunning: true,
      isPaused: false,
      isBreak: false,
      currentTaskId: taskId,
      timeRemaining: customDuration 
        ? customDuration * 60 
        : state.settings.focusDuration * 60
    })),
  
  pauseTimer: () => 
    set({ isPaused: true }),
  
  resumeTimer: () => 
    set({ isPaused: false }),
  
  stopTimer: () => 
    set((state) => ({
      isRunning: false,
      isPaused: false,
      timeRemaining: state.isBreak 
        ? state.settings.breakDuration * 60 
        : state.settings.focusDuration * 60
    })),
  
  startBreak: () => 
    set((state) => ({
      isRunning: true,
      isPaused: false,
      isBreak: true,
      timeRemaining: state.settings.breakDuration * 60
    })),
  
  tick: () => 
    set((state) => ({
      timeRemaining: Math.max(0, state.timeRemaining - 1)
    })),
  
  resetTimer: () => 
    set((state) => ({
      isRunning: false,
      isPaused: false,
      isBreak: false,
      currentTaskId: null,
      timeRemaining: state.settings.focusDuration * 60
    })),
}));