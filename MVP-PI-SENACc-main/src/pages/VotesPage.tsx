import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Votacao, Clube, Sugestao } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { LoadingSpinner, EmptyState } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { Vote, Plus, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/format';

export function VotesPage() {
  const { showToast } = useToast();
  const { data: votacoes, loading, refetch } = useApi<Votacao[]>(() => api.getVotacoes());
  const { data: clubes } = useApi<Clube[]>(() => api.getClubes());
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Votacao | null>(null);
  const [form, setForm] = useState({ id_clube: '', titulo: '', aberta: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleExpand = async (votacaoId: number) => {
    if (expandedId === votacaoId) {
      setExpandedId(null);
      return;
    }
    try {
      const d = await api.getVotacao(votacaoId);
      setDetail(d);
      setExpandedId(votacaoId);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao carregar votação', 'error');
    }
  };

  const handleVote = async (opcaoId: number) => {
    const membroId = 1; // Demo: Ana Silva (membro 1)
    try {
      await api.castVote(opcaoId, membroId);
      showToast('Voto registrado com sucesso!', 'success');
      if (expandedId) {
        const d = await api.getVotacao(expandedId);
        setDetail(d);
      }
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao votar', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.id_clube) errs.id_clube = 'Clube é obrigatório';
    if (!form.titulo) errs.titulo = 'Título é obrigatório';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createVotacao({ id_clube: Number(form.id_clube), titulo: form.titulo, aberta: form.aberta });
      showToast('Votação criada com sucesso!', 'success');
      setModalOpen(false);
      setForm({ id_clube: '', titulo: '', aberta: true });
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar votação', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Votações' }]} />
      <PageHeader
        title="Votações"
        subtitle="Votações para escolher próximas leituras"
        action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nova Votação</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !votacoes || votacoes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Vote className="w-12 h-12" />}
            title="Nenhuma votação"
            message="Crie a primeira votação para um clube"
            action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nova Votação</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {votacoes.map((v) => (
            <Card key={v.id_votacao}>
              <CardBody>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleExpand(v.id_votacao)}
                >
                  <div className="flex items-center gap-3">
                    {expandedId === v.id_votacao ? <ChevronDown className="w-5 h-5 text-stone-400" /> : <ChevronRight className="w-5 h-5 text-stone-400" />}
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <Vote className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800">{v.titulo}</h3>
                      <p className="text-xs text-stone-500">{v.clube_nome} - {formatDate(v.criado_em)}</p>
                    </div>
                  </div>
                  <Badge variant={v.aberta ? 'success' : 'default'}>{v.aberta ? 'Aberta' : 'Fechada'}</Badge>
                </div>

                {expandedId === v.id_votacao && detail?.opcoes && detail.opcoes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                    {detail.opcoes.map((op) => {
                        const totalVotos = detail.opcoes!.reduce((sum, o) => sum + (o.total_votos || 0), 0);
                        const pct = totalVotos > 0 ? Math.round(((op.total_votos || 0) / totalVotos) * 100) : 0;
                        return (
                          <div key={op.id_opcao} className="flex items-center gap-3 p-3 rounded-lg bg-stone-50">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-stone-800">{op.livro_titulo || op.titulo_sugerido}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-stone-500 w-20 text-right">{op.total_votos || 0} votos ({pct}%)</span>
                              </div>
                            </div>
                            {v.aberta && (
                              <Button size="sm" variant="outline" onClick={() => handleVote(op.id_opcao)}>
                                <CheckCircle className="w-3.5 h-3.5" /> Votar
                              </Button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Votação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Clube *" value={form.id_clube} onChange={(e) => setForm({ ...form, id_clube: e.target.value })} error={errors.id_clube}>
            <option value="">Selecione um clube</option>
            {clubes?.map((c) => <option key={c.id_clube} value={c.id_clube}>{c.nome}</option>)}
          </Select>
          <Input label="Título da Votação *" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} error={errors.titulo} placeholder="Ex: Próxima leitura - Setembro 2026" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="aberta" checked={form.aberta} onChange={(e) => setForm({ ...form, aberta: e.target.checked })} className="rounded border-stone-300" />
            <label htmlFor="aberta" className="text-sm text-stone-700">Votação aberta imediatamente</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
