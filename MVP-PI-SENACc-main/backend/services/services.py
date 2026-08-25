"""
BookClub Hub - Services Layer
Contains business logic and database access for each entity.
All queries use parameterized SQL to prevent injection.
"""
from backend.database.connection import query_all, query_one, execute


# ============================================================
# Usuarios
# ============================================================
def list_usuarios():
    return query_all(
        "SELECT id_usuario, nome, email, criado_em FROM usuarios ORDER BY id_usuario"
    )


def get_usuario(usuario_id):
    return query_one(
        "SELECT id_usuario, nome, email, criado_em FROM usuarios WHERE id_usuario = %s",
        (usuario_id,),
    )


def create_usuario(nome, email, senha_hash):
    return execute(
        "INSERT INTO usuarios (nome, email, senha_hash) VALUES (%s, %s, %s) "
        "RETURNING id_usuario, nome, email, criado_em",
        (nome, email, senha_hash),
        fetch=True,
    )


# ============================================================
# Clubes
# ============================================================
def list_clubes():
    return query_all(
        """SELECT c.id_clube, c.nome, c.descricao, c.id_admin,
                  u.nome AS admin_nome, c.criado_em,
                  (SELECT COUNT(*) FROM membros m WHERE m.id_clube = c.id_clube) AS total_membros
           FROM clubes c
           JOIN usuarios u ON c.id_admin = u.id_usuario
           ORDER BY c.id_clube"""
    )


def get_clube(clube_id):
    return query_one(
        """SELECT c.id_clube, c.nome, c.descricao, c.id_admin,
                  u.nome AS admin_nome, c.criado_em
           FROM clubes c
           JOIN usuarios u ON c.id_admin = u.id_usuario
           WHERE c.id_clube = %s""",
        (clube_id,),
    )


def create_clube(nome, descricao, id_admin):
    return execute(
        "INSERT INTO clubes (nome, descricao, id_admin) VALUES (%s, %s, %s) "
        "RETURNING id_clube, nome, descricao, id_admin, criado_em",
        (nome, descricao, id_admin),
        fetch=True,
    )


def update_clube(clube_id, nome, descricao):
    return execute(
        "UPDATE clubes SET nome = %s, descricao = %s WHERE id_clube = %s "
        "RETURNING id_clube, nome, descricao, id_admin, criado_em",
        (nome, descricao, clube_id),
        fetch=True,
    )


def delete_clube(clube_id):
    execute("DELETE FROM clubes WHERE id_clube = %s", (clube_id,))
    return True


# ============================================================
# Membros
# ============================================================
def list_membros_by_clube(clube_id):
    return query_all(
        """SELECT m.id_membro, m.id_clube, m.id_usuario, m.papel, m.entrou_em,
                  u.nome AS usuario_nome, u.email AS usuario_email
           FROM membros m
           JOIN usuarios u ON m.id_usuario = u.id_usuario
           WHERE m.id_clube = %s
           ORDER BY m.id_membro""",
        (clube_id,),
    )


def add_membro(id_clube, id_usuario, papel):
    return execute(
        "INSERT INTO membros (id_clube, id_usuario, papel) VALUES (%s, %s, %s) "
        "RETURNING id_membro, id_clube, id_usuario, papel, entrou_em",
        (id_clube, id_usuario, papel),
        fetch=True,
    )


def remove_membro(membro_id):
    execute("DELETE FROM membros WHERE id_membro = %s", (membro_id,))
    return True


# ============================================================
# Autores
# ============================================================
def list_autores():
    return query_all(
        "SELECT a.id_autor, a.nome, a.biografia, "
        "(SELECT COUNT(*) FROM livros l WHERE l.id_autor = a.id_autor) AS total_livros "
        "FROM autores a ORDER BY a.id_autor"
    )


def get_autor(autor_id):
    return query_one(
        "SELECT id_autor, nome, biografia FROM autores WHERE id_autor = %s",
        (autor_id,),
    )


def create_autor(nome, biografia):
    return execute(
        "INSERT INTO autores (nome, biografia) VALUES (%s, %s) "
        "RETURNING id_autor, nome, biografia",
        (nome, biografia),
        fetch=True,
    )


def update_autor(autor_id, nome, biografia):
    return execute(
        "UPDATE autores SET nome = %s, biografia = %s WHERE id_autor = %s "
        "RETURNING id_autor, nome, biografia",
        (nome, biografia, autor_id),
        fetch=True,
    )


