import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, ListChecks, Settings, LineChart } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center py-3 px-4 rounded-md transition-colors',
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      to: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
    },
    {
      to: '/planner',
      icon: <Calendar className="h-5 w-5" />,
      label: 'Daily Planner',
    },
    {
      to: '/focus',
      icon: <Clock className="h-5 w-5" />,
      label: 'Focus Timer',
    },
    {
      to: '/routines',
      icon: <ListChecks className="h-5 w-5" />,
      label: 'Routines',
    },
    {
      to: '/mood',
      icon: <LineChart className="h-5 w-5" />,
      label: 'Mood Tracker',
    },
    {
      to: '/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 min-h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 w-64 h-full bg-white dark:bg-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
      >
        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;