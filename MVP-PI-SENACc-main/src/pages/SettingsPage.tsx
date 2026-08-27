import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { Settings, Database, Palette, Globe } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState({ encontros: true, avaliacoes: true, votacoes: false });
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');

  const handleSave = () => {
    showToast('Configurações salvas com sucesso!', 'success');
  };

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Configurações' }]} />
      <PageHeader title={<>Configurações <span className="italic">Gerais</span></>} subtitle="Preferências do sistema" />

      <div className="space-y-12 max-w-3xl">
        <Card>
          <CardHeader title="Notificações" subtitle="Configure como deseja receber avisos" />
          <CardBody className="space-y-6">
            {[
              { key: 'encontros', label: 'Novos encontros', desc: 'Receber notificação quando um encontro for agendado' },
              { key: 'avaliacoes', label: 'Avaliações', desc: 'Receber notificação sobre novas avaliações' },
              { key: 'votacoes', label: 'Votações', desc: 'Receber notificação quando uma votação for aberta' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 border-b border-ink-100/40 last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink-800">{item.label}</p>
                  <p className="text-xs text-ink-400 mt-1.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-350 ${notifications[item.key as keyof typeof notifications] ? 'bg-accent-500' : 'bg-ink-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream-50 transition-transform duration-350 ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Conexão com API" subtitle="Configuração do backend" />
          <CardBody className="space-y-6">
            <Input label="URL da API" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
            <div className="flex items-center gap-2.5 text-xs text-ink-400">
              <Database className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
              <span>PostgreSQL via Flask — backend/database/connection.py</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sobre o Sistema" />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-ink-300" strokeWidth={1.5} />
                <div><p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Versão</p><p className="text-sm font-medium text-ink-800 mt-1">1.0.0</p></div>
              </div>
              <div className="flex items-center gap-4">
                <Database className="w-5 h-5 text-ink-300" strokeWidth={1.5} />
                <div><p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Banco</p><p className="text-sm font-medium text-ink-800 mt-1">PostgreSQL</p></div>
              </div>
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-ink-300" strokeWidth={1.5} />
                <div><p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Backend</p><p className="text-sm font-medium text-ink-800 mt-1">Python + Flask</p></div>
              </div>
              <div className="flex items-center gap-4">
                <Palette className="w-5 h-5 text-ink-300" strokeWidth={1.5} />
                <div><p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Frontend</p><p className="text-sm font-medium text-ink-800 mt-1">React + Vite + Tailwind</p></div>
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
