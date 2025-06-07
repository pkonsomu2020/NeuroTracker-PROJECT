import React from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { UserSettings } from '../../types';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { settings, setTheme } = useSettingsStore();
  
  const themes: { value: UserSettings['theme']; icon: JSX.Element; label: string }[] = [
    {
      value: 'light',
      icon: <Sun className="h-5 w-5" />,
      label: 'Light',
    },
    {
      value: 'dark',
      icon: <Moon className="h-5 w-5" />,
      label: 'Dark',
    },
    {
      value: 'low-stimulation',
      icon: <Eye className="h-5 w-5" />,
      label: 'Low Stimulation',
    },
  ];

  return (
    <div className={`flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 ${className}`}>
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setTheme(theme.value)}
          className={`flex items-center justify-center rounded-md py-1.5 px-2.5 text-sm font-medium transition-colors
            ${settings.theme === theme.value 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          aria-label={`Switch to ${theme.label} theme`}
        >
          {theme.icon}
          <span className="ml-1.5">{theme.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;