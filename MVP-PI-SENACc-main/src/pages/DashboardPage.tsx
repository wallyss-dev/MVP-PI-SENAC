import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { DashboardData } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { Users, BookOpen, BookMarked, CalendarDays, Vote, Star, Lightbulb, BookOpenCheck } from 'lucide-react';
import { formatDateTime, statusLabel, statusColor } from '@/utils/format';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { data, loading, error } = useApi<DashboardData>(() => api.getDashboard());

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<Star className="w-12 h-12" />} title="Erro ao carregar dashboard" message={error} />;
  if (!data) return null;

  const stats = [
    { label: 'Clubes', value: data.stats.total_clubes, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Livros', value: data.stats.total_livros, icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
    { label: 'Leituras', value: data.stats.total_leituras, icon: BookMarked, color: 'bg-green-50 text-green-600' },
    { label: 'Encontros', value: data.stats.total_encontros, icon: CalendarDays, color: 'bg-purple-50 text-purple-600' },
    { label: 'Votações Abertas', value: data.stats.votacoes_abertas, icon: Vote, color: 'bg-red-50 text-red-600' },
    { label: 'Usuários', value: data.stats.total_usuarios, icon: Users, color: 'bg-stone-50 text-stone-600' },
  ];

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <PageHeader title="Dashboard" subtitle="Visão geral do BookClub Hub" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardBody className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-stone-800">{s.value}</p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Leituras em Andamento" />
          <CardBody>
            {data.leitura_atual.length === 0 ? (
              <EmptyState icon={<BookMarked className="w-8 h-8" />} title="Nenhuma leitura em andamento" />
            ) : (
              <div className="space-y-3">
                {data.leitura_atual.map((l) => (
                  <Link to={`/readings`} key={l.id_leitura} className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-14 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <BookOpenCheck className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-800 truncate">{l.livro_titulo}</p>
                      <p className="text-xs text-stone-500">{l.clube_nome} - {l.autor_nome}</p>
                    </div>
                    <Badge variant="amber">{statusLabel(l.status)}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Próximos Encontros" />
          <CardBody>
            {data.proximos_encontros.length === 0 ? (
              <EmptyState icon={<CalendarDays className="w-8 h-8" />} title="Nenhum encontro agendado" />
            ) : (
              <div className="space-y-3">
                {data.proximos_encontros.map((e) => (
                  <div key={e.id_encontro} className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-800 truncate">{e.livro_titulo}</p>
                      <p className="text-xs text-stone-500">{e.clube_nome} - {formatDateTime(e.data_hora)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Avaliações Recentes" />
          <CardBody>
            {data.avaliacoes_recentes.length === 0 ? (
              <EmptyState icon={<Star className="w-8 h-8" />} title="Nenhuma avaliação" />
            ) : (
              <div className="space-y-3">
                {data.avaliacoes_recentes.map((a) => (
                  <div key={a.id_avaliacao} className="flex items-start gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= a.nota ? 'text-amber-500 fill-amber-500' : 'text-stone-200'}`} />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-800 truncate">{a.livro_titulo}</p>
                      <p className="text-xs text-stone-500">{a.membro_nome}</p>
                      {a.comentario && <p className="text-xs text-stone-600 mt-1 line-clamp-2">{a.comentario}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sugestões Recentes" />
          <CardBody>
            {data.sugestoes_recentes.length === 0 ? (
              <EmptyState icon={<Lightbulb className="w-8 h-8" />} title="Nenhuma sugestão" />
            ) : (
              <div className="space-y-3">
                {data.sugestoes_recentes.map((s) => (
                  <div key={s.id_sugestao} className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-800 truncate">{s.livro_titulo || s.titulo_sugerido}</p>
                      <p className="text-xs text-stone-500">{s.membro_nome} - {s.clube_nome}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