def delete_autor(autor_id):
    execute("DELETE FROM autores WHERE id_autor = %s", (autor_id,))
    return True


# ============================================================
# Categorias
# ============================================================
def list_categorias():
    return query_all(
        "SELECT id_categoria, nome FROM categorias ORDER BY id_categoria"
    )


def create_categoria(nome):
    return execute(
        "INSERT INTO categorias (nome) VALUES (%s) RETURNING id_categoria, nome",
        (nome,),
        fetch=True,
    )


# ============================================================
# Livros
# ============================================================
def list_livros(search=None, categoria=None):
    sql = """SELECT l.id_livro, l.titulo, l.id_autor, l.id_categoria,
                    l.ano_publicacao, l.sinopse, l.capa_url,
                    a.nome AS autor_nome, c.nome AS categoria_nome
             FROM livros l
             JOIN autores a ON l.id_autor = a.id_autor
             LEFT JOIN categorias c ON l.id_categoria = c.id_categoria"""
    params = []
    conditions = []
    if search:
        conditions.append("l.titulo ILIKE %s")
        params.append(f"%{search}%")
    if categoria:
        conditions.append("l.id_categoria = %s")
        params.append(categoria)
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY l.id_livro"
    return query_all(sql, tuple(params) if params else None)


def get_livro(livro_id):
    return query_one(
        """SELECT l.id_livro, l.titulo, l.id_autor, l.id_categoria,
                  l.ano_publicacao, l.sinopse, l.capa_url,
                  a.nome AS autor_nome, a.biografia AS autor_biografia,
                  c.nome AS categoria_nome
           FROM livros l
           JOIN autores a ON l.id_autor = a.id_autor
           LEFT JOIN categorias c ON l.id_categoria = c.id_categoria
           WHERE l.id_livro = %s""",
        (livro_id,),
    )


def create_livro(titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url):
    return execute(
        """INSERT INTO livros (titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url)
           VALUES (%s, %s, %s, %s, %s, %s)
           RETURNING id_livro, titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url""",
        (titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url),
        fetch=True,
    )


def update_livro(livro_id, titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url):
    return execute(
        """UPDATE livros SET titulo = %s, id_autor = %s, id_categoria = %s,
            ano_publicacao = %s, sinopse = %s, capa_url = %s
           WHERE id_livro = %s
           RETURNING id_livro, titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url""",
        (titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url, livro_id),
        fetch=True,
    )


def delete_livro(livro_id):
    execute("DELETE FROM livros WHERE id_livro = %s", (livro_id,))
    return True


# ============================================================
# Leituras
# ============================================================
def list_leituras(clube_id=None):
    sql = """SELECT l.id_leitura, l.id_clube, l.id_livro, l.data_inicio, l.data_fim, l.status,
                    c.nome AS clube_nome, li.titulo AS livro_titulo, li.capa_url AS livro_capa,
                    a.nome AS autor_nome
             FROM leituras l
             JOIN clubes c ON l.id_clube = c.id_clube
             JOIN livros li ON l.id_livro = li.id_livro
             JOIN autores a ON li.id_autor = a.id_autor"""
    if clube_id:
        sql += " WHERE l.id_clube = %s"
        return query_all(sql + " ORDER BY l.id_leitura DESC", (clube_id,))
    return query_all(sql + " ORDER BY l.id_leitura DESC")


def get_leitura(leitura_id):
    return query_one(
        """SELECT l.id_leitura, l.id_clube, l.id_livro, l.data_inicio, l.data_fim, l.status,
                  c.nome AS clube_nome, li.titulo AS livro_titulo, li.capa_url AS livro_capa,
                  a.nome AS autor_nome, li.sinopse AS livro_sinopse
           FROM leituras l
           JOIN clubes c ON l.id_clube = c.id_clube
           JOIN livros li ON l.id_livro = li.id_livro
           JOIN autores a ON li.id_autor = a.id_autor
           WHERE l.id_leitura = %s""",
        (leitura_id,),
    )


def create_leitura(id_clube, id_livro, data_inicio, data_fim, status):
    return execute(
        """INSERT INTO leituras (id_clube, id_livro, data_inicio, data_fim, status)
           VALUES (%s, %s, %s, %s, %s)
           RETURNING id_leitura, id_clube, id_livro, data_inicio, data_fim, status""",
        (id_clube, id_livro, data_inicio, data_fim, status),
        fetch=True,
    )


def update_leitura(leitura_id, data_inicio, data_fim, status):
    return execute(
        """UPDATE leituras SET data_inicio = %s, data_fim = %s, status = %s
           WHERE id_leitura = %s
           RETURNING id_leitura, id_clube, id_livro, data_inicio, data_fim, status""",
        (data_inicio, data_fim, status, leitura_id),
        fetch=True,
    )


# ============================================================
# Encontros
# ============================================================
def list_encontros(leitura_id=None):
    sql = """SELECT e.id_encontro, e.id_leitura, e.data_hora, e.local_link, e.descricao,
                    l.id_clube, c.nome AS clube_nome, li.titulo AS livro_titulo
             FROM encontros e
             JOIN leituras l ON e.id_leitura = l.id_leitura
             JOIN clubes c ON l.id_clube = c.id_clube
             JOIN livros li ON l.id_livro = li.id_livro"""
    if leitura_id:
        return query_all(
            sql + " WHERE e.id_leitura = %s ORDER BY e.data_hora DESC",
            (leitura_id,),
        )
    return query_all(sql + " ORDER BY e.data_hora DESC")


def get_encontro(encontro_id):
    return query_one(
        """SELECT e.id_encontro, e.id_leitura, e.data_hora, e.local_link, e.descricao,
                  l.id_clube, c.nome AS clube_nome, li.titulo AS livro_titulo
           FROM encontros e
           JOIN leituras l ON e.id_leitura = l.id_leitura
           JOIN clubes c ON l.id_clube = c.id_clube
           JOIN livros li ON l.id_livro = li.id_livro
           WHERE e.id_encontro = %s""",
        (encontro_id,),
    )


def create_encontro(id_leitura, data_hora, local_link, descricao):
    return execute(
        """INSERT INTO encontros (id_leitura, data_hora, local_link, descricao)
           VALUES (%s, %s, %s, %s)
           RETURNING id_encontro, id_leitura, data_hora, local_link, descricao""",
        (id_leitura, data_hora, local_link, descricao),
        fetch=True,
    )


def update_encontro(encontro_id, data_hora, local_link, descricao):
    return execute(
        """UPDATE encontros SET data_hora = %s, local_link = %s, descricao = %s
           WHERE id_encontro = %s
           RETURNING id_encontro, id_leitura, data_hora, local_link, descricao""",
        (data_hora, local_link, descricao, encontro_id),
        fetch=True,
    )


def delete_encontro(encontro_id):
    execute("DELETE FROM encontros WHERE id_encontro = %s", (encontro_id,))
    return True


# ============================================================
# Presencas
# ============================================================
def list_presencas(encontro_id=None):
    sql = """SELECT p.id_presenca, p.id_encontro, p.id_membro, p.confirmado, p.presente,
                    u.nome AS membro_nome
             FROM presencas p
             JOIN membros m ON p.id_membro = m.id_membro
             JOIN usuarios u ON m.id_usuario = u.id_usuario"""
    if encontro_id:
        return query_all(
            sql + " WHERE p.id_encontro = %s ORDER BY p.id_presenca",
            (encontro_id,),
        )
    return query_all(sql + " ORDER BY p.id_presenca")


def create_presenca(id_encontro, id_membro, confirmado, presente):
    return execute(
        """INSERT INTO presencas (id_encontro, id_membro, confirmado, presente)
           VALUES (%s, %s, %s, %s)
           RETURNING id_presenca, id_encontro, id_membro, confirmado, presente""",
        (id_encontro, id_membro, confirmado, presente),
        fetch=True,
    )


def update_presenca(presenca_id, confirmado, presente):
    return execute(
        """UPDATE presencas SET confirmado = %s, presente = %s
           WHERE id_presenca = %s
           RETURNING id_presenca, id_encontro, id_membro, confirmado, presente""",
        (confirmado, presente, presenca_id),
        fetch=True,
    )


# ============================================================
# Avaliacoes
# ============================================================
def list_avaliacoes(leitura_id=None):
    sql = """SELECT av.id_avaliacao, av.id_membro, av.id_leitura, av.nota, av.comentario, av.criado_em,
                    u.nome AS membro_nome, l.id_clube, c.nome AS clube_nome,
                    li.titulo AS livro_titulo
             FROM avaliacoes av
             JOIN membros m ON av.id_membro = m.id_membro
             JOIN usuarios u ON m.id_usuario = u.id_usuario
             JOIN leituras l ON av.id_leitura = l.id_leitura
             JOIN clubes c ON l.id_clube = c.id_clube
             JOIN livros li ON l.id_livro = li.id_livro"""
    if leitura_id:
        return query_all(
            sql + " WHERE av.id_leitura = %s ORDER BY av.criado_em DESC",
            (leitura_id,),
        )
    return query_all(sql + " ORDER BY av.criado_em DESC")


