import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Sugestao, Clube, Membro, Livro } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
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
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Sugestões' }]} />
      <PageHeader
        title={<>Sugestões de <span className="italic">Leitura</span></>}
        subtitle="Propostas de leitura dos membros"
        action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" strokeWidth={1.5} /> Nova Sugestão</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !sugestoes || sugestoes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Lightbulb className="w-10 h-10" strokeWidth={1} />}
            title="Nenhuma sugestão"
            message="Sugira um livro para o seu clube"
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" strokeWidth={1.5} /> Nova Sugestão</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sugestoes.map((s) => (
            <Card key={s.id_sugestao} className="group hover:border-ink-200/80">
              <CardBody>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-10 rounded-md border border-ink-100/60 bg-cream-100 flex items-center justify-center">
                    {s.livro_titulo ? <BookOpen className="w-5 h-5 text-accent-500" strokeWidth={1.25} /> : <Lightbulb className="w-5 h-5 text-accent-500" strokeWidth={1.25} />}
                  </div>
                  <Button variant="ghost" size="sm" className="text-ink-300 hover:text-red-500 hover:bg-red-50" onClick={() => setDeleteId(s.id_sugestao)}>
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
                <h3 className="font-serif text-2xl font-light text-ink-900 mb-3 group-hover:text-accent-700 transition-colors duration-300">{s.livro_titulo || s.titulo_sugerido}</h3>
                <p className="text-xs text-ink-400 mb-6">{s.clube_nome}</p>
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant={s.livro_titulo ? 'info' : 'default'}>{s.livro_titulo ? 'Livro cadastrado' : 'Título livre'}</Badge>
                  <span className="text-xs text-ink-400">Por: {s.membro_nome}</span>
                </div>
                <p className="text-[10px] text-ink-300 tracking-widest-editorial uppercase">{formatDate(s.criado_em)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Sugestão">
        <form onSubmit={handleSubmit} className="space-y-7">
          <Select label="Clube *" value={form.id_clube} onChange={(e) => handleClubeChange(e.target.value)} error={errors.id_clube}>
            <option value="">Selecione um clube</option>
            {clubes?.map((c) => <option key={c.id_clube} value={c.id_clube}>{c.nome}</option>)}
          </Select>
          <Select label="Membro *" value={form.id_membro} onChange={(e) => setForm({ ...form, id_membro: e.target.value })} error={errors.id_membro} disabled={!membros.length}>
            <option value="">Selecione um membro</option>
            {membros.map((m) => <option key={m.id_membro} value={m.id_membro}>{m.usuario_nome}</option>)}
          </Select>
          <div className="space-y-3">
            <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">Tipo de Sugestão</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setForm({ ...form, tipo: 'livro' })} className={`flex-1 px-4 py-3 rounded-md text-[11px] font-medium border tracking-wider-editorial uppercase transition-all duration-300 ${form.tipo === 'livro' ? 'border-accent-400 bg-accent-50 text-accent-700' : 'border-ink-200/60 text-ink-400 hover:border-ink-300'}`}>Livro existente</button>
              <button type="button" onClick={() => setForm({ ...form, tipo: 'titulo' })} className={`flex-1 px-4 py-3 rounded-md text-[11px] font-medium border tracking-wider-editorial uppercase transition-all duration-300 ${form.tipo === 'titulo' ? 'border-accent-400 bg-accent-50 text-accent-700' : 'border-ink-200/60 text-ink-400 hover:border-ink-300'}`}>Título livre</button>
            </div>
          </div>
          {form.tipo === 'livro' ? (
            <Select label="Livro *" value={form.id_livro} onChange={(e) => setForm({ ...form, id_livro: e.target.value })} error={errors.id_livro}>
              <option value="">Selecione um livro</option>
              {livros?.map((l) => <option key={l.id_livro} value={l.id_livro}>{l.titulo}</option>)}
            </Select>
          ) : (
            <Input label="Título Sugerido *" value={form.titulo_sugerido} onChange={(e) => setForm({ ...form, titulo_sugerido: e.target.value })} error={errors.titulo_sugerido} placeholder="Ex: O Quincas Borba — Machado de Assis" />
          )}
          <div className="flex justify-end gap-3 pt-4">
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
