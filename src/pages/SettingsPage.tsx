import React from 'react';
import { Settings, Bell, Shield, Globe } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuración</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona la configuración de tu plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-brand-primary" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notificaciones</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Configura las notificaciones de la plataforma</p>
            <Button variant="secondary">Configurar</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-brand-accent" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Seguridad</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Gestiona la seguridad de tu cuenta</p>
            <Button variant="secondary">Configurar</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-6 w-6 text-brand-secondary" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Integración WhatsApp</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Configura la integración con WhatsApp</p>
            <Button variant="secondary">Configurar</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Configuración General</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ajustes generales de la plataforma</p>
            <Button variant="secondary">Configurar</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage; 