import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { Settings, Database, Bell, Palette, Globe } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState({ encontros: true, avaliacoes: true, votacoes: false });
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');

  const handleSave = () => {
    showToast('Configurações salvas com sucesso!', 'success');
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Configurações' }]} />
      <PageHeader title="Configurações" subtitle="Preferências do sistema" />

      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader title="Notificações" subtitle="Configure como deseja receber avisos" />
          <CardBody className="space-y-4">
            {[
              { key: 'encontros', label: 'Novos encontros', desc: 'Receber notificação quando um encontro for agendado' },
              { key: 'avaliacoes', label: 'Avaliações', desc: 'Receber notificação sobre novas avaliações' },
              { key: 'votacoes', label: 'Votações', desc: 'Receber notificação quando uma votação for aberta' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-stone-800">{item.label}</p>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-amber-600' : 'bg-stone-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Conexão com API" subtitle="Configuração do backend" />
          <CardBody className="space-y-4">
            <Input label="URL da API" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Database className="w-4 h-4" />
              <span>PostgreSQL via Flask - backend/database/connection.py</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sobre o Sistema" />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-stone-400" />
                <div><p className="font-medium text-stone-800">Versão</p><p className="text-stone-500">1.0.0</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-stone-400" />
                <div><p className="font-medium text-stone-800">Banco</p><p className="text-stone-500">PostgreSQL</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-stone-400" />
                <div><p className="font-medium text-stone-800">Backend</p><p className="text-stone-500">Python + Flask</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-stone-400" />
                <div><p className="font-medium text-stone-800">Frontend</p><p className="text-stone-500">React + Vite + Tailwind</p></div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  );
}
