import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
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
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Perfil' }]} />
      <PageHeader title={<>Meu <span className="italic">Perfil</span></>} subtitle="Suas informações pessoais" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card>
          <CardBody className="flex flex-col items-center text-center py-14">
            <div className="w-28 h-28 rounded-full border border-ink-200/60 bg-cream-100 flex items-center justify-center mb-8">
              <span className="font-serif text-4xl font-light text-ink-600">AS</span>
            </div>
            <h2 className="font-serif text-2xl font-light text-ink-900">{form.nome}</h2>
            <p className="text-sm text-ink-400 mt-2">{form.email}</p>
            <div className="flex gap-10 mt-10 pt-10 border-t border-ink-100/40 text-center">
              <div>
                <p className="font-serif text-4xl font-light text-ink-900">3</p>
                <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mt-2">Clubes</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-light text-ink-900">12</p>
                <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mt-2">Avaliações</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-light text-ink-900">5</p>
                <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mt-2">Sugestões</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Editar Perfil" />
            <CardBody>
              <form onSubmit={handleSave} className="space-y-7">
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
