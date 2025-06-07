import React, { useState } from 'react';
import { MoreVertical, Play, Edit, Trash2 } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';
import { Task } from '../../types';
import Button from '../ui/Button';
import TaskEditModal from './TaskEditModal';

interface TaskItemProps {
  task: Task;
  onAction: (taskId: string, action: 'edit' | 'delete' | 'start') => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onAction }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleEdit = () => {
    setIsEditModalOpen(true);
    setShowActions(false);
  };
  
  const handleDelete = () => {
    onAction(task.id, 'delete');
    setShowActions(false);
  };
  
  const handleStartTimer = () => {
    onAction(task.id, 'start');
    setShowActions(false);
  };

  return (
    <div 
      className={`
        p-3 rounded-md relative
        ${task.completed ? 'opacity-70' : ''}
      `}
      style={{ backgroundColor: `${task.colorCode}20` }} // Use the color with transparency
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-3" 
            style={{ backgroundColor: task.colorCode }}
          ></div>
          <div>
            <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
              {task.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Duration: {formatDuration(task.duration)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={handleStartTimer}
            aria-label="Start timer"
          >
            <Play className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setShowActions(!showActions)}
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-md rounded-md z-10 w-32 py-1 border border-gray-200 dark:border-gray-700">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-error-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
      />
    </div>
  );
};

export default TaskItem;