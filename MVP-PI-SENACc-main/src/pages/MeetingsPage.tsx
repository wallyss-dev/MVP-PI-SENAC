import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Encontro } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, EmptyState, ConfirmDialog } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { CalendarDays, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { formatDateTime } from '@/utils/format';

export function MeetingsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: encontros, loading, refetch } = useApi<Encontro[]>(() => api.getEncontros());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteEncontro(deleteId);
      showToast('Encontro excluído', 'success');
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao excluir', 'error');
    }
  };

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Encontros' }]} />
      <PageHeader
        title={<>Próximos <span className="italic">Encontros</span></>}
        subtitle="Reuniões e encontros dos clubes"
        action={<Button onClick={() => navigate('/meetings/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Novo Encontro</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !encontros || encontros.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarDays className="w-10 h-10" strokeWidth={1} />}
            title="Nenhum encontro cadastrado"
            message="Agende o primeiro encontro"
            action={<Button onClick={() => navigate('/meetings/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Novo Encontro</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {encontros.map((e) => (
            <Card key={e.id_encontro} className="group hover:border-ink-200/80">
              <CardBody>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-10 rounded-md border border-ink-100/60 bg-cream-100 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-ink-500" strokeWidth={1.25} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-ink-300 hover:text-red-500 hover:bg-red-50" onClick={() => setDeleteId(e.id_encontro)}>
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
                <h3 className="font-serif text-2xl font-light text-ink-900 mb-2">{e.livro_titulo}</h3>
                <p className="text-xs text-ink-400 mb-6">{e.clube_nome}</p>
                <div className="space-y-3 text-xs text-ink-600">
                  <div className="flex items-center gap-2.5"><Clock className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} /> {formatDateTime(e.data_hora)}</div>
                  {e.local_link && <div className="flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5 text-ink-300" strokeWidth={1.5} /> <span className="truncate">{e.local_link}</span></div>}
                </div>
                {e.descricao && <p className="text-xs text-ink-400 mt-5 pt-5 border-t border-ink-100/40 line-clamp-2 leading-relaxed">{e.descricao}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Encontro"
        message="Tem certeza que deseja excluir este encontro?"
        confirmLabel="Excluir"
      />
    </div>
  );
}
