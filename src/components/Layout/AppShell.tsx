import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/useSettingsStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppShell: React.FC = () => {
  const { settings } = useSettingsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Apply theme class to the document body
  useEffect(() => {
    const { theme } = settings;
    document.body.classList.remove('light', 'dark', 'low-stimulation');
    document.body.classList.add(theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (theme === 'low-stimulation') {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [settings.theme]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!settings.onboardingCompleted && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [settings.onboardingCompleted, location.pathname, navigate]);

  if (!settings.onboardingCompleted && location.pathname !== '/onboarding') {
    return null;
  }

  return (
    <div className={`
      min-h-screen transition-colors duration-200
      ${settings.theme === 'light' ? 'bg-gray-50 text-gray-900' : ''}
      ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : ''}
      ${settings.theme === 'low-stimulation' ? 'bg-blue-50 text-gray-800' : ''}
    `}>
      {settings.onboardingCompleted && (
        <>
          <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto">
              <Outlet />
            </main>
          </div>
          
          {/* Mobile sidebar overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </>
      )}
      
      {!settings.onboardingCompleted && location.pathname === '/onboarding' && (
        <main className="min-h-screen">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default AppShell;