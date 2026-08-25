import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { User, Mail, Calendar, BookOpenCheck, Users, Star } from 'lucide-react';
import { useState } from 'react';

export function ProfilePage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ nome: 'Ana Silva', email: 'ana.silva@email.com' });
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Perfil atualizado com sucesso!', 'success');
    }, 500);
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Perfil' }]} />
      <PageHeader title="Perfil" subtitle="Suas informações pessoais" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-amber-700">AS</span>
            </div>
            <h2 className="text-lg font-bold text-stone-800">{form.nome}</h2>
            <p className="text-sm text-stone-500">{form.email}</p>
            <div className="flex gap-4 mt-4 text-center">
              <div>
                <p className="text-lg font-bold text-stone-800">3</p>
                <p className="text-xs text-stone-500">Clubes</p>
              </div>
              <div>
                <p className="text-lg font-bold text-stone-800">12</p>
                <p className="text-xs text-stone-500">Avaliações</p>
              </div>
              <div>
                <p className="text-lg font-bold text-stone-800">5</p>
                <p className="text-xs text-stone-500">Sugestões</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Editar Perfil" />
            <CardBody>
              <form onSubmit={handleSave} className="space-y-4">
                <Input label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
