
import React from 'react';
import { Home, Target, Book, User, Settings, TrendingUp, MessageCircle, Sparkles, Shield } from 'lucide-react';
import { useRole } from '@/hooks/useRole';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { isAdmin, role } = useRole();

  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'plans', label: 'Plans Alimentaires', icon: Target },
    { id: 'foods', label: 'Bibliothèque', icon: Book },
    { id: 'chat', label: 'Assistant IA', icon: MessageCircle },
    { id: 'progress', label: 'Progression', icon: TrendingUp },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'admin', label: 'Administration', icon: Shield },
  ];

  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              NutriFlex
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {role === 'admin' ? 'Admin' : 'Utilisateur'}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isAdminItem = item.id === 'admin';
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? `bg-gradient-to-r ${isAdminItem ? 'from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 text-red-600 dark:text-red-400' : 'from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 text-green-600 dark:text-green-400'} shadow-md scale-105`
                  : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-102'
              }`}
            >
              <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-2 h-2 ${isAdminItem ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-blue-500'} rounded-full animate-pulse`}></div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <h3 className="font-bold text-lg mb-2">Version Pro</h3>
          <p className="text-sm opacity-90 mb-4">Débloquez toutes les fonctionnalités premium</p>
          <button className="w-full bg-white text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-lg">
            Découvrir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
