
import React from 'react';
import { Home, Book, Target, TrendingUp, User, MessageCircle, BookOpen } from 'lucide-react';

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
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-50 md:hidden shadow-2xl">
      <div className="grid grid-cols-7 h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 relative ${
                isActive
                  ? 'text-green-600 dark:text-green-400 transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              )}
              <Icon size={22} className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                isActive ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