def create_avaliacao(id_membro, id_leitura, nota, comentario):
    return execute(
        """INSERT INTO avaliacoes (id_membro, id_leitura, nota, comentario)
           VALUES (%s, %s, %s, %s)
           RETURNING id_avaliacao, id_membro, id_leitura, nota, comentario, criado_em""",
        (id_membro, id_leitura, nota, comentario),
        fetch=True,
    )


# ============================================================
# Sugestoes
# ============================================================
def list_sugestoes(clube_id=None):
    sql = """SELECT s.id_sugestao, s.id_clube, s.id_membro, s.id_livro, s.titulo_sugerido, s.criado_em,
                   u.nome AS membro_nome, c.nome AS clube_nome,
                   l.titulo AS livro_titulo, l.capa_url AS livro_capa
            FROM sugestoes s
            JOIN membros m ON s.id_membro = m.id_membro
            JOIN usuarios u ON m.id_usuario = u.id_usuario
            JOIN clubes c ON s.id_clube = c.id_clube
            LEFT JOIN livros l ON s.id_livro = l.id_livro"""
    if clube_id:
        return query_all(
            sql + " WHERE s.id_clube = %s ORDER BY s.criado_em DESC",
            (clube_id,),
        )
    return query_all(sql + " ORDER BY s.criado_em DESC")


def create_sugestao(id_clube, id_membro, id_livro, titulo_sugerido):
    return execute(
        """INSERT INTO sugestoes (id_clube, id_membro, id_livro, titulo_sugerido)
           VALUES (%s, %s, %s, %s)
           RETURNING id_sugestao, id_clube, id_membro, id_livro, titulo_sugerido, criado_em""",
        (id_clube, id_membro, id_livro, titulo_sugerido),
        fetch=True,
    )


def delete_sugestao(sugestao_id):
    execute("DELETE FROM sugestoes WHERE id_sugestao = %s", (sugestao_id,))
    return True


# ============================================================
# Votacoes
# ============================================================
def list_votacoes(clube_id=None):
    sql = """SELECT v.id_votacao, v.id_clube, v.titulo, v.aberta, v.criado_em,
                   c.nome AS clube_nome,
                   (SELECT COUNT(*) FROM votacao_opcoes vo WHERE vo.id_votacao = v.id_votacao) AS total_opcoes
            FROM votacoes v
            JOIN clubes c ON v.id_clube = c.id_clube"""
    if clube_id:
        return query_all(
            sql + " WHERE v.id_clube = %s ORDER BY v.criado_em DESC",
            (clube_id,),
        )
    return query_all(sql + " ORDER BY v.criado_em DESC")


def get_votacao(votacao_id):
    return query_one(
        """SELECT v.id_votacao, v.id_clube, v.titulo, v.aberta, v.criado_em,
                  c.nome AS clube_nome
           FROM votacoes v
           JOIN clubes c ON v.id_clube = c.id_clube
           WHERE v.id_votacao = %s""",
        (votacao_id,),
    )


def create_votacao(id_clube, titulo, aberta):
    return execute(
        """INSERT INTO votacoes (id_clube, titulo, aberta)
           VALUES (%s, %s, %s)
           RETURNING id_votacao, id_clube, titulo, aberta, criado_em""",
        (id_clube, titulo, aberta),
        fetch=True,
    )


def update_votacao(votacao_id, titulo, aberta):
    return execute(
        """UPDATE votacoes SET titulo = %s, aberta = %s
           WHERE id_votacao = %s
           RETURNING id_votacao, id_clube, titulo, aberta, criado_em""",
        (titulo, aberta, votacao_id),
        fetch=True,
    )


def get_votacao_opcoes(votacao_id):
    return query_all(
        """SELECT vo.id_opcao, vo.id_votacao, vo.id_sugestao,
                  s.titulo_sugerido, l.titulo AS livro_titulo, l.capa_url AS livro_capa,
                  (SELECT COUNT(*) FROM votos vt WHERE vt.id_opcao = vo.id_opcao) AS total_votos
           FROM votacao_opcoes vo
           JOIN sugestoes s ON vo.id_sugestao = s.id_sugestao
           LEFT JOIN livros l ON s.id_livro = l.id_livro
           WHERE vo.id_votacao = %s
           ORDER BY vo.id_opcao""",
        (votacao_id,),
    )


