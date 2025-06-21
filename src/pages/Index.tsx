
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNavigation from '@/components/MobileNavigation';
import MealPlanner from '@/components/MealPlanner';
import FoodLibrary from '@/components/FoodLibrary';
import ChatBot from '@/components/ChatBot';
import ProgressPage from '@/components/ProgressPage';
import ProfilePage from '@/components/ProfilePage';
import SettingsPage from '@/components/SettingsPage';
import AdminPanel from '@/components/AdminPanel';
import AdminRoute from '@/components/AdminRoute';
import NutritionStats from '@/components/NutritionStats';
import DashboardGoals from '@/components/DashboardGoals';
import CaloriesChart from '@/components/CaloriesChart';
import WeightChart from '@/components/WeightChart';
import NotificationCenter from '@/components/NotificationCenter';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "custom">("7d");
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Bienvenue dans votre espace nutrition personnel</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell size={18} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </Button>
              </div>
            </div>
            
            <NotificationCenter 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NutritionStats />
              <DashboardGoals onViewProgress={() => setActiveSection('progress')} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CaloriesChart period={chartPeriod} />
              <WeightChart period={chartPeriod} />
            </div>
          </div>
        );
      case 'plans':
        return <MealPlanner />;
      case 'foods':
        return <FoodLibrary />;
      case 'chat':
        return <ChatBot />;
      case 'progress':
        return <ProgressPage />;
      case 'profile':
        return <ProfilePage onManageGoals={() => setActiveSection('progress')} />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return (
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
      
      <div className="lg:hidden">
        <MobileNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
    </div>
  );
};

export default Index;
