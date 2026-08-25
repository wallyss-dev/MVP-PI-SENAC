import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { Usuario } from '@/types';
import { useApi } from '@/hooks/useApi';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Breadcrumb, PageHeader } from '@/components/ui/Breadcrumb';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Save } from 'lucide-react';

export function ClubCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: usuarios } = useApi<Usuario[]>(() => api.getUsuarios());
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [errors, setErrors] = useState<{ nome?: string; idAdmin?: string }>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!nome) errs.nome = 'Nome é obrigatório';
    if (!idAdmin) errs.idAdmin = 'Administrador é obrigatório';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await api.createClube({ nome, descricao, id_admin: Number(idAdmin) });
      showToast('Clube criado com sucesso!', 'success');
      navigate('/clubs');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao criar clube', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Clubes', to: '/clubs' }, { label: 'Novo Clube' }]} />
      <PageHeader title="Criar Clube" subtitle="Cadastre um novo clube de leitura" />

      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nome do Clube *" value={nome} onChange={(e) => setNome(e.target.value)} error={errors.nome} placeholder="Ex: Clube Literário Aurora" />
              <Textarea label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Descreva o propósito do clube..." />
              <Select label="Administrador *" value={idAdmin} onChange={(e) => setIdAdmin(e.target.value)} error={errors.idAdmin}>
                <option value="">Selecione um usuário</option>
                {usuarios?.map((u) => (
                  <option key={u.id_usuario} value={u.id_usuario}>{u.nome} ({u.email})</option>
                ))}
              </Select>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/clubs')}><ArrowLeft className="w-4 h-4" /> Cancelar</Button>
                <Button type="submit" disabled={saving}><Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
