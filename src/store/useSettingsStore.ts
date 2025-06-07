import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, OnboardingAnswers } from '../types';
import { DEFAULT_USER_SETTINGS } from '../utils/constants';

interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setTheme: (theme: UserSettings['theme']) => void;
  toggleVoiceReminders: () => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  upgradeAccount: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_USER_SETTINGS,
      
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      setTheme: (theme) => 
        set((state) => ({
          settings: { ...state.settings, theme }
        })),
      
      toggleVoiceReminders: () => 
        set((state) => ({
          settings: { 
            ...state.settings, 
            voiceReminders: !state.settings.voiceReminders 
          }
        })),
      
      completeOnboarding: (answers) => 
        set((state) => ({
          settings: { 
            ...state.settings, 
            onboardingCompleted: true,
            onboardingAnswers: answers
          }
        })),
      
      upgradeAccount: () => 
        set((state) => ({
          settings: { ...state.settings, isPremium: true }
        })),
      
      resetSettings: () => 
        set({ settings: DEFAULT_USER_SETTINGS }),
    }),
    {
      name: 'neurotrack-settings',
    }
  )
);