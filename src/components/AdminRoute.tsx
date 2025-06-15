
import React from 'react';
import { useRole } from '@/hooks/useRole';
import { Loader2, Shield } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border">
          <Shield className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">
            Vous devez avoir des privilèges administrateur pour accéder à cette section.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
