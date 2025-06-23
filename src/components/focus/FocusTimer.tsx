import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { speakText } from '../../utils/helpers';
import Button from '../ui/Button';
import MoodTracker from './MoodTracker';
import TimerSettings from './TimerSettings';

const FocusTimer: React.FC = () => {
  const { 
    settings: timerSettings,
    isRunning,
    isPaused,
    isBreak,
    currentTaskId,
    timeRemaining,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    startBreak,
    tick,
    resetTimer,
  } = useTimerStore();
  
  const { tasks, completeTask } = useTaskStore();
  const { settings } = useSettingsStore();
  
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
  
  // Format the time remaining in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer completion
  useEffect(() => {
    if (isRunning && timeRemaining === 0) {
      if (isBreak) {
        resetTimer();
        // Alert sound for break end
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
      } else {
        // Complete the current task
        if (currentTaskId) {
          completeTask(currentTaskId);
          setShowMoodTracker(true);
        }
        startBreak();
        // Alert sound for focus end
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
        // Voice announcement if enabled
        if (settings.voiceReminders && currentTask) {
          (async () => {
            await speakText(`Focus session complete. Time for a ${timerSettings.breakDuration} minute break.`, true, currentTaskId);
          })();
        }
      }
    }
  }, [isRunning, timeRemaining, isBreak]);
  
  // Timer tick
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, tick]);
  
  // Calculate progress percentage
  const progress = isBreak
    ? ((timerSettings.breakDuration * 60 - timeRemaining) / (timerSettings.breakDuration * 60)) * 100
    : ((timerSettings.focusDuration * 60 - timeRemaining) / (timerSettings.focusDuration * 60)) * 100;
  
  const handleStartFocus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      startTimer(taskId, task.duration);
      // Voice announcement if enabled
      if (settings.voiceReminders) {
        await speakText(`Starting focus on ${task.name} for ${task.duration} minutes`, true, taskId);
      }
    }
  };
  
  const handleToggleVoice = () => {
    const { updateSettings } = useSettingsStore();
    updateSettings({ voiceReminders: !settings.voiceReminders });
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Focus Timer</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Use the timer to stay focused and track your productivity
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center justify-center">
          {/* Timer Display */}
          <div className="relative w-64 h-64 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
                className="dark:stroke-gray-700"
              />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isBreak ? '#10b981' : '#7c3aed'}
                strokeWidth="8"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * progress) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-in-out"
              />
              
              {/* Timer text */}
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fontWeight="bold"
                fill={isBreak ? '#10b981' : '#7c3aed'}
                className="dark:fill-white"
              >
                {formatTime(timeRemaining)}
              </text>
              
              {/* Status text */}
              <text
                x="50"
                y="65"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill="#6b7280"
                className="dark:fill-gray-400"
              >
                {isBreak ? 'BREAK TIME' : 'FOCUS MODE'}
              </text>
            </svg>
          </div>
          
          {/* Current Task */}
          {currentTask && (
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold mb-1">Current Task</h2>
              <div 
                className="inline-block px-4 py-2 rounded-full"
                style={{ backgroundColor: `${currentTask.colorCode}20` }}
              >
                <span className="font-medium" style={{ color: currentTask.colorCode }}>
                  {currentTask.name}
                </span>
              </div>
            </div>
          )}
          
          {/* Timer Controls */}
          <div className="flex space-x-4">
            {!isRunning ? (
              <Button
                variant="primary"
                size="lg"
                icon={<Play className="h-5 w-5" />}
                disabled={showMoodTracker}
                onClick={() => resetTimer()}
              >
                Reset
              </Button>
            ) : isPaused ? (
              <Button
                variant="primary"
                size="lg"
                icon={<Play className="h-5 w-5" />}
                onClick={() => resumeTimer()}
              >
                Resume
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                icon={<Pause className="h-5 w-5" />}
                onClick={() => pauseTimer()}
              >
                Pause
              </Button>
            )}
            
            <Button
              variant="outline"
              size="lg"
              icon={<RotateCcw className="h-5 w-5" />}
              onClick={() => resetTimer()}
            >
              Reset
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={handleToggleVoice}
              icon={settings.voiceReminders ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              aria-label={settings.voiceReminders ? "Disable voice reminders" : "Enable voice reminders"}
            />
          </div>
        </div>
      </div>
      
      {showMoodTracker && currentTaskId && (
        <MoodTracker
          taskId={currentTaskId}
          onComplete={() => setShowMoodTracker(false)}
        />
      )}
      
      {!isRunning && !showMoodTracker && (
        <>
          <TimerSettings />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
            
            {tasks.filter(t => !t.completed).length > 0 ? (
              <div className="space-y-2">
                {tasks
                  .filter(task => !task.completed)
                  .slice(0, 5)
                  .map(task => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-md"
                      style={{ backgroundColor: `${task.colorCode}10` }}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: task.colorCode }}
                        ></div>
                        <span>{task.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartFocus(task.id)}
                        icon={<Play className="h-3 w-3" />}
                      >
                        Focus
                      </Button>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No tasks for today. Add tasks in the Daily Planner!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FocusTimer;