import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Clube } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState, ConfirmDialog } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { Users, Plus, Trash2, Eye } from 'lucide-react';

export function ClubsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: clubes, loading, refetch } = useApi<Clube[]>(() => api.getClubes());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteClube(deleteId);
      showToast('Clube excluído com sucesso', 'success');
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao excluir clube', 'error');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Clubes' }]} />
      <PageHeader
        title={<>Meus <span className="italic">Clubes</span></>}
        subtitle="Gerencie os clubes cadastrados"
        action={<Button onClick={() => navigate('/clubs/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Novo Clube</Button>}
      />

      {!clubes || clubes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="w-10 h-10" strokeWidth={1} />}
            title="Nenhum clube cadastrado"
            message="Crie o primeiro clube de leitura para começar"
            action={<Button onClick={() => navigate('/clubs/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Criar Clube</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {clubes.map((clube) => (
            <Card key={clube.id_clube} className="group hover:border-ink-200/80">
              <CardBody>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-11 h-11 rounded-md border border-ink-100/60 bg-cream-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-ink-500" strokeWidth={1.25} />
                  </div>
                  <Badge variant={clube.total_membros && clube.total_membros > 0 ? 'success' : 'default'}>
                    {clube.total_membros || 0} membros
                  </Badge>
                </div>
                <h3 className="font-serif text-2xl font-light text-ink-900 mb-3 group-hover:text-accent-700 transition-colors duration-300">{clube.nome}</h3>
                <p className="text-sm text-ink-400 leading-relaxed line-clamp-2 mb-6">{clube.descricao || 'Sem descrição'}</p>
                <div className="flex items-center gap-2 mb-8 pb-8 border-b border-ink-100/40">
                  <span className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Admin</span>
                  <span className="text-xs text-ink-600">{clube.admin_nome || '-'}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/clubs/${clube.id_clube}`)}>
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> Ver
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(clube.id_clube)} className="text-ink-300 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Clube"
        message="Tem certeza que deseja excluir este clube? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
      />
    </div>
  );
}
