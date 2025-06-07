export type OnboardingAnswers = {
  reminderPreference: 'voice' | 'visual';
  primaryGoal: 'focus' | 'routines' | 'distractions';
  routineStyle: 'rigid' | 'flexible' | 'mix';
};

export type UserSettings = {
  theme: 'light' | 'dark' | 'low-stimulation';
  voiceReminders: boolean;
  isPremium: boolean;
  onboardingCompleted: boolean;
  onboardingAnswers: OnboardingAnswers | null;
};

export type MoodEntry = {
  id: string;
  timestamp: Date;
  focusLevel: 1 | 2 | 3 | 4 | 5;
  distractions: string[];
  notes: string;
  taskId: string;
};

export type Task = {
  id: string;
  name: string;
  duration: number; // in minutes
  colorCode: string;
  icon: string;
  completed: boolean;
  scheduledTime: Date;
  order: number;
};

export type Routine = {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  tasks: Task[];
};

export type TimerSettings = {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
};