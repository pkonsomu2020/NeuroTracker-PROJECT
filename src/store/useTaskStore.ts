import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  reorderTasks: (taskId: string, newOrder: number) => void;
  rescheduleTask: (id: string, newTime: Date) => void;
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      
      addTask: (taskData) => 
        set((state) => ({
          tasks: [
            ...state.tasks,
            { 
              ...taskData, 
              id: `task-${Date.now()}`,
              completed: false
            }
          ]
        })),
      
      updateTask: (id, updates) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updates } : task
          )
        })),
      
      deleteTask: (id) => 
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      
      completeTask: (id) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, completed: true } : task
          )
        })),
      
      reorderTasks: (taskId, newOrder) => 
        set((state) => {
          const taskIndex = state.tasks.findIndex(t => t.id === taskId);
          if (taskIndex === -1) return state;
          
          const task = state.tasks[taskIndex];
          const oldOrder = task.order;
          
          return {
            tasks: state.tasks.map(t => {
              if (t.id === taskId) {
                return { ...t, order: newOrder };
              } else if (oldOrder < newOrder && t.order > oldOrder && t.order <= newOrder) {
                return { ...t, order: t.order - 1 };
              } else if (oldOrder > newOrder && t.order < oldOrder && t.order >= newOrder) {
                return { ...t, order: t.order + 1 };
              }
              return t;
            })
          };
        }),
      
      rescheduleTask: (id, newTime) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, scheduledTime: newTime } : task
          )
        })),
      
      clearCompletedTasks: () => 
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed)
        })),
    }),
    {
      name: 'neurotrack-tasks',
    }
  )
);