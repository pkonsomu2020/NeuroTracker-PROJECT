import React, { useState } from 'react';
import { useMoodStore } from '../../store/useMoodStore';
import { useTaskStore } from '../../store/useTaskStore';
import { getRandomEmoji } from '../../utils/helpers';
import { Card, CardContent, CardTitle, CardHeader } from '../ui/Card';
import Button from '../ui/Button';

interface MoodTrackerProps {
  taskId: string;
  onComplete: () => void;
}

const DISTRACTIONS = [
  'Phone',
  'Social Media',
  'Noise',
  'Hunger',
  'Fatigue',
  'Email',
  'Other People',
  'Thoughts',
  'Notifications',
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ taskId, onComplete }) => {
  const [focusLevel, setFocusLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [distractions, setDistractions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const { addEntry } = useMoodStore();
  const { tasks } = useTaskStore();
  const task = tasks.find(t => t.id === taskId);
  
  const handleToggleDistraction = (distraction: string) => {
    if (distractions.includes(distraction)) {
      setDistractions(distractions.filter(d => d !== distraction));
    } else {
      setDistractions([...distractions, distraction]);
    }
  };
  
  const handleSubmit = () => {
    addEntry({
      timestamp: new Date(),
      focusLevel,
      distractions,
      notes,
      taskId,
    });
    
    onComplete();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          How was your focus session?
          <span className="ml-2 text-2xl">{getRandomEmoji()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {task && (
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">You just completed:</span>
              <h3 className="text-lg font-medium">{task.name}</h3>
            </div>
          )}
          
          <div>
            <h3 className="text-md font-medium mb-3">How focused were you?</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Not at all</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
                      focusLevel === level
                        ? 'bg-primary-500 text-white transform scale-110'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-primary-200'
                    }`}
                    onClick={() => setFocusLevel(level as 1 | 2 | 3 | 4 | 5)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">Very focused</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Were you distracted by any of these?</h3>
            <div className="flex flex-wrap gap-2">
              {DISTRACTIONS.map((distraction) => (
                <button
                  key={distraction}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    distractions.includes(distraction)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => handleToggleDistraction(distraction)}
                >
                  {distraction}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Any notes about this session?</h3>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="What went well? What could be improved?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onComplete}>
              Skip
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Entry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;