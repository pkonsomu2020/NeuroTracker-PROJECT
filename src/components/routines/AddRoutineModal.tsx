import React, { useState } from 'react';
import { useRoutineStore } from '../../store/useRoutineStore';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRoutineModal: React.FC<AddRoutineModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { addRoutine } = useRoutineStore();
  
  const handleSubmit = () => {
    if (!name.trim()) return;
    
    addRoutine({
      name,
      description,
      isPremium: false,
      tasks: [],
    });
    
    onClose();
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Routine"
      footer={
        <>
          <Button variant="outline\" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Create Routine
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Routine Name"
          placeholder="e.g., Morning Workout"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Describe your routine..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          After creating the routine, you'll be able to add tasks to it.
        </p>
      </div>
    </Modal>
  );
};

export default AddRoutineModal;