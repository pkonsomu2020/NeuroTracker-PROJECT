import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import { Task, Routine } from '../types';

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};

export const calculateEndTime = (startTime: Date, durationMinutes: number): Date => {
  return addMinutes(startTime, durationMinutes);
};

export const setTimeForTask = (task: Task, hourOfDay: number, minuteOfHour: number): Task => {
  const newDate = new Date();
  newDate.setHours(hourOfDay, minuteOfHour, 0, 0);
  
  return {
    ...task,
    scheduledTime: newDate,
  };
};

export const generateTimeSlots = (): { label: string; hour: number; minute: number }[] => {
  const slots = [];
  const now = new Date();
  const startHour = 5; // 5 AM
  
  for (let hour = startHour; hour < startHour + 24; hour++) {
    const h = hour % 24;
    slots.push({ 
      label: format(setHours(setMinutes(now, 0), h), 'h a'), 
      hour: h, 
      minute: 0 
    });
  }
  
  return slots;
};

export const duplicateRoutine = (routine: Routine): Routine => {
  const newId = `${Date.now()}`;
  
  return {
    ...routine,
    id: newId,
    name: `${routine.name} (Copy)`,
    tasks: routine.tasks.map(task => ({
      ...task,
      id: `${newId}-${task.order}`,
      completed: false,
    })),
  };
};

export const speakText = (text: string, enabled: boolean): void => {
  if (!enabled || !window.speechSynthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower than default
  window.speechSynthesis.speak(utterance);
};

export const getRandomEmoji = (): string => {
  const emojis = ['😊', '😌', '😤', '😓', '😑', '😵‍💫', '🤔', '😎', '🙂', '😫'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}