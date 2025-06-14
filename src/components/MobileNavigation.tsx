import React from 'react';
import { Home, Book, Target, TrendingUp, User, Settings, MessageCircle } from 'lucide-react';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MobileNavigation = ({ activeSection, onSectionChange }: MobileNavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'foods', label: 'Aliments', icon: Book },
    { id: 'plans', label: 'Plans', icon: Target },
    { id: 'chat', label: 'Assistant', icon: MessageCircle },
    { id: 'progress', label: 'Progrès', icon: TrendingUp },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
