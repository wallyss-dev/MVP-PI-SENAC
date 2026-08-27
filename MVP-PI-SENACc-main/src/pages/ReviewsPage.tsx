import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Avaliacao, Leitura, Membro } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, Textarea } from '@/components/ui/Input';
import { LoadingSpinner, EmptyState } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { Star, Plus } from 'lucide-react';
import { formatDateTime } from '@/utils/format';

export function ReviewsPage() {
  const { showToast } = useToast();
  const { data: avaliacoes, loading, refetch } = useApi<Avaliacao[]>(() => api.getAvaliacoes());
  const { data: leituras } = useApi<Leitura[]>(() => api.getLeituras());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id_membro: '', id_leitura: '', nota: '5', comentario: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [membros, setMembros] = useState<Membro[]>([]);

  const handleLeituraChange = async (leituraId: string) => {
    setForm({ ...form, id_leitura: leituraId, id_membro: '' });
    if (leituraId) {
      const leitura = leituras?.find((l) => l.id_leitura === Number(leituraId));
      if (leitura) {
        try {
          const m = await api.getMembros(leitura.id_clube);
          setMembros(m);
        } catch { setMembros([]); }
      }
    } else {
      setMembros([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.id_leitura) errs.id_leitura = 'Leitura é obrigatória';
    if (!form.id_membro) errs.id_membro = 'Membro é obrigatório';
    const nota = Number(form.nota);
    if (nota < 1 || nota > 5) errs.nota = 'Nota deve ser entre 1 e 5';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createAvaliacao({
        id_membro: Number(form.id_membro),
        id_leitura: Number(form.id_leitura),
        nota,
        comentario: form.comentario || undefined,
      });
      showToast('Avaliação criada com sucesso!', 'success');
      setModalOpen(false);
      setForm({ id_membro: '', id_leitura: '', nota: '5', comentario: '' });
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar avaliação', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Avaliações' }]} />
      <PageHeader
        title={<>Críticas & <span className="italic">Avaliações</span></>}
        subtitle="Avaliações dos membros sobre as leituras"
        action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" strokeWidth={1.5} /> Nova Avaliação</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !avaliacoes || avaliacoes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Star className="w-10 h-10" strokeWidth={1} />}
            title="Nenhuma avaliação"
            message="Seja o primeiro a avaliar uma leitura"
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" strokeWidth={1.5} /> Nova Avaliação</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {avaliacoes.map((a) => (
            <Card key={a.id_avaliacao}>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-ink-900">{a.livro_titulo}</h3>
                    <p className="text-xs text-ink-400 mt-1.5">{a.clube_nome} — {a.membro_nome}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i <= a.nota ? 'text-accent-500 fill-accent-500' : 'text-ink-200'}`} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                {a.comentario && <p className="text-base text-ink-500 mt-4 leading-relaxed font-serif font-light">{a.comentario}</p>}
                <p className="text-[10px] text-ink-300 mt-6 tracking-widest-editorial uppercase">{formatDateTime(a.criado_em)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Avaliação">
        <form onSubmit={handleSubmit} className="space-y-7">
          <Select label="Leitura *" value={form.id_leitura} onChange={(e) => handleLeituraChange(e.target.value)} error={errors.id_leitura}>
            <option value="">Selecione uma leitura</option>
            {leituras?.map((l) => <option key={l.id_leitura} value={l.id_leitura}>{l.livro_titulo} — {l.clube_nome}</option>)}
          </Select>
          <Select label="Membro *" value={form.id_membro} onChange={(e) => setForm({ ...form, id_membro: e.target.value })} error={errors.id_membro} disabled={!membros.length}>
            <option value="">Selecione um membro</option>
            {membros.map((m) => <option key={m.id_membro} value={m.id_membro}>{m.usuario_nome} ({m.papel})</option>)}
          </Select>
          <div className="space-y-3">
            <label className="block text-[11px] font-medium text-ink-400 tracking-wider-editorial uppercase">Nota (1-5) *</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((i) => (
                <button key={i} type="button" onClick={() => setForm({ ...form, nota: String(i) })}>
                  <Star className={`w-8 h-8 ${i <= Number(form.nota) ? 'text-accent-500 fill-accent-500' : 'text-ink-200'} hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            {errors.nota && <p className="text-xs text-red-600">{errors.nota}</p>}
          </div>
          <Textarea label="Comentário" value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} rows={3} placeholder="Sua opinião sobre a leitura..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