def add_votacao_opcao(id_votacao, id_sugestao):
    return execute(
        """INSERT INTO votacao_opcoes (id_votacao, id_sugestao)
           VALUES (%s, %s)
           RETURNING id_opcao, id_votacao, id_sugestao""",
        (id_votacao, id_sugestao),
        fetch=True,
    )


# ============================================================
# Votos
# ============================================================
def list_votos(opcao_id=None):
    sql = """SELECT vt.id_voto, vt.id_opcao, vt.id_membro, vt.criado_em,
                    u.nome AS membro_nome
             FROM votos vt
             JOIN membros m ON vt.id_membro = m.id_membro
             JOIN usuarios u ON m.id_usuario = u.id_usuario"""
    if opcao_id:
        return query_all(
            sql + " WHERE vt.id_opcao = %s ORDER BY vt.criado_em DESC",
            (opcao_id,),
        )
    return query_all(sql + " ORDER BY vt.criado_em DESC")


def create_voto(id_opcao, id_membro):
    return execute(
        """INSERT INTO votos (id_opcao, id_membro)
           VALUES (%s, %s)
           RETURNING id_voto, id_opcao, id_membro, criado_em""",
        (id_opcao, id_membro),
        fetch=True,
    )


# ============================================================
# Dashboard
# ============================================================
def get_dashboard_stats():
    stats = {}
    stats["total_clubes"] = query_one("SELECT COUNT(*) AS cnt FROM clubes")["cnt"]
    stats["total_livros"] = query_one("SELECT COUNT(*) AS cnt FROM livros")["cnt"]
    stats["total_usuarios"] = query_one("SELECT COUNT(*) AS cnt FROM usuarios")["cnt"]
    stats["total_leituras"] = query_one("SELECT COUNT(*) AS cnt FROM leituras")["cnt"]
    stats["total_encontros"] = query_one("SELECT COUNT(*) AS cnt FROM encontros")["cnt"]
    stats["votacoes_abertas"] = query_one(
        "SELECT COUNT(*) AS cnt FROM votacoes WHERE aberta = TRUE"
    )["cnt"]
    return stats


def get_leitura_atual():
    return query_all(
        """SELECT l.id_leitura, l.id_clube, c.nome AS clube_nome,
                  li.titulo AS livro_titulo, li.capa_url AS livro_capa,
                  a.nome AS autor_nome, l.data_inicio, l.status
           FROM leituras l
           JOIN clubes c ON l.id_clube = c.id_clube
           JOIN livros li ON l.id_livro = li.id_livro
           JOIN autores a ON li.id_autor = a.id_autor
           WHERE l.status = 'em_andamento'
           ORDER BY l.data_inicio DESC
           LIMIT 5"""
    )


def get_proximos_encontros():
    return query_all(
        """SELECT e.id_encontro, e.data_hora, e.local_link, e.descricao,
                  c.nome AS clube_nome, li.titulo AS livro_titulo
           FROM encontros e
           JOIN leituras l ON e.id_leitura = l.id_leitura
           JOIN clubes c ON l.id_clube = c.id_clube
           JOIN livros li ON l.id_livro = li.id_livro
           WHERE e.data_hora >= CURRENT_TIMESTAMP
           ORDER BY e.data_hora ASC
           LIMIT 5"""
    )


def get_avaliacoes_recentes():
    return query_all(
        """SELECT av.id_avaliacao, av.nota, av.comentario, av.criado_em,
                  u.nome AS membro_nome, li.titulo AS livro_titulo
           FROM avaliacoes av
           JOIN membros m ON av.id_membro = m.id_membro
           JOIN usuarios u ON m.id_usuario = u.id_usuario
           JOIN leituras l ON av.id_leitura = l.id_leitura
           JOIN livros li ON l.id_livro = li.id_livro
           ORDER BY av.criado_em DESC
           LIMIT 5"""
    )


def get_sugestoes_recentes():
    return query_all(
        """SELECT s.id_sugestao, s.titulo_sugerido, s.criado_em,
                  u.nome AS membro_nome, c.nome AS clube_nome,
                  l.titulo AS livro_titulo
           FROM sugestoes s
           JOIN membros m ON s.id_membro = m.id_membro
           JOIN usuarios u ON m.id_usuario = u.id_usuario
           JOIN clubes c ON s.id_clube = c.id_clube
           LEFT JOIN livros l ON s.id_livro = l.id_livro
           ORDER BY s.criado_em DESC
           LIMIT 5"""
    )
