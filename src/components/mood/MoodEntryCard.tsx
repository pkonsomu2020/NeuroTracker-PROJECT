import React from 'react';
import { format } from 'date-fns';
import { MoodEntry, Task } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface MoodEntryCardProps {
  entry: MoodEntry;
  task?: Task;
}

const MoodEntryCard: React.FC<MoodEntryCardProps> = ({ entry, task }) => {
  const formatDate = (date: Date): string => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };
  
  const getFocusLabel = (level: number): string => {
    switch (level) {
      case 1: return 'Very low focus';
      case 2: return 'Low focus';
      case 3: return 'Moderate focus';
      case 4: return 'Good focus';
      case 5: return 'Excellent focus';
      default: return 'Unknown';
    }
  };
  
  const getFocusColor = (level: number): string => {
    switch (level) {
      case 1: return 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300';
      case 2: return 'bg-error-50 text-error-700 dark:bg-error-900/50 dark:text-error-400';
      case 3: return 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300';
      case 4: return 'bg-success-50 text-success-700 dark:bg-success-900/50 dark:text-success-400';
      case 5: return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-1">
              <div className="flex space-x-2 items-center">
                {task && (
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.colorCode }}
                  ></div>
                )}
                <h3 className="font-medium">
                  {task ? task.name : 'Unknown Task'}
                </h3>
              </div>
              <span className="text-xs text-gray-500 ml-3">
                {formatDate(entry.timestamp)}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.distractions.map((distraction, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                >
                  {distraction}
                </span>
              ))}
              {entry.distractions.length === 0 && (
                <span className="text-xs text-gray-500">No distractions reported</span>
              )}
            </div>
            
            {entry.notes && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                "{entry.notes}"
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFocusColor(entry.focusLevel)}`}
            >
              {getFocusLabel(entry.focusLevel)}
            </span>
            
            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 rounded-sm ${
                      i < entry.focusLevel
                        ? 'bg-primary-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">
                {entry.focusLevel}/5
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodEntryCard;