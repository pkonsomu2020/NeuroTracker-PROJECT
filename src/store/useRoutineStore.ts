import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Routine, Task } from '../types';
import { DEFAULT_ROUTINES, PREMIUM_ROUTINES } from '../utils/constants';
import { duplicateRoutine } from '../utils/helpers';

interface RoutineState {
  routines: Routine[];
  initializeRoutines: () => void;
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (id: string, updates: Partial<Omit<Routine, 'tasks'>>) => void;
  deleteRoutine: (id: string) => void;
  duplicateRoutine: (id: string) => void;
  addTaskToRoutine: (routineId: string, task: Omit<Task, 'id'>) => void;
  updateTaskInRoutine: (routineId: string, taskId: string, updates: Partial<Task>) => void;
  removeTaskFromRoutine: (routineId: string, taskId: string) => void;
  reorderTasksInRoutine: (routineId: string, taskId: string, newOrder: number) => void;
  getAllRoutines: (includesPremium: boolean) => Routine[];
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: [],
      
      initializeRoutines: () => 
        set({ routines: [...DEFAULT_ROUTINES] }),
      
      addRoutine: (routineData) => 
        set((state) => ({
          routines: [
            ...state.routines,
            { 
              ...routineData, 
              id: `routine-${Date.now()}`,
            }
          ]
        })),
      
      updateRoutine: (id, updates) => 
        set((state) => ({
          routines: state.routines.map((routine) => 
            routine.id === id ? { ...routine, ...updates } : routine
          )
        })),
      
      deleteRoutine: (id) => 
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id)
        })),
      
      duplicateRoutine: (id) => 
        set((state) => {
          const routineToClone = state.routines.find(r => r.id === id);
          if (!routineToClone) return state;
          
          const clonedRoutine = duplicateRoutine(routineToClone);
          
          return {
            routines: [...state.routines, clonedRoutine]
          };
        }),
      
      addTaskToRoutine: (routineId, taskData) => 
        set((state) => {
          const routineIndex = state.routines.findIndex(r => r.id === routineId);
          if (routineIndex === -1) return state;
          
          const routine = state.routines[routineIndex];
          const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}`,
            completed: false,
          };
          
          const updatedRoutine = {
            ...routine,
            tasks: [...routine.tasks, newTask]
          };
          
          return {
            routines: [
              ...state.routines.slice(0, routineIndex),
              updatedRoutine,
              ...state.routines.slice(routineIndex + 1)
            ]
          };
        }),
      
      updateTaskInRoutine: (routineId, taskId, updates) => 
        set((state) => {
          const routineIndex = state.routines.findIndex(r => r.id === routineId);
          if (routineIndex === -1) return state;
          
          const routine = state.routines[routineIndex];
          const updatedTasks = routine.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          );
          
          return {
            routines: [
              ...state.routines.slice(0, routineIndex),
              { ...routine, tasks: updatedTasks },
              ...state.routines.slice(routineIndex + 1)
            ]
          };
        }),
      
      removeTaskFromRoutine: (routineId, taskId) => 
        set((state) => {
          const routineIndex = state.routines.findIndex(r => r.id === routineId);
          if (routineIndex === -1) return state;
          
          const routine = state.routines[routineIndex];
          const updatedTasks = routine.tasks.filter(task => task.id !== taskId);
          
          return {
            routines: [
              ...state.routines.slice(0, routineIndex),
              { ...routine, tasks: updatedTasks },
              ...state.routines.slice(routineIndex + 1)
            ]
          };
        }),
      
      reorderTasksInRoutine: (routineId, taskId, newOrder) => 
        set((state) => {
          const routineIndex = state.routines.findIndex(r => r.id === routineId);
          if (routineIndex === -1) return state;
          
          const routine = state.routines[routineIndex];
          const taskIndex = routine.tasks.findIndex(t => t.id === taskId);
          if (taskIndex === -1) return state;
          
          const task = routine.tasks[taskIndex];
          const oldOrder = task.order;
          
          const updatedTasks = routine.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, order: newOrder };
            } else if (oldOrder < newOrder && t.order > oldOrder && t.order <= newOrder) {
              return { ...t, order: t.order - 1 };
            } else if (oldOrder > newOrder && t.order < oldOrder && t.order >= newOrder) {
              return { ...t, order: t.order + 1 };
            }
            return t;
          });
          
          return {
            routines: [
              ...state.routines.slice(0, routineIndex),
              { ...routine, tasks: updatedTasks },
              ...state.routines.slice(routineIndex + 1)
            ]
          };
        }),
      
      getAllRoutines: (includePremium) => {
        const { routines } = get();
        return includePremium 
          ? [...routines, ...PREMIUM_ROUTINES] 
          : [...routines, ...PREMIUM_ROUTINES.map(r => ({ ...r, tasks: [] }))];
      },
    }),
    {
      name: 'neurotrack-routines',
    }
  )
);