import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Sugestao, Clube, Membro, Livro } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState, ConfirmDialog } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { Lightbulb, Plus, Trash2, BookOpen } from 'lucide-react';
import { formatDate } from '@/utils/format';

export function SuggestionsPage() {
  const { showToast } = useToast();
  const { data: sugestoes, loading, refetch } = useApi<Sugestao[]>(() => api.getSugestoes());
  const { data: clubes } = useApi<Clube[]>(() => api.getClubes());
  const { data: livros } = useApi<Livro[]>(() => api.getLivros());
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ id_clube: '', id_membro: '', id_livro: '', titulo_sugerido: '', tipo: 'livro' });
  const [membros, setMembros] = useState<Membro[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleClubeChange = async (clubeId: string) => {
    setForm({ ...form, id_clube: clubeId, id_membro: '' });
    if (clubeId) {
      try {
        const m = await api.getMembros(Number(clubeId));
        setMembros(m);
      } catch { setMembros([]); }
    } else {
      setMembros([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.id_clube) errs.id_clube = 'Clube é obrigatório';
    if (!form.id_membro) errs.id_membro = 'Membro é obrigatório';
    if (form.tipo === 'livro' && !form.id_livro) errs.id_livro = 'Livro é obrigatório';
    if (form.tipo === 'titulo' && !form.titulo_sugerido) errs.titulo_sugerido = 'Título é obrigatório';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createSugestao({
        id_clube: Number(form.id_clube),
        id_membro: Number(form.id_membro),
        id_livro: form.tipo === 'livro' ? Number(form.id_livro) : undefined,
        titulo_sugerido: form.tipo === 'titulo' ? form.titulo_sugerido : undefined,
      });
      showToast('Sugestão criada com sucesso!', 'success');
      setModalOpen(false);
      setForm({ id_clube: '', id_membro: '', id_livro: '', titulo_sugerido: '', tipo: 'livro' });
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar sugestão', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteSugestao(deleteId);
      showToast('Sugestão excluída', 'success');
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao excluir', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Sugestões' }]} />
      <PageHeader
        title="Sugestões"
        subtitle="Sugestões de leitura dos membros"
        action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nova Sugestão</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !sugestoes || sugestoes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Lightbulb className="w-12 h-12" />}
            title="Nenhuma sugestão"
            message="Sugira um livro para o seu clube"
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nova Sugestão</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sugestoes.map((s) => (
            <Card key={s.id_sugestao} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    {s.livro_titulo ? <BookOpen className="w-5 h-5 text-amber-600" /> : <Lightbulb className="w-5 h-5 text-amber-600" />}
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => setDeleteId(s.id_sugestao)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <h3 className="font-semibold text-stone-800 mb-1">{s.livro_titulo || s.titulo_sugerido}</h3>
                <p className="text-xs text-stone-500 mb-2">{s.clube_nome}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={s.livro_titulo ? 'info' : 'default'}>{s.livro_titulo ? 'Livro cadastrado' : 'Título livre'}</Badge>
                  <span className="text-xs text-stone-400">Por: {s.membro_nome}</span>
                </div>
                <p className="text-xs text-stone-400 mt-2">{formatDate(s.criado_em)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Sugestão">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Clube *" value={form.id_clube} onChange={(e) => handleClubeChange(e.target.value)} error={errors.id_clube}>
            <option value="">Selecione um clube</option>
            {clubes?.map((c) => <option key={c.id_clube} value={c.id_clube}>{c.nome}</option>)}
          </Select>
          <Select label="Membro *" value={form.id_membro} onChange={(e) => setForm({ ...form, id_membro: e.target.value })} error={errors.id_membro} disabled={!membros.length}>
            <option value="">Selecione um membro</option>
            {membros.map((m) => <option key={m.id_membro} value={m.id_membro}>{m.usuario_nome}</option>)}
          </Select>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-700">Tipo de Sugestão</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm({ ...form, tipo: 'livro' })} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${form.tipo === 'livro' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-300 text-stone-600'}`}>Livro existente</button>
              <button type="button" onClick={() => setForm({ ...form, tipo: 'titulo' })} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${form.tipo === 'titulo' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-300 text-stone-600'}`}>Título livre</button>
            </div>
          </div>
          {form.tipo === 'livro' ? (
            <Select label="Livro *" value={form.id_livro} onChange={(e) => setForm({ ...form, id_livro: e.target.value })} error={errors.id_livro}>
              <option value="">Selecione um livro</option>
              {livros?.map((l) => <option key={l.id_livro} value={l.id_livro}>{l.titulo}</option>)}
            </Select>
          ) : (
            <Input label="Título Sugerido *" value={form.titulo_sugerido} onChange={(e) => setForm({ ...form, titulo_sugerido: e.target.value })} error={errors.titulo_sugerido} placeholder="Ex: O Quincas Borba - Machado de Assis" />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Sugestão"
        message="Tem certeza que deseja excluir esta sugestão?"
        confirmLabel="Excluir"
      />
    </div>
  );
}
