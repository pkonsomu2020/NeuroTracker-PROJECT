import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MoodEntry } from '../types';

interface MoodState {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<MoodEntry>) => void;
  getEntriesByDate: (date: Date) => MoodEntry[];
  getEntriesByTask: (taskId: string) => MoodEntry[];
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (entryData) => 
        set((state) => ({
          entries: [
            ...state.entries,
            { 
              ...entryData, 
              id: `mood-${Date.now()}` 
            }
          ]
        })),
      
      deleteEntry: (id) => 
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id)
        })),
      
      updateEntry: (id, updates) => 
        set((state) => ({
          entries: state.entries.map((entry) => 
            entry.id === id ? { ...entry, ...updates } : entry
          )
        })),
      
      getEntriesByDate: (date) => {
        const { entries } = get();
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        return entries.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= targetDate && entryDate < nextDay;
        });
      },
      
      getEntriesByTask: (taskId) => {
        const { entries } = get();
        return entries.filter(entry => entry.taskId === taskId);
      },
    }),
    {
      name: 'neurotrack-mood',
    }
  )
);