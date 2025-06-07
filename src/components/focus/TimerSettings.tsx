import React, { useState } from 'react';
import { Timer } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

const TimerSettings: React.FC = () => {
  const { settings, updateSettings } = useTimerStore();
  
  const [focusDuration, setFocusDuration] = useState(settings.focusDuration);
  const [breakDuration, setBreakDuration] = useState(settings.breakDuration);
  
  const handleSave = () => {
    updateSettings({
      focusDuration,
      breakDuration,
    });
  };
  
  const handleReset = () => {
    setFocusDuration(25);
    setBreakDuration(5);
    updateSettings({
      focusDuration: 25,
      breakDuration: 5,
    });
  };
  
  const presets = [
    { name: 'Standard', focus: 25, break: 5 },
    { name: 'Long Focus', focus: 50, break: 10 },
    { name: 'Short Focus', focus: 15, break: 5 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Timer Settings</CardTitle>
        <Timer className="h-5 w-5 text-primary-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Focus Duration (minutes)
            </label>
            <input
              type="range"
              min={5}
              max={90}
              step={5}
              value={focusDuration}
              onChange={(e) => setFocusDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>5 min</span>
              <span className="font-medium text-primary-600">{focusDuration} min</span>
              <span>90 min</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Break Duration (minutes)
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>1 min</span>
              <span className="font-medium text-primary-600">{breakDuration} min</span>
              <span>30 min</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setFocusDuration(preset.focus);
                    setBreakDuration(preset.break);
                  }}
                >
                  {preset.name} ({preset.focus}/{preset.break})
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerSettings;