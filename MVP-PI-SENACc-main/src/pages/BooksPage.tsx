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
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Livros' }]} />
      <PageHeader
        title={<>Catálogo de <span className="italic">Livros</span></>}
        subtitle="Obras cadastradas no acervo"
        action={<Button onClick={() => navigate('/books/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Cadastrar Livro</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-16">
        <Search value={search} onChange={setSearch} placeholder="Buscar por título..." />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : !livros || livros.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen className="w-10 h-10" strokeWidth={1} />}
            title="Nenhum livro cadastrado"
            message="Cadastre o primeiro livro no catálogo"
            action={<Button onClick={() => navigate('/books/new')}><Plus className="w-4 h-4" strokeWidth={1.5} /> Cadastrar Livro</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {livros.map((livro) => (
            <Card key={livro.id_livro} className="group hover:border-ink-200/80">
              <CardBody>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-16 rounded border border-ink-100/60 bg-cream-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-accent-500" strokeWidth={1.25} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-medium text-ink-900 line-clamp-2 group-hover:text-accent-700 transition-colors duration-300">{livro.titulo}</h3>
                    <p className="text-xs text-ink-400 mt-2">{livro.autor_nome}</p>
                    <p className="text-xs text-ink-300 mt-0.5">{livro.ano_publicacao}</p>
                  </div>
                </div>
                {livro.categoria_nome && <Badge variant="info" className="mb-5">{livro.categoria_nome}</Badge>}
                <p className="text-xs text-ink-400 line-clamp-2 mb-6 leading-relaxed">{livro.sinopse || 'Sem sinopse'}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/books/${livro.id_livro}`)}>
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> Ver Detalhes
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
