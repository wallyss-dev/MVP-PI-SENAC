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
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Livros', to: '/books' }, { label: livro.titulo }]} />
      <Button variant="outline" size="sm" onClick={() => navigate('/books')} className="mb-4"><ArrowLeft className="w-4 h-4" /> Voltar</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-col items-center text-center">
            <div className="w-32 h-44 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-stone-800">{livro.titulo}</h2>
            <p className="text-sm text-stone-500 mt-1">{livro.autor_nome}</p>
            {livro.categoria_nome && <Badge variant="info" className="mt-2">{livro.categoria_nome}</Badge>}
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Informações" />
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Autor</p>
                  <p className="text-sm font-medium text-stone-800">{livro.autor_nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Categoria</p>
                  <p className="text-sm font-medium text-stone-800">{livro.categoria_nome || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Ano de Publicação</p>
                  <p className="text-sm font-medium text-stone-800">{livro.ano_publicacao || '-'}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {livro.sinopse && (
            <Card>
              <CardHeader title="Sinopse" />
              <CardBody>
                <p className="text-sm text-stone-600 leading-relaxed">{livro.sinopse}</p>
              </CardBody>
            </Card>
          )}

          {livro.autor_biografia && (
            <Card>
              <CardHeader title="Sobre o Autor" />
              <CardBody>
                <p className="text-sm text-stone-600 leading-relaxed">{livro.autor_biografia}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
