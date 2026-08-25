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
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Clubes' }]} />
      <PageHeader
        title="Clubes de Leitura"
        subtitle="Gerencie os clubes cadastrados"
        action={<Button onClick={() => navigate('/clubs/new')}><Plus className="w-4 h-4" /> Novo Clube</Button>}
      />

      {!clubes || clubes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="Nenhum clube cadastrado"
            message="Crie o primeiro clube de leitura para começar"
            action={<Button onClick={() => navigate('/clubs/new')}><Plus className="w-4 h-4" /> Criar Clube</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubes.map((clube) => (
            <Card key={clube.id_clube} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <Badge variant={clube.total_membros && clube.total_membros > 0 ? 'success' : 'default'}>
                    {clube.total_membros || 0} membros
                  </Badge>
                </div>
                <h3 className="font-semibold text-stone-800 mb-1">{clube.nome}</h3>
                <p className="text-sm text-stone-500 line-clamp-2 mb-3">{clube.descricao || 'Sem descrição'}</p>
                <p className="text-xs text-stone-400 mb-4">Admin: {clube.admin_nome || '-'}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/clubs/${clube.id_clube}`)}>
                    <Eye className="w-3.5 h-3.5" /> Ver
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(clube.id_clube)} className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
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
