import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, CheckSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTaskStore } from '../../store/useTaskStore';
import { useMoodStore } from '../../store/useMoodStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimerStore } from '../../store/useTimerStore';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import FocusTimer from '../focus/FocusTimer';
import { supabase } from '../../lib/supabase';

interface Task {
  id: string;
  name: string;
  scheduledTime: string;
  completed: boolean;
  colorCode: string;
}

const Dashboard: React.FC = () => {
  const { settings } = useSettingsStore();
  const { tasks } = useTaskStore();
  const { entries } = useMoodStore();
  const { isRunning } = useTimerStore();

  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.fullName) {
        setUserName(data.user.user_metadata.fullName);
      }
    };
    fetchUser();
  }, []);

  const today = new Date();

  const todayTasks: Task[] = tasks.filter((task: Task) => {
    const taskDate = new Date(task.scheduledTime);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  const completedTasks = todayTasks.filter(task => task.completed);
  const completionRate = todayTasks.length > 0
    ? Math.round((completedTasks.length / todayTasks.length) * 100)
    : 0;

  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalization = () => {
    if (!settings.onboardingAnswers) return null;

    const { primaryGoal, routineStyle } = settings.onboardingAnswers;

    if (primaryGoal === 'focus') {
      return {
        title: 'Focus Tip',
        message: 'Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break.',
      };
    } else if (primaryGoal === 'routines') {
      return {
        title: 'Routine Tip',
        message:
          routineStyle === 'rigid'
            ? 'Following your routine consistently builds strong neural pathways.'
            : 'Being flexible with routines helps adapt to changing circumstances.',
      };
    } else {
      return {
        title: 'Distraction Tip',
        message:
          "Try using 'body doubling' - working alongside someone else, even virtually, can help maintain focus.",
      };
    }
  };

  const tip = getPersonalization();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting()}, {userName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>

        <div className="mt-4">
          <Link to="/landing">
            <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
              Go to Landing Page
            </Button>
          </Link>
        </div>
      </div>

      {isRunning ? (
        <FocusTimer />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{todayTasks.length}</span>
                  <span className="text-gray-500 ml-2 mb-1">
                    {completedTasks.length} completed
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  to="/planner"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  View planner
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Focus Time */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-secondary-500" />
                  Focus Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">
                    {entries.length > 0 ? Math.round((entries.length * 25) / 60) : 0}
                  </span>
                  <span className="text-gray-500 ml-2 mb-1">hours</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {entries.length} focus sessions completed
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  to="/focus"
                  className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 text-sm font-medium flex items-center"
                >
                  Start focusing
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Next Up */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <CheckSquare className="h-5 w-5 mr-2 text-accent-500" />
                  Next Up
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                {todayTasks.filter(t => !t.completed).length > 0 ? (
                  todayTasks
                    .filter(t => !t.completed)
                    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                    .slice(0, 1)
                    .map(task => (
                      <div key={task.id}>
                        <h3 className="font-medium">{task.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(task.scheduledTime), 'h:mm a')}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
                )}
              </CardContent>
              <CardFooter>
                <Link
                  to="/planner"
                  className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 text-sm font-medium flex items-center"
                >
                  Plan your day
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Tips and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {tip && (
              <Card>
                <CardHeader>
                  <CardTitle>{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tip.message}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/focus">
                    <Button variant="outline" fullWidth icon={<Clock className="h-4 w-4" />}>
                      Start Timer
                    </Button>
                  </Link>
                  <Link to="/planner">
                    <Button variant="outline" fullWidth icon={<Calendar className="h-4 w-4" />}>
                      Add Task
                    </Button>
                  </Link>
                  <Link to="/routines">
                    <Button variant="outline" fullWidth icon={<CheckSquare className="h-4 w-4" />}>
                      Routines
                    </Button>
                  </Link>
                  <Link to="/mood">
                    <Button variant="outline" fullWidth>
                      Mood Journal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>

            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks
                  .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                  .map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center p-3 rounded-md ${
                        task.completed
                          ? 'bg-gray-50 dark:bg-gray-900'
                          : `bg-${task.colorCode}50`
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mr-3 ${
                          task.completed
                            ? 'bg-gray-300 dark:bg-gray-600'
                            : `bg-${task.colorCode}`
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {format(new Date(task.scheduledTime), 'h:mm a')}
                        </p>
                      </div>
                      {!task.completed && (
                        <Link to="/focus">
                          <Button variant="ghost" size="sm" icon={<Clock className="h-4 w-4" />}>
                            Focus
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-3">
                  No tasks scheduled for today
                </p>
                <Link to="/planner">
                  <Button variant="primary">Plan Your Day</Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
