
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NutritionStats from '../components/NutritionStats';
import MealPlanner from '../components/MealPlanner';
import FoodLibrary from '../components/FoodLibrary';
import { Bell, User } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <MealPlanner />
              </div>
              <div className="xl:col-span-1">
                <NutritionStats />
              </div>
            </div>
          </div>
        );
      case 'foods':
        return <FoodLibrary />;
      case 'plans':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Plans alimentaires</h2>
            <p className="text-gray-600 mb-8">Gérez vos plans personnalisés selon vos objectifs</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Perte de poids', desc: 'Déficit calorique contrôlé', color: 'from-red-400 to-pink-500' },
                { title: 'Maintien', desc: 'Équilibre nutritionnel', color: 'from-green-400 to-blue-500' },
                { title: 'Prise de masse', desc: 'Surplus calorique', color: 'from-blue-400 to-purple-500' }
              ].map((plan, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <span className="text-white text-2xl font-bold">{plan.title[0]}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.desc}</p>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                    Personnaliser
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Suivi de progression</h2>
            <p className="text-gray-600">Analysez vos progrès nutritionnels</p>
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil utilisateur</h2>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
            <p className="text-gray-600">Configurez votre application</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === 'dashboard' && 'Tableau de bord'}
                {activeSection === 'foods' && 'Bibliothèque d\'aliments'}
                {activeSection === 'plans' && 'Plans alimentaires'}
                {activeSection === 'progress' && 'Progression'}
                {activeSection === 'profile' && 'Profil'}
                {activeSection === 'settings' && 'Paramètres'}
              </h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Marie Dupont</p>
                  <p className="text-xs text-gray-500">Coach certifiée</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
