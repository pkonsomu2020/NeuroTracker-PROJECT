import React, { useState } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useTimerStore } from '../../store/useTimerStore';
import { generateTimeSlots } from '../../utils/helpers';
import Button from '../ui/Button';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskModal';

const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const { tasks } = useTaskStore();
  const { startTimer } = useTimerStore();
  
  const timeSlots = generateTimeSlots();

  const handlePreviousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleTaskAction = (taskId: string, action: 'edit' | 'delete' | 'start') => {
    if (action === 'start') {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        startTimer(taskId, task.duration);
      }
    }
  };

  // Filter tasks for the selected date (based on scheduled time)
  const filteredTasks = tasks.filter(task => {
    const taskDate = startOfDay(new Date(task.scheduledTime));
    const compareDate = startOfDay(selectedDate);
    return taskDate.getTime() === compareDate.getTime();
  }).sort((a, b) => {
    return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
  });

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Daily Planner
        </h1>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousDay}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToday}
          >
            Today
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextDay}
            icon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddTaskModalOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Task
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
            Time
          </div>
          <div className="p-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
            Tasks
          </div>
        </div>

        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {timeSlots.map((slot, index) => {
            const tasksInSlot = filteredTasks.filter(task => {
              const taskHour = new Date(task.scheduledTime).getHours();
              return taskHour === slot.hour;
            });

            return (
              <div 
                key={index}
                className={`grid grid-cols-[100px_1fr] border-b border-gray-200 dark:border-gray-700 ${
                  new Date().getHours() === slot.hour ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="p-4 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                  {slot.label}
                </div>
                <div className="p-2">
                  {tasksInSlot.length > 0 ? (
                    <div className="space-y-2">
                      {tasksInSlot.map(task => (
                        <TaskItem 
                          key={task.id} 
                          task={task} 
                          onAction={handleTaskAction}
                        />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="h-full min-h-[50px] flex items-center justify-center text-gray-400 text-sm"
                      onClick={() => setIsAddTaskModalOpen(true)}
                    >
                      <button className="w-full h-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded">
                        + Add task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default DailyPlanner;