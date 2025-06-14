import { Routine } from '../types';

export const DEFAULT_TIMER_SETTINGS = {
  focusDuration: 25,
  breakDuration: 5,
};

export const DEFAULT_USER_SETTINGS = {
  theme: 'light',
  voiceReminders: false,
  isPremium: false,
  onboardingCompleted: false,
  onboardingAnswers: null,
};

export const ONBOARDING_QUESTIONS = [
  {
    id: 'reminderPreference',
    question: 'Do you prefer voice or visual reminders?',
    options: [
      { value: 'voice', label: 'Voice Reminders' },
      { value: 'visual', label: 'Visual Reminders' },
    ],
  },
  {
    id: 'primaryGoal',
    question: "What's your primary goal?",
    options: [
      { value: 'focus', label: 'Staying on task' },
      { value: 'routines', label: 'Building routines' },
      { value: 'distractions', label: 'Reducing distractions' },
    ],
  },
  {
    id: 'routineStyle',
    question: 'What is your preferred routine style?',
    options: [
      { value: 'rigid', label: 'Rigid (structured schedules)' },
      { value: 'flexible', label: 'Flexible (adaptable plans)' },
      { value: 'mix', label: 'Mix of both' },
    ],
  },
];

export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: '1',
    name: 'Morning Routine',
    description: 'Start your day right with these steps',
    isPremium: false,
    tasks: [
      {
        id: '1-1',
        name: 'Wake up & hydrate',
        duration: 5,
        colorCode: '#10b981',
        icon: 'coffee',
        completed: false,
        scheduledTime: new Date(),
        order: 0,
      },
      {
        id: '1-2',
        name: 'Quick stretch',
        duration: 10,
        colorCode: '#8b5cf6',
        icon: 'activity',
        completed: false,
        scheduledTime: new Date(),
        order: 1,
      },
      {
        id: '1-3',
        name: 'Breakfast',
        duration: 15,
        colorCode: '#f59e0b',
        icon: 'utensils',
        completed: false,
        scheduledTime: new Date(),
        order: 2,
      },
      {
        id: '1-4',
        name: 'Plan your day',
        duration: 10,
        colorCode: '#0d9488',
        icon: 'list-checks',
        completed: false,
        scheduledTime: new Date(),
        order: 3,
      },
    ],
  },
  {
    id: '2',
    name: 'Work Day',
    description: 'Structured workflow for productive days',
    isPremium: false,
    tasks: [
      {
        id: '2-1',
        name: 'Email check',
        duration: 15,
        colorCode: '#0d9488',
        icon: 'mail',
        completed: false,
        scheduledTime: new Date(),
        order: 0,
      },
      {
        id: '2-2',
        name: 'Deep work session',
        duration: 90,
        colorCode: '#8b5cf6',
        icon: 'brain',
        completed: false,
        scheduledTime: new Date(),
        order: 1,
      },
      {
        id: '2-3',
        name: 'Lunch break',
        duration: 30,
        colorCode: '#f59e0b',
        icon: 'utensils',
        completed: false,
        scheduledTime: new Date(),
        order: 2,
      },
      {
        id: '2-4',
        name: 'Meeting prep',
        duration: 15,
        colorCode: '#ef4444',
        icon: 'clipboard-list',
        completed: false,
        scheduledTime: new Date(),
        order: 3,
      },
    ],
  },
  {
    id: '3',
    name: 'Wind-down',
    description: 'Evening routine to relax and prepare for tomorrow',
    isPremium: false,
    tasks: [
      {
        id: '3-1',
        name: 'Digital sunset',
        duration: 10,
        colorCode: '#8b5cf6',
        icon: 'sunset',
        completed: false,
        scheduledTime: new Date(),
        order: 0,
      },
      {
        id: '3-2',
        name: 'Light stretching',
        duration: 15,
        colorCode: '#10b981',
        icon: 'activity',
        completed: false,
        scheduledTime: new Date(),
        order: 1,
      },
      {
        id: '3-3',
        name: 'Journal',
        duration: 10,
        colorCode: '#0d9488',
        icon: 'book',
        completed: false,
        scheduledTime: new Date(),
        order: 2,
      },
      {
        id: '3-4',
        name: 'Set priorities for tomorrow',
        duration: 5,
        colorCode: '#f59e0b',
        icon: 'list-checks',
        completed: false,
        scheduledTime: new Date(),
        order: 3,
      },
    ],
  },
];

export const PREMIUM_ROUTINES: Routine[] = [
  {
    id: '4',
    name: 'Study Session',
    description: 'Optimized for focus and retention',
    isPremium: true,
    tasks: [
      {
        id: '4-1',
        name: 'Environment setup',
        duration: 5,
        colorCode: '#0d9488',
        icon: 'layout',
        completed: false,
        scheduledTime: new Date(),
        order: 0,
      },
      {
        id: '4-2',
        name: 'Quick review',
        duration: 10,
        colorCode: '#8b5cf6',
        icon: 'repeat',
        completed: false,
        scheduledTime: new Date(),
        order: 1,
      },
      {
        id: '4-3',
        name: 'Deep learning',
        duration: 25,
        colorCode: '#ef4444',
        icon: 'brain',
        completed: false,
        scheduledTime: new Date(),
        order: 2,
      },
      {
        id: '4-4',
        name: 'Take notes',
        duration: 15,
        colorCode: '#f59e0b',
        icon: 'pencil',
        completed: false,
        scheduledTime: new Date(),
        order: 3,
      },
    ],
  },
  {
    id: '5',
    name: 'Sensory Reset',
    description: 'For when you feel overwhelmed',
    isPremium: true,
    tasks: [
      {
        id: '5-1',
        name: 'Breathing exercise',
        duration: 5,
        colorCode: '#10b981',
        icon: 'wind',
        completed: false,
        scheduledTime: new Date(),
        order: 0,
      },
      {
        id: '5-2',
        name: 'Sensory break',
        duration: 10,
        colorCode: '#8b5cf6',
        icon: 'eye',
        completed: false,
        scheduledTime: new Date(),
        order: 1,
      },
      {
        id: '5-3',
        name: 'Hydrate',
        duration: 5,
        colorCode: '#0d9488',
        icon: 'droplets',
        completed: false,
        scheduledTime: new Date(),
        order: 2,
      },
      {
        id: '5-4',
        name: 'Gentle movement',
        duration: 10,
        colorCode: '#f59e0b',
        icon: 'activity',
        completed: false,
        scheduledTime: new Date(),
        order: 3,
      },
    ],
  },
];