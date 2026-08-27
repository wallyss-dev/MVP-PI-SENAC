import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Livro } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState } from '@/components/ui/Common';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BookOpen, ArrowLeft, Calendar, Tag, User } from 'lucide-react';

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: livro, loading } = useApi<Livro>(() => api.getLivro(Number(id)));

  if (loading) return <LoadingSpinner size="lg" />;
  if (!livro) return <EmptyState title="Livro não encontrado" />;

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Livros', to: '/books' }, { label: livro.titulo }]} />
      <Button variant="outline" size="sm" onClick={() => navigate('/books')} className="mb-12"><ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Voltar</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card>
          <CardBody className="flex flex-col items-center text-center py-14">
            <div className="w-36 h-48 rounded-lg border border-ink-200/60 bg-cream-100 flex items-center justify-center mb-8">
              <BookOpen className="w-14 h-14 text-accent-500" strokeWidth={0.75} />
            </div>
            <h2 className="font-serif text-3xl font-light text-ink-900 leading-tight">{livro.titulo}</h2>
            <p className="text-sm text-ink-400 mt-3">{livro.autor_nome}</p>
            {livro.categoria_nome && <Badge variant="info" className="mt-5">{livro.categoria_nome}</Badge>}
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-12">
          <Card>
            <CardHeader title="Informações" />
            <CardBody className="space-y-6">
              <div className="flex items-center gap-4">
                <User className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Autor</p>
                  <p className="text-sm font-medium text-ink-800 mt-1">{livro.autor_nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Tag className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Categoria</p>
                  <p className="text-sm font-medium text-ink-800 mt-1">{livro.categoria_nome || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-4 h-4 text-ink-300" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-ink-400 tracking-widest-editorial uppercase">Ano de Publicação</p>
                  <p className="text-sm font-medium text-ink-800 mt-1">{livro.ano_publicacao || '-'}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {livro.sinopse && (
            <Card>
              <CardHeader title="Sinopse" />
              <CardBody>
                <p className="text-base text-ink-600 leading-relaxed font-serif font-light">{livro.sinopse}</p>
              </CardBody>
            </Card>
          )}

          {livro.autor_biografia && (
            <Card>
              <CardHeader title="Sobre o Autor" />
              <CardBody>
                <p className="text-sm text-ink-600 leading-relaxed">{livro.autor_biografia}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
