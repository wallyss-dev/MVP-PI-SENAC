import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Leitura } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Plus, Eye } from 'lucide-react';
import { formatDate, statusLabel } from '@/utils/format';

export function ReadingsPage() {
  const navigate = useNavigate();
  const { data: leituras, loading } = useApi<Leitura[]>(() => api.getLeituras());

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Leituras' }]} />
      <PageHeader
        title={<>Leituras <span className="italic">Ativas</span></>}
        subtitle="Acompanhe as leituras dos clubes"
        action={<Button onClick={() => navigate('/readings/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Nova Leitura</Button>}
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !leituras || leituras.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookMarked className="w-10 h-10" strokeWidth={1} />}
            title="Nenhuma leitura cadastrada"
            message="Crie a primeira leitura para um clube"
            action={<Button onClick={() => navigate('/readings/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Nova Leitura</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {leituras.map((l) => (
            <Card key={l.id_leitura} className="group hover:border-ink-200/80">
              <CardBody>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-14 rounded border border-ink-100/60 bg-cream-100 flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-accent-500" strokeWidth={1.25} />
                  </div>
                  <Badge variant={l.status === 'em_andamento' ? 'amber' : l.status === 'concluida' ? 'success' : 'default'}>
                    {statusLabel(l.status)}
                  </Badge>
                </div>
                <h3 className="font-serif text-2xl font-light text-ink-900 mb-3 group-hover:text-accent-700 transition-colors duration-300">{l.livro_titulo}</h3>
                <p className="text-xs text-ink-400 mb-6">{l.clube_nome} — {l.autor_nome}</p>
                <div className="text-xs text-ink-400 space-y-1.5 mb-6 pb-6 border-b border-ink-100/40">
                  <p>Início: {formatDate(l.data_inicio)}</p>
                  <p>Fim: {formatDate(l.data_fim)}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/meetings')}>
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> Ver Encontros
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
