import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Task } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { generateTimeSlots } from '../../utils/helpers';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';

const COLORS = [
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#0d9488', label: 'Teal' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#10b981', label: 'Green' },
  { value: '#ef4444', label: 'Red' },
  { value: '#3b82f6', label: 'Blue' },
];

const ICONS = [
  { value: 'activity', label: 'Activity' },
  { value: 'brain', label: 'Brain' },
  { value: 'book', label: 'Book' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'mail', label: 'Mail' },
  { value: 'phone', label: 'Phone' },
  { value: 'settings', label: 'Settings' },
  { value: 'clipboard-list', label: 'List' },
];

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ 
  isOpen, 
  onClose,
  task,
}) => {
  const [name, setName] = useState(task.name);
  const [duration, setDuration] = useState(task.duration);
  const [colorCode, setColorCode] = useState(task.colorCode);
  const [icon, setIcon] = useState(task.icon);
  const [selectedHour, setSelectedHour] = useState(new Date(task.scheduledTime).getHours().toString());
  const [selectedMinute, setSelectedMinute] = useState(new Date(task.scheduledTime).getMinutes().toString());
  
  const { updateTask, deleteTask } = useTaskStore();
  const timeSlots = generateTimeSlots();
  
  useEffect(() => {
    if (isOpen) {
      setName(task.name);
      setDuration(task.duration);
      setColorCode(task.colorCode);
      setIcon(task.icon);
      setSelectedHour(new Date(task.scheduledTime).getHours().toString());
      setSelectedMinute(new Date(task.scheduledTime).getMinutes().toString());
    }
  }, [isOpen, task]);
  
  const handleSubmit = () => {
    if (name.trim() === '') return;
    
    const scheduledTime = new Date(task.scheduledTime);
    scheduledTime.setHours(parseInt(selectedHour), parseInt(selectedMinute), 0, 0);
    
    updateTask(task.id, {
      name,
      duration,
      colorCode,
      icon,
      scheduledTime,
    });
    
    onClose();
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };
  
  const hourOptions = timeSlots.map(slot => ({
    value: slot.hour.toString(),
    label: format(new Date().setHours(slot.hour, 0, 0), 'h a'),
  }));
  
  const minuteOptions = [
    { value: '0', label: '00' },
    { value: '15', label: '15' },
    { value: '30', label: '30' },
    { value: '45', label: '45' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      footer={
        <>
          <Button variant="danger\" onClick={handleDelete}>
            Delete
          </Button>
          <div className="flex-1"></div>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!name.trim()}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Task Name"
          placeholder="Enter task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (minutes)
            </label>
            <Input
              type="number"
              min={5}
              max={240}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
              fullWidth
              leftIcon={<Clock className="h-4 w-4" />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <div className="flex space-x-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all ${
                    colorCode === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setColorCode(color.value)}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Icon"
            options={ICONS}
            value={icon}
            onChange={setIcon}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <div className="flex space-x-2">
              <Dropdown
                options={hourOptions}
                value={selectedHour}
                onChange={setSelectedHour}
                className="w-full"
              />
              <span className="flex items-center">:</span>
              <Dropdown
                options={minuteOptions}
                value={selectedMinute}
                onChange={setSelectedMinute}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskEditModal;