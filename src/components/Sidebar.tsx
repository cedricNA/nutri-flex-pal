
import React from 'react';
import { Home, Target, Book, User, Settings, TrendingUp } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'plans', label: 'Plans Alimentaires', icon: Target },
    { id: 'foods', label: 'Bibliothèque', icon: Book },
    { id: 'progress', label: 'Progression', icon: TrendingUp },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card shadow-lg border-r border-border z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">NutriFlex</h1>
            <p className="text-sm text-muted-foreground">Votre coach nutrition</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 text-green-600 dark:text-green-400 border-l-4 border-green-500'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold text-sm mb-1">Version Pro</h3>
          <p className="text-xs opacity-90 mb-3">Débloquez toutes les fonctionnalités</p>
          <button className="w-full bg-white text-green-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition">
            Découvrir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
