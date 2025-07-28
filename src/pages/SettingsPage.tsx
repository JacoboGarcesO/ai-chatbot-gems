import React from 'react';
import { Settings, Bell, Shield, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Gestiona la configuración de tu plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
          </div>
          <p className="text-gray-600 mb-4">Configura las notificaciones de la plataforma</p>
          <button className="btn-secondary">Configurar</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-medium text-gray-900">Seguridad</h3>
          </div>
          <p className="text-gray-600 mb-4">Gestiona la seguridad de tu cuenta</p>
          <button className="btn-secondary">Configurar</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-medium text-gray-900">Integración WhatsApp</h3>
          </div>
          <p className="text-gray-600 mb-4">Configura la integración con WhatsApp</p>
          <button className="btn-secondary">Configurar</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Configuración General</h3>
          </div>
          <p className="text-gray-600 mb-4">Ajustes generales de la plataforma</p>
          <button className="btn-secondary">Configurar</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 