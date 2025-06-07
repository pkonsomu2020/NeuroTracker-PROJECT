import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import Button from '../ui/Button';
import RoutineCard from './RoutineCard';
import AddRoutineModal from './AddRoutineModal';

const RoutineList: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { settings } = useSettingsStore();
  const { initializeRoutines, getAllRoutines } = useRoutineStore();
  
  // Initialize default routines if needed
  useEffect(() => {
    initializeRoutines();
  }, []);
  
  const routines = getAllRoutines(settings.isPremium);
  const hasLockedRoutines = routines.some(r => r.isPremium && !settings.isPremium);
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Routine Templates</h1>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Create Routine
        </Button>
      </div>
      
      {hasLockedRoutines && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-6 flex items-start gap-3 dark:bg-accent-900/20 dark:border-accent-800">
          <AlertCircle className="h-5 w-5 text-accent-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-accent-800 dark:text-accent-300">Premium Templates Available</h3>
            <p className="text-sm text-accent-700 dark:text-accent-400 mt-1">
              Some templates are only available with a premium subscription. Upgrade to access all templates.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            isPremiumLocked={routine.isPremium && !settings.isPremium}
          />
        ))}
      </div>
      
      <AddRoutineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default RoutineList;