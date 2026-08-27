import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Clube, Membro, Leitura, Sugestao } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState, ConfirmDialog } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { Users, BookMarked, Lightbulb, Trash2, UserPlus, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/utils/format';

export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const clubeId = Number(id);

  const { data: clube, loading } = useApi<Clube>(() => api.getClube(clubeId));
  const { data: membros, refetch: refetchMembros } = useApi<Membro[]>(() => api.getMembros(clubeId));
  const { data: leituras } = useApi<Leitura[]>(() => api.getLeituras(clubeId));
  const { data: sugestoes } = useApi<Sugestao[]>(() => api.getSugestoes(clubeId));
  const [removeMembroId, setRemoveMembroId] = useState<number | null>(null);

  const handleRemoveMembro = async () => {
    if (!removeMembroId) return;
    try {
      await api.removeMembro(removeMembroId);
      showToast('Membro removido', 'success');
      refetchMembros();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao remover membro', 'error');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!clube) return <EmptyState title="Clube não encontrado" />;

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Clubes', to: '/clubs' }, { label: clube.nome }]} />
      <PageHeader
        title={clube.nome}
        subtitle={clube.descricao || 'Sem descrição'}
        action={<Button variant="outline" onClick={() => navigate('/clubs')}><ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Voltar</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card>
          <CardHeader title="Informações" />
          <CardBody className="space-y-7">
            <div>
              <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mb-2">Administrador</p>
              <p className="text-sm font-medium text-ink-800">{clube.admin_nome || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mb-2">Criado em</p>
              <p className="text-sm font-medium text-ink-800">{formatDate(clube.criado_em)}</p>
            </div>
            <div className="pt-4 border-t border-ink-100/40">
              <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mb-3">Total de membros</p>
              <p className="font-serif text-5xl font-light text-ink-900">{membros?.length || 0}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Membros" action={<Button size="sm" variant="outline"><UserPlus className="w-3.5 h-3.5" strokeWidth={1.5} /> Adicionar</Button>} />
          <CardBody>
            {!membros || membros.length === 0 ? (
              <EmptyState icon={<Users className="w-8 h-8" strokeWidth={1} />} title="Nenhum membro" />
            ) : (
              <div className="space-y-1">
                {membros.map((m) => (
                  <div key={m.id_membro} className="flex items-center justify-between py-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full border border-ink-200/60 bg-cream-100 flex items-center justify-center text-[11px] font-medium text-ink-500 tracking-wider-editorial uppercase">
                        {m.usuario_nome?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-800">{m.usuario_nome}</p>
                        <p className="text-xs text-ink-400 mt-1">{m.usuario_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={m.papel === 'admin' ? 'amber' : 'default'}>{m.papel}</Badge>
                      <button onClick={() => setRemoveMembroId(m.id_membro)} className="text-ink-300 hover:text-red-500 transition-colors duration-300 p-1">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Leituras do Clube" />
          <CardBody>
            {!leituras || leituras.length === 0 ? (
              <EmptyState icon={<BookMarked className="w-8 h-8" strokeWidth={1} />} title="Nenhuma leitura" />
            ) : (
              <div className="space-y-1">
                {leituras.map((l) => (
                  <div key={l.id_leitura} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-serif text-lg font-medium text-ink-900">{l.livro_titulo}</p>
                      <p className="text-xs text-ink-400 mt-1">{l.autor_nome} — Início: {formatDate(l.data_inicio)}</p>
                    </div>
                    <Badge variant={l.status === 'em_andamento' ? 'amber' : l.status === 'concluida' ? 'success' : 'default'}>
                      {l.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sugestões" />
          <CardBody>
            {!sugestoes || sugestoes.length === 0 ? (
              <EmptyState icon={<Lightbulb className="w-8 h-8" strokeWidth={1} />} title="Nenhuma sugestão" />
            ) : (
              <div className="space-y-1">
                {sugestoes.map((s) => (
                  <div key={s.id_sugestao} className="py-4">
                    <p className="font-serif text-lg font-medium text-ink-900">{s.livro_titulo || s.titulo_sugerido}</p>
                    <p className="text-xs text-ink-400 mt-1">Por: {s.membro_nome}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={removeMembroId !== null}
        onClose={() => setRemoveMembroId(null)}
        onConfirm={handleRemoveMembro}
        title="Remover Membro"
        message="Tem certeza que deseja remover este membro do clube?"
        confirmLabel="Remover"
      />
    </div>
  );
}
