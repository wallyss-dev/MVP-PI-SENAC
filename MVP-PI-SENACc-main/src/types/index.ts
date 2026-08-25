export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  criado_em?: string;
}

export interface Clube {
  id_clube: number;
  nome: string;
  descricao: string;
  id_admin: number;
  admin_nome?: string;
  criado_em?: string;
  total_membros?: number;
}

export interface Membro {
  id_membro: number;
  id_clube: number;
  id_usuario: number;
  papel: string;
  entrou_em?: string;
  usuario_nome?: string;
  usuario_email?: string;
}

export interface Autor {
  id_autor: number;
  nome: string;
  biografia?: string;
  total_livros?: number;
}

export interface Categoria {
  id_categoria: number;
  nome: string;
}

export interface Livro {
  id_livro: number;
  titulo: string;
  id_autor: number;
  id_categoria?: number;
  ano_publicacao?: number;
  sinopse?: string;
  capa_url?: string;
  autor_nome?: string;
  autor_biografia?: string;
  categoria_nome?: string;
}

export interface Leitura {
  id_leitura: number;
  id_clube: number;
  id_livro: number;
  data_inicio?: string;
  data_fim?: string;
  status: string;
  clube_nome?: string;
  livro_titulo?: string;
  livro_capa?: string;
  livro_sinopse?: string;
  autor_nome?: string;
}

export interface Encontro {
  id_encontro: number;
  id_leitura: number;
  data_hora: string;
  local_link?: string;
  descricao?: string;
  clube_nome?: string;
  livro_titulo?: string;
  id_clube?: number;
}

export interface Presenca {
  id_presenca: number;
  id_encontro: number;
  id_membro: number;
  confirmado: boolean;
  presente: boolean;
  membro_nome?: string;
}

export interface Avaliacao {
  id_avaliacao: number;
  id_membro: number;
  id_leitura: number;
  nota: number;
  comentario?: string;
  criado_em?: string;
  membro_nome?: string;
  clube_nome?: string;
  livro_titulo?: string;
  id_clube?: number;
}

export interface Sugestao {
  id_sugestao: number;
  id_clube: number;
  id_membro: number;
  id_livro?: number;
  titulo_sugerido?: string;
  criado_em?: string;
  membro_nome?: string;
  clube_nome?: string;
  livro_titulo?: string;
  livro_capa?: string;
}

export interface Votacao {
  id_votacao: number;
  id_clube: number;
  titulo: string;
  aberta: boolean;
  criado_em?: string;
  clube_nome?: string;
  total_opcoes?: number;
  opcoes?: VotacaoOpcao[];
}

export interface VotacaoOpcao {
  id_opcao: number;
  id_votacao: number;
  id_sugestao: number;
  titulo_sugerido?: string;
  livro_titulo?: string;
  livro_capa?: string;
  total_votos?: number;
}

export interface Voto {
  id_voto: number;
  id_opcao: number;
  id_membro: number;
  criado_em?: string;
  membro_nome?: string;
}

export interface DashboardData {
  stats: {
    total_clubes: number;
    total_livros: number;
    total_usuarios: number;
    total_leituras: number;
    total_encontros: number;
    votacoes_abertas: number;
  };
  leitura_atual: Leitura[];
  proximos_encontros: Encontro[];
  avaliacoes_recentes: Avaliacao[];
  sugestoes_recentes: Sugestao[];
}
