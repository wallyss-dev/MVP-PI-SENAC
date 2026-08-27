import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Leitura } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Save } from 'lucide-react';

export function NewMeetingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: leituras } = useApi<Leitura[]>(() => api.getLeituras());
  const [form, setForm] = useState({ id_leitura: '', data_hora: '', local_link: '', descricao: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.id_leitura) errs.id_leitura = 'Leitura é obrigatória';
    if (!form.data_hora) errs.data_hora = 'Data e hora são obrigatórias';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createEncontro({
        id_leitura: Number(form.id_leitura),
        data_hora: form.data_hora.replace('T', ' ') + ':00',
        local_link: form.local_link || undefined,
        descricao: form.descricao || undefined,
      });
      showToast('Encontro criado com sucesso!', 'success');
      navigate('/meetings');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar encontro', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Encontros', to: '/meetings' }, { label: 'Novo Encontro' }]} />
      <PageHeader title={<>Novo <span className="italic">Encontro</span></>} subtitle="Agende um encontro para uma leitura" />

      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-7">
              <Select label="Leitura *" value={form.id_leitura} onChange={(e) => setForm({ ...form, id_leitura: e.target.value })} error={errors.id_leitura}>
                <option value="">Selecione uma leitura</option>
                {leituras?.map((l) => <option key={l.id_leitura} value={l.id_leitura}>{l.livro_titulo} — {l.clube_nome}</option>)}
              </Select>
              <Input label="Data e Hora *" type="datetime-local" value={form.data_hora} onChange={(e) => setForm({ ...form, data_hora: e.target.value })} error={errors.data_hora} />
              <Input label="Link do Encontro" value={form.local_link} onChange={(e) => setForm({ ...form, local_link: e.target.value })} placeholder="https://meet.example.com/..." />
              <Textarea label="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} placeholder="Pauta do encontro..." />
              <div className="flex gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate('/meetings')}><ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Cancelar</Button>
                <Button type="submit" disabled={saving}><Save className="w-4 h-4" strokeWidth={1.5} /> {saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
