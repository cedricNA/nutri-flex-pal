
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NutritionStats from '../components/NutritionStats';
import MealPlanner from '../components/MealPlanner';
import FoodLibrary from '../components/FoodLibrary';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import ProgressPage from '../components/ProgressPage';
import PlanManager from '../components/PlanManager';
import MobileNavigation from '../components/MobileNavigation';
import { Bell, User } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
              <div className="order-2 xl:order-1 xl:flex-[2]">
                <MealPlanner />
              </div>
              <div className="order-1 xl:order-2 xl:flex-[1]">
                <NutritionStats />
              </div>
            </div>
          </div>
        );
      case 'foods':
        return <FoodLibrary />;
      case 'plans':
        return <PlanManager />;
      case 'progress':
        return <ProgressPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    const titles = {
      'dashboard': 'Tableau de bord',
      'foods': 'Bibliothèque d\'aliments',
      'plans': 'Plans alimentaires',
      'progress': 'Progression',
      'profile': 'Profil',
      'settings': 'Paramètres'
    };
    return titles[activeSection as keyof typeof titles] || 'NutriFlex';
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex">
      {/* Sidebar pour desktop */}
      <div className="hidden md:block">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
      
      <div className="flex-1 md:ml-64 pb-16 md:pb-0">
        {/* Header */}
        <header className="bg-card dark:bg-gray-800 shadow-sm border-b border-border dark:border-gray-700 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-card-foreground dark:text-gray-100">
                {getSectionTitle()}
              </h1>
              <p className="text-muted-foreground dark:text-gray-400 text-sm md:text-base">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition">
                <Bell size={18} md:size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={16} md:size={20} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-card-foreground dark:text-gray-100">Marie Dupont</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Coach certifiée</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Navigation mobile */}
      <MobileNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
    </div>
  );
};

export default Index;
