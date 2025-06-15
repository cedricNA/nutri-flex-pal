import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NutritionStats from '../components/NutritionStats';
import MealPlanner from '../components/MealPlanner';
import FoodLibrary from '../components/FoodLibrary';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import ProgressPage from '../components/ProgressPage';
import PlanManager from '../components/PlanManager';
import ChatBot from '../components/ChatBot';
import MobileNavigation from '../components/MobileNavigation';
import ThemeToggle from '../components/ThemeToggle';
import NotificationCenter from '../components/NotificationCenter';
import { Bell, User, Menu, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const { unreadCount } = useNotifications();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.darkMode || false;
      }
    } catch (error) {
      console.error("Impossible de charger les paramètres de thème", error);
    }
    return false;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save theme preference
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      const updatedSettings = { ...settings, darkMode: isDarkMode };
      localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Impossible de sauvegarder les paramètres de thème", error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
      case 'chat':
        return <ChatBot />;
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
      'chat': 'Assistant IA',
      'progress': 'Progression',
      'profile': 'Profil',
      'settings': 'Paramètres'
    };
    return titles[activeSection as keyof typeof titles] || 'NutriFlex';
  };

  const getSectionDescription = () => {
    const descriptions = {
      'dashboard': 'Gérez vos repas et suivez vos objectifs nutritionnels',
      'foods': 'Explorez notre base de données d\'aliments',
      'plans': 'Créez et gérez vos plans alimentaires personnalisés',
      'chat': 'Obtenez des conseils nutritionnels personnalisés',
      'progress': 'Suivez vos progrès et statistiques',
      'profile': 'Gérez vos informations personnelles',
      'settings': 'Configurez vos préférences'
    };
    return descriptions[activeSection as keyof typeof descriptions] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex transition-all duration-500">
      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar pour desktop et mobile */}
      <div className={`fixed md:static transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
        />
      </div>
      
      <div className="flex-1 md:ml-64 pb-16 md:pb-0 min-h-screen">
        {/* Header modernisé avec notifications */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-4 md:px-8 py-4 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {getSectionTitle()}
                </h1>
                <p className="text-muted-foreground dark:text-gray-400 text-sm md:text-base transition-colors duration-300">
                  {getSectionDescription()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Toggle de thème */}
              <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} variant="compact" />
              
              {/* Bouton notifications avec badge */}
              <button 
                onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] font-semibold text-white flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-2 md:space-x-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <User className="text-white" size={20} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-card-foreground dark:text-gray-100">Marie Dupont</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Coach certifiée</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content avec animations améliorées */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
          {renderMainContent()}
        </main>
      </div>

      {/* Centre de notifications */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />

      {/* Navigation mobile */}
      <MobileNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
    </div>
  );
};

export default Index;
