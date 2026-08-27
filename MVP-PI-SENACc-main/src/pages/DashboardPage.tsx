import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { DashboardData } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState } from '@/components/ui/Common';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Users, BookOpen, BookMarked, CalendarDays, Vote, Star, Lightbulb, BookOpenCheck } from 'lucide-react';
import { formatDateTime, statusLabel } from '@/utils/format';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { data, loading, error } = useApi<DashboardData>(() => api.getDashboard());

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<Star className="w-10 h-10" strokeWidth={1} />} title="Erro ao carregar dashboard" message={error} />;
  if (!data) return null;

  const stats = [
    { label: 'Clubes', value: data.stats.total_clubes, icon: Users },
    { label: 'Livros', value: data.stats.total_livros, icon: BookOpen },
    { label: 'Leituras', value: data.stats.total_leituras, icon: BookMarked },
    { label: 'Encontros', value: data.stats.total_encontros, icon: CalendarDays },
    { label: 'Votações', value: data.stats.votacoes_abertas, icon: Vote },
    { label: 'Usuários', value: data.stats.total_usuarios, icon: Users },
  ];

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Hero: dark editorial header */}
      <div className="bg-ink-900 rounded-xl px-10 py-14 mb-20 -mx-6 sm:-mx-10 lg:-mx-16 lg:rounded-none lg:px-16">
        <p className="text-[11px] text-ink-500 tracking-widest-editorial uppercase mb-4">Visão geral</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-cream-50 tracking-tight leading-[1.05]">
          Bem-vindo ao <span className="italic text-accent-400">Dashboard</span>
        </h1>
        <p className="text-sm text-ink-400 mt-6 max-w-lg leading-relaxed">
          Uma visão curada dos clubes, leituras e encontros que compõem o BookClub Hub.
        </p>
      </div>

      {/* Stats: editorial numerals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-ink-100/30 mb-20 rounded-lg overflow-hidden border border-ink-100/40">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-cream-50 px-6 py-10 flex flex-col items-center text-center">
              <Icon className="w-4 h-4 text-ink-300 mb-5" strokeWidth={1.25} />
              <p className="font-serif text-5xl font-light text-ink-900">{s.value}</p>
              <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase mt-3">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card>
          <CardHeader title="Leituras em Andamento" />
          <CardBody>
            {data.leitura_atual.length === 0 ? (
              <EmptyState icon={<BookMarked className="w-8 h-8" strokeWidth={1} />} title="Nenhuma leitura em andamento" />
            ) : (
              <div className="space-y-1">
                {data.leitura_atual.map((l) => (
                  <Link to={`/readings`} key={l.id_leitura} className="flex items-center gap-4 py-4 group">
                    <div className="w-9 h-12 rounded border border-ink-100/60 bg-cream-100 flex items-center justify-center flex-shrink-0">
                      <BookOpenCheck className="w-4 h-4 text-accent-500" strokeWidth={1.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-base font-medium text-ink-900 group-hover:text-accent-700 transition-colors duration-300 truncate">{l.livro_titulo}</p>
                      <p className="text-xs text-ink-400 mt-1">{l.clube_nome} — {l.autor_nome}</p>
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
              <EmptyState icon={<CalendarDays className="w-8 h-8" strokeWidth={1} />} title="Nenhum encontro agendado" />
            ) : (
              <div className="space-y-1">
                {data.proximos_encontros.map((e) => (
                  <div key={e.id_encontro} className="flex items-center gap-4 py-4">
                    <div className="w-9 h-9 rounded-md border border-ink-100/60 bg-cream-100 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-ink-500" strokeWidth={1.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-base font-medium text-ink-900 truncate">{e.livro_titulo}</p>
                      <p className="text-xs text-ink-400 mt-1">{e.clube_nome} — {formatDateTime(e.data_hora)}</p>
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
              <EmptyState icon={<Star className="w-8 h-8" strokeWidth={1} />} title="Nenhuma avaliação" />
            ) : (
              <div className="space-y-1">
                {data.avaliacoes_recentes.map((a) => (
                  <div key={a.id_avaliacao} className="flex items-start gap-4 py-4">
                    <div className="flex items-center gap-0.5 flex-shrink-0 pt-1">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={`w-3 h-3 ${i <= a.nota ? 'text-accent-500 fill-accent-500' : 'text-ink-200'}`} strokeWidth={1.5} />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-800 truncate">{a.livro_titulo}</p>
                      <p className="text-xs text-ink-400 mt-1">{a.membro_nome}</p>
                      {a.comentario && <p className="text-xs text-ink-500 mt-2 line-clamp-2 leading-relaxed font-serif font-light">{a.comentario}</p>}
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
              <EmptyState icon={<Lightbulb className="w-8 h-8" strokeWidth={1} />} title="Nenhuma sugestão" />
            ) : (
              <div className="space-y-1">
                {data.sugestoes_recentes.map((s) => (
                  <div key={s.id_sugestao} className="flex items-center gap-4 py-4">
                    <div className="w-9 h-9 rounded-md border border-ink-100/60 bg-cream-100 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-accent-500" strokeWidth={1.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-800 truncate">{s.livro_titulo || s.titulo_sugerido}</p>
                      <p className="text-xs text-ink-400 mt-1">{s.membro_nome} — {s.clube_nome}</p>
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
