import React, { useState } from 'react';
import { Lock, Copy, Edit, MoreVertical } from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatDuration } from '../../utils/helpers';
import { Routine } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import RoutineDetailModal from './RoutineDetailModal';

interface RoutineCardProps {
  routine: Routine;
  isPremiumLocked: boolean;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ routine, isPremiumLocked }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { duplicateRoutine } = useRoutineStore();
  const { upgradeAccount } = useSettingsStore();
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateRoutine(routine.id);
    setShowOptions(false);
  };
  
  const totalDuration = routine.tasks.reduce((total, task) => total + task.duration, 0);
  
  const handleCardClick = () => {
    if (isPremiumLocked) {
      upgradeAccount();
    } else {
      setIsDetailModalOpen(true);
    }
  };
  
  return (
    <>
      <Card 
        isPremium={routine.isPremium}
        onClick={handleCardClick}
        className="transform transition-all duration-300 hover:-translate-y-1"
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle>{routine.name}</CardTitle>
            {!isPremiumLocked && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(!showOptions);
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                
                {showOptions && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-md rounded-md z-10 w-32 py-1 border border-gray-200 dark:border-gray-700">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={handleDuplicate}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDetailModalOpen(true);
                        setShowOptions(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {routine.description}
          </p>
        </CardHeader>
        
        <CardContent>
          {isPremiumLocked ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Lock className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                This is a premium template
              </p>
              <Button variant="primary" size="sm" onClick={upgradeAccount}>
                Upgrade to Unlock
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {routine.tasks.slice(0, 3).map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded"
                  style={{ backgroundColor: `${task.colorCode}10` }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: task.colorCode }}
                    ></div>
                    <span className="text-sm">{task.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDuration(task.duration)}
                  </span>
                </div>
              ))}
              
              {routine.tasks.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-1">
                  +{routine.tasks.length - 3} more tasks
                </p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {routine.tasks.length} tasks
          </span>
          
          <span className="text-sm font-medium">
            {formatDuration(totalDuration)}
          </span>
        </CardFooter>
      </Card>
      
      {!isPremiumLocked && (
        <RoutineDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          routine={routine}
        />
      )}
    </>
  );
};

export default RoutineCard;