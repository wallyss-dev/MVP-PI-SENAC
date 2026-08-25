import type {
  DashboardData, Clube, Membro, Autor, Categoria, Livro,
  Leitura, Encontro, Presenca, Avaliacao, Sugestao, Votacao,
  VotacaoOpcao, Voto, Usuario
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Dashboard
  getDashboard: () => request<DashboardData>('/dashboard'),

  // Clubes
  getClubes: () => request<Clube[]>('/clubs'),
  getClube: (id: number) => request<Clube>(`/clubs/${id}`),
  createClube: (data: Partial<Clube>) => request<Clube>('/clubs', { method: 'POST', body: JSON.stringify(data) }),
  updateClube: (id: number, data: Partial<Clube>) => request<Clube>(`/clubs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClube: (id: number) => request<{ message: string }>(`/clubs/${id}`, { method: 'DELETE' }),

  // Membros
  getMembros: (clubeId: number) => request<Membro[]>(`/clubs/${clubeId}/membros`),
  addMembro: (clubeId: number, data: Partial<Membro>) => request<Membro>(`/clubs/${clubeId}/membros`, { method: 'POST', body: JSON.stringify(data) }),
  removeMembro: (membroId: number) => request<{ message: string }>(`/membros/${membroId}`, { method: 'DELETE' }),

  // Autores
  getAutores: () => request<Autor[]>('/autores'),
  getAutor: (id: number) => request<Autor>(`/autores/${id}`),
  createAutor: (data: Partial<Autor>) => request<Autor>('/autores', { method: 'POST', body: JSON.stringify(data) }),
  updateAutor: (id: number, data: Partial<Autor>) => request<Autor>(`/autores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAutor: (id: number) => request<{ message: string }>(`/autores/${id}`, { method: 'DELETE' }),

  // Categorias
  getCategorias: () => request<Categoria[]>('/categorias'),
  createCategoria: (data: Partial<Categoria>) => request<Categoria>('/categorias', { method: 'POST', body: JSON.stringify(data) }),

  // Livros
  getLivros: (search?: string, categoria?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoria) params.append('categoria', categoria);
    const qs = params.toString();
    return request<Livro[]>(`/books${qs ? `?${qs}` : ''}`);
  },
  getLivro: (id: number) => request<Livro>(`/books/${id}`),
  createLivro: (data: Partial<Livro>) => request<Livro>('/books', { method: 'POST', body: JSON.stringify(data) }),
  updateLivro: (id: number, data: Partial<Livro>) => request<Livro>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLivro: (id: number) => request<{ message: string }>(`/books/${id}`, { method: 'DELETE' }),

  // Leituras
  getLeituras: (clubeId?: number) => {
    const qs = clubeId ? `?clube_id=${clubeId}` : '';
    return request<Leitura[]>(`/readings${qs}`);
  },
  getLeitura: (id: number) => request<Leitura>(`/readings/${id}`),
  createLeitura: (data: Partial<Leitura>) => request<Leitura>('/readings', { method: 'POST', body: JSON.stringify(data) }),
  updateLeitura: (id: number, data: Partial<Leitura>) => request<Leitura>(`/readings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Encontros
  getEncontros: (leituraId?: number) => {
    const qs = leituraId ? `?leitura_id=${leituraId}` : '';
    return request<Encontro[]>(`/meetings${qs}`);
  },
  getEncontro: (id: number) => request<Encontro>(`/meetings/${id}`),
  createEncontro: (data: Partial<Encontro>) => request<Encontro>('/meetings', { method: 'POST', body: JSON.stringify(data) }),
  updateEncontro: (id: number, data: Partial<Encontro>) => request<Encontro>(`/meetings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEncontro: (id: number) => request<{ message: string }>(`/meetings/${id}`, { method: 'DELETE' }),

  // Presencas
  getPresencas: (encontroId?: number) => {
    const qs = encontroId ? `?encontro_id=${encontroId}` : '';
    return request<Presenca[]>(`/presencas${qs}`);
  },
  createPresenca: (data: Partial<Presenca>) => request<Presenca>('/presencas', { method: 'POST', body: JSON.stringify(data) }),
  updatePresenca: (id: number, data: Partial<Presenca>) => request<Presenca>(`/presencas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Avaliacoes
  getAvaliacoes: (leituraId?: number) => {
    const qs = leituraId ? `?leitura_id=${leituraId}` : '';
    return request<Avaliacao[]>(`/reviews${qs}`);
  },
  createAvaliacao: (data: Partial<Avaliacao>) => request<Avaliacao>('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Sugestoes
  getSugestoes: (clubeId?: number) => {
    const qs = clubeId ? `?clube_id=${clubeId}` : '';
    return request<Sugestao[]>(`/suggestions${qs}`);
  },
  createSugestao: (data: Partial<Sugestao>) => request<Sugestao>('/suggestions', { method: 'POST', body: JSON.stringify(data) }),
  deleteSugestao: (id: number) => request<{ message: string }>(`/suggestions/${id}`, { method: 'DELETE' }),

  // Votacoes
  getVotacoes: (clubeId?: number) => {
    const qs = clubeId ? `?clube_id=${clubeId}` : '';
    return request<Votacao[]>(`/votes${qs}`);
  },
  getVotacao: (id: number) => request<Votacao>(`/votes/${id}`),
  createVotacao: (data: Partial<Votacao>) => request<Votacao>('/votes', { method: 'POST', body: JSON.stringify(data) }),
  updateVotacao: (id: number, data: Partial<Votacao>) => request<Votacao>(`/votes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addVotacaoOpcao: (votacaoId: number, sugestaoId: number) => request<VotacaoOpcao>(`/votes/${votacaoId}/opcoes`, { method: 'POST', body: JSON.stringify({ id_sugestao: sugestaoId }) }),
  castVote: (opcaoId: number, membroId: number) => request<Voto>('/votes/cast', { method: 'POST', body: JSON.stringify({ id_opcao: opcaoId, id_membro: membroId }) }),

  // Usuarios
  getUsuarios: () => request<Usuario[]>('/usuarios'),
  createUsuario: (data: Partial<Usuario>) => request<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
};
