
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'default' | 'compact';
}

const ThemeToggle = ({ variant = 'default' }: ThemeToggleProps) => {
  const { theme, setTheme, isDarkMode } = useTheme();

  const handleToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group"
        aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
      >
        <div className="relative w-5 h-5">
          <Sun 
            size={20} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDarkMode ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            } text-yellow-500`}
          />
          <Moon 
            size={20} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
            } text-blue-400`}
          />
        </div>
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="relative overflow-hidden group"
      aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <div className="flex items-center space-x-2">
        <div className="relative w-4 h-4">
          <Sun 
            size={16} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDarkMode ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            } text-yellow-500`}
          />
          <Moon 
            size={16} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
            } text-blue-400`}
          />
        </div>
        <span className="font-medium">
          {isDarkMode ? 'Mode clair' : 'Mode sombre'}
        </span>
      </div>
    </Button>
  );
};

export default ThemeToggle;
