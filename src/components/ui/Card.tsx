import React from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isPremium?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  onClick,
  isPremium
}) => {
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden',
        'transition-all duration-200 ease-in-out',
        onClick && 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1',
        isPremium && 'border-2 border-accent-400',
        className
      )}
      onClick={onClick}
    >
      {isPremium && (
        <div className="bg-accent-400 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-center">
          Premium
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('px-4 py-3 border-b dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-800 dark:text-white', className)}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700', className)}>
      {children}
    </div>
  );
};