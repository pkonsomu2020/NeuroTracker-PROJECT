import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useSettingsStore } from '../../store/useSettingsStore';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, upgradeAccount } = useSettingsStore();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      window.location.href = '/LandingPage'; // or use navigation if using react-router
    } else {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-600">NeuroTrack</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />

          {!settings.isPremium && (
            <Button
              variant="primary"
              size="sm"
              onClick={upgradeAccount}
            >
              Upgrade to Pro
            </Button>
          )}

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400"
            >
              Logout
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3 px-2">
            <ThemeToggle className="w-full" />

            {!settings.isPremium && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={upgradeAccount}
              >
                Upgrade to Pro
              </Button>
            )}

            {user && (
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
