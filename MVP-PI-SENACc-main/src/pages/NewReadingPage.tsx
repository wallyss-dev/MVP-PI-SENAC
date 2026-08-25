import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Clube, Livro } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Save } from 'lucide-react';

export function NewReadingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: clubes } = useApi<Clube[]>(() => api.getClubes());
  const { data: livros } = useApi<Livro[]>(() => api.getLivros());
  const [form, setForm] = useState({ id_clube: '', id_livro: '', data_inicio: '', data_fim: '', status: 'em_andamento' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.id_clube) errs.id_clube = 'Clube é obrigatório';
    if (!form.id_livro) errs.id_livro = 'Livro é obrigatório';
    if (!form.status) errs.status = 'Status é obrigatório';
    if (form.data_inicio && form.data_fim && new Date(form.data_fim) < new Date(form.data_inicio)) {
      errs.data_fim = 'Data fim não pode ser anterior à data início';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createLeitura({
        id_clube: Number(form.id_clube),
        id_livro: Number(form.id_livro),
        data_inicio: form.data_inicio || undefined,
        data_fim: form.data_fim || undefined,
        status: form.status,
      });
      showToast('Leitura criada com sucesso!', 'success');
      navigate('/readings');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar leitura', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Leituras', to: '/readings' }, { label: 'Nova Leitura' }]} />
      <PageHeader title="Nova Leitura" subtitle="Crie uma nova leitura para um clube" />

      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select label="Clube *" value={form.id_clube} onChange={(e) => setForm({ ...form, id_clube: e.target.value })} error={errors.id_clube}>
                <option value="">Selecione um clube</option>
                {clubes?.map((c) => <option key={c.id_clube} value={c.id_clube}>{c.nome}</option>)}
              </Select>
              <Select label="Livro *" value={form.id_livro} onChange={(e) => setForm({ ...form, id_livro: e.target.value })} error={errors.id_livro}>
                <option value="">Selecione um livro</option>
                {livros?.map((l) => <option key={l.id_livro} value={l.id_livro}>{l.titulo}</option>)}
              </Select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Data de Início" type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
                <Input label="Data de Fim" type="date" value={form.data_fim} onChange={(e) => setForm({ ...form, data_fim: e.target.value })} error={errors.data_fim} />
              </div>
              <Select label="Status *" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} error={errors.status}>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="planejada">Planejada</option>
                <option value="cancelada">Cancelada</option>
              </Select>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/readings')}><ArrowLeft className="w-4 h-4" /> Cancelar</Button>
                <Button type="submit" disabled={saving}><Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
