
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  variant?: 'default' | 'compact';
}

const ThemeToggle = ({ isDark, onToggle, variant = 'default' }: ThemeToggleProps) => {
  if (variant === 'compact') {
    return (
      <button
        onClick={onToggle}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group"
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      >
        <div className="relative w-5 h-5">
          <Sun 
            size={20} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            } text-yellow-500`}
          />
          <Moon 
            size={20} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
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
      onClick={onToggle}
      className="relative overflow-hidden group"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <div className="flex items-center space-x-2">
        <div className="relative w-4 h-4">
          <Sun 
            size={16} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            } text-yellow-500`}
          />
          <Moon 
            size={16} 
            className={`absolute inset-0 transition-all duration-300 ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
            } text-blue-400`}
          />
        </div>
        <span className="font-medium">
          {isDark ? 'Mode clair' : 'Mode sombre'}
        </span>
      </div>
    </Button>
  );
};

export default ThemeToggle;
