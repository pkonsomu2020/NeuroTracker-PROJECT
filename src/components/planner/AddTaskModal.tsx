import React, { useState } from 'react';
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

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isOpen, 
  onClose,
  defaultDate = new Date(),
}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(25);
  const [colorCode, setColorCode] = useState(COLORS[0].value);
  const [icon, setIcon] = useState(ICONS[0].value);
  const [selectedHour, setSelectedHour] = useState(defaultDate.getHours().toString());
  const [selectedMinute, setSelectedMinute] = useState('0');
  
  const { addTask } = useTaskStore();
  const timeSlots = generateTimeSlots();
  
  const handleSubmit = () => {
    if (name.trim() === '') return;
    
    const scheduledTime = new Date(defaultDate);
    scheduledTime.setHours(parseInt(selectedHour), parseInt(selectedMinute), 0, 0);
    
    const newTask: Omit<Task, 'id'> = {
      name,
      duration,
      colorCode,
      icon,
      completed: false,
      scheduledTime,
      order: 0,
    };
    
    addTask(newTask);
    onClose();
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setDuration(25);
    setColorCode(COLORS[0].value);
    setIcon(ICONS[0].value);
    setSelectedHour(defaultDate.getHours().toString());
    setSelectedMinute('0');
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
      title="Add New Task"
      footer={
        <>
          <Button variant="outline\" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!name.trim()}>
            Add Task
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

export default AddTaskModal;