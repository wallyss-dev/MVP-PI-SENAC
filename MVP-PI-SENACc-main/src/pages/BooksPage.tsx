import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Livro, Categoria } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner, EmptyState, Search } from '@/components/ui/Common';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { BookOpen, Plus, Eye } from 'lucide-react';

export function BooksPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: livros, loading } = useApi<Livro[]>(() => api.getLivros(search));
  const { data: categorias } = useApi<Categoria[]>(() => api.getCategorias());

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Livros' }]} />
      <PageHeader
        title="Livros"
        subtitle="Catálogo de livros cadastrados"
        action={<Button onClick={() => navigate('/books/new')}><Plus className="w-4 h-4" /> Cadastrar Livro</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Search value={search} onChange={setSearch} placeholder="Buscar por título..." />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !livros || livros.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="Nenhum livro cadastrado"
            message="Cadastre o primeiro livro no catálogo"
            action={<Button onClick={() => navigate('/books/new')}><Plus className="w-4 h-4" /> Cadastrar Livro</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {livros.map((livro) => (
            <Card key={livro.id_livro} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-16 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-stone-800 text-sm line-clamp-2">{livro.titulo}</h3>
                    <p className="text-xs text-stone-500 mt-1">{livro.autor_nome}</p>
                    <p className="text-xs text-stone-400">{livro.ano_publicacao}</p>
                  </div>
                </div>
                {livro.categoria_nome && <Badge variant="info" className="mb-3">{livro.categoria_nome}</Badge>}
                <p className="text-xs text-stone-500 line-clamp-2 mb-3">{livro.sinopse || 'Sem sinopse'}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/books/${livro.id_livro}`)}>
                  <Eye className="w-3.5 h-3.5" /> Ver Detalhes
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
