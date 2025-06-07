import React from 'react';
import { Settings, Volume2, VolumeX, Crown } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const SettingsPage: React.FC = () => {
  const { settings, toggleVoiceReminders, upgradeAccount, resetSettings } = useSettingsStore();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Settings className="mr-2 h-6 w-6" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your NeuroTrack experience
        </p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <ThemeToggle />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                The "Low-Stimulation" mode uses a calming color palette and dyslexia-friendly fonts for a more accessible experience.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications & Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Voice Reminders
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Speak task names aloud when tasks begin
                  </p>
                </div>
                <Button
                  variant={settings.voiceReminders ? 'primary' : 'outline'}
                  size="sm"
                  onClick={toggleVoiceReminders}
                  icon={settings.voiceReminders ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                >
                  {settings.voiceReminders ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subscription Status
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {settings.isPremium ? 'You have access to all premium features' : 'Upgrade to unlock premium features'}
                  </p>
                </div>
                {settings.isPremium ? (
                  <div className="flex items-center px-3 py-1.5 bg-accent-100 text-accent-800 rounded-full text-sm dark:bg-accent-900 dark:text-accent-300">
                    <Crown className="h-4 w-4 mr-1.5" />
                    Premium
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={upgradeAccount}
                    icon={<Crown className="h-4 w-4" />}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </div>
            
            {settings.isPremium && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <h3 className="font-medium mb-2">Premium Benefits:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Access to all premium routine templates</li>
                  <li>Voice reminders for tasks</li>
                  <li>Advanced focus analytics</li>
                  <li>Unlimited custom routines</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Reset all settings and data. This action cannot be undone.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={resetSettings}
              >
                Reset All Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;