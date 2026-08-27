import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Autor, Categoria } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Save } from 'lucide-react';

export function BookCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: autores } = useApi<Autor[]>(() => api.getAutores());
  const { data: categorias } = useApi<Categoria[]>(() => api.getCategorias());
  const [form, setForm] = useState({
    titulo: '', id_autor: '', id_categoria: '', ano_publicacao: '', sinopse: '', capa_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.titulo) errs.titulo = 'Título é obrigatório';
    if (!form.id_autor) errs.id_autor = 'Autor é obrigatório';
    if (form.ano_publicacao && (Number(form.ano_publicacao) < 0 || Number(form.ano_publicacao) > 2100)) {
      errs.ano_publicacao = 'Ano inválido';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createLivro({
        titulo: form.titulo,
        id_autor: Number(form.id_autor),
        id_categoria: form.id_categoria ? Number(form.id_categoria) : undefined,
        ano_publicacao: form.ano_publicacao ? Number(form.ano_publicacao) : undefined,
        sinopse: form.sinopse || undefined,
        capa_url: form.capa_url || undefined,
      });
      showToast('Livro cadastrado com sucesso!', 'success');
      navigate('/books');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao cadastrar livro', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in-slow">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Livros', to: '/books' }, { label: 'Cadastrar Livro' }]} />
      <PageHeader title={<>Cadastrar <span className="italic">Livro</span></>} subtitle="Adicione um novo livro ao catálogo" />

      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-7">
              <Input label="Título *" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} error={errors.titulo} placeholder="Ex: Dom Casmurro" />
              <Select label="Autor *" value={form.id_autor} onChange={(e) => setForm({ ...form, id_autor: e.target.value })} error={errors.id_autor}>
                <option value="">Selecione um autor</option>
                {autores?.map((a) => <option key={a.id_autor} value={a.id_autor}>{a.nome}</option>)}
              </Select>
              <Select label="Categoria" value={form.id_categoria} onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}>
                <option value="">Selecione uma categoria</option>
                {categorias?.map((c) => <option key={c.id_categoria} value={c.id_categoria}>{c.nome}</option>)}
              </Select>
              <Input label="Ano de Publicação" type="number" value={form.ano_publicacao} onChange={(e) => setForm({ ...form, ano_publicacao: e.target.value })} error={errors.ano_publicacao} placeholder="Ex: 1899" />
              <Textarea label="Sinopse" value={form.sinopse} onChange={(e) => setForm({ ...form, sinopse: e.target.value })} rows={4} placeholder="Resumo da obra..." />
              <Input label="URL da Capa" value={form.capa_url} onChange={(e) => setForm({ ...form, capa_url: e.target.value })} placeholder="https://..." />
              <div className="flex gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate('/books')}><ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Cancelar</Button>
                <Button type="submit" disabled={saving}><Save className="w-4 h-4" strokeWidth={1.5} /> {saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
