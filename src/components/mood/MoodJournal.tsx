import React, { useState } from 'react';
import { format, startOfDay, subDays } from 'date-fns';
import { Filter, Calendar } from 'lucide-react';
import { useMoodStore } from '../../store/useMoodStore';
import { useTaskStore } from '../../store/useTaskStore';
import { MoodEntry } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import MoodEntryCard from './MoodEntryCard';

const MoodJournal: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'week' | 'today'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'focus'>('newest');
  
  const { entries } = useMoodStore();
  const { tasks } = useTaskStore();
  
  const filteredEntries = (): MoodEntry[] => {
    const today = startOfDay(new Date());
    const weekAgo = startOfDay(subDays(today, 7));
    
    let filtered = [...entries];
    
    if (filter === 'today') {
      filtered = filtered.filter(entry => {
        const entryDate = startOfDay(new Date(entry.timestamp));
        return entryDate.getTime() === today.getTime();
      });
    } else if (filter === 'week') {
      filtered = filtered.filter(entry => {
        const entryDate = startOfDay(new Date(entry.timestamp));
        return entryDate >= weekAgo;
      });
    }
    
    // Sort entries
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else if (sortBy === 'focus') {
      filtered.sort((a, b) => b.focusLevel - a.focusLevel);
    }
    
    return filtered;
  };
  
  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };
  
  const getAverageFocus = (): number => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((total, entry) => total + entry.focusLevel, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };
  
  const getCommonDistractions = (): { distraction: string; count: number }[] => {
    const distractionCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      entry.distractions.forEach(distraction => {
        distractionCounts[distraction] = (distractionCounts[distraction] || 0) + 1;
      });
    });
    
    return Object.entries(distractionCounts)
      .map(([distraction, count]) => ({ distraction, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };
  
  const displayedEntries = filteredEntries();
  const averageFocus = getAverageFocus();
  const commonDistractions = getCommonDistractions();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mood & Focus Journal</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your focus patterns and identify distractions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Focus Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end">
              <span className="text-3xl font-bold">{averageFocus}</span>
              <span className="text-gray-500 ml-1 mb-1">/5</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Average across {entries.length} sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Common Distractions</CardTitle>
          </CardHeader>
          <CardContent>
            {commonDistractions.length > 0 ? (
              <div className="space-y-2">
                {commonDistractions.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.distraction}</span>
                    <span className="text-sm text-gray-500">{item.count} times</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No distractions recorded yet</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Best Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length > 0 ? (
              <div>
                <p className="text-xl font-semibold">Morning</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on your highest focus scores
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Not enough data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold mb-4 sm:mb-0">Journal Entries</h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-md shadow-sm">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                className="rounded-l-md rounded-r-none"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'week' ? 'primary' : 'outline'}
                size="sm"
                className="rounded-none"
                onClick={() => setFilter('week')}
              >
                This Week
              </Button>
              <Button
                variant={filter === 'today' ? 'primary' : 'outline'}
                size="sm"
                className="rounded-r-md rounded-l-none"
                onClick={() => setFilter('today')}
              >
                Today
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              icon={<Calendar className="h-4 w-4" />}
            >
              {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'focus' ? 'newest' : 'focus')}
              icon={<Filter className="h-4 w-4" />}
            >
              {sortBy === 'focus' ? 'By Focus' : 'By Focus'}
            </Button>
          </div>
        </div>
        
        {displayedEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No journal entries found for this period
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Complete focus sessions to record your mood and focus level
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedEntries.map(entry => (
              <MoodEntryCard
                key={entry.id}
                entry={entry}
                task={getTaskById(entry.taskId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodJournal;