-- ============================================================
-- BookClub Hub - Database Schema
-- PostgreSQL Schema - 14 Entities
-- ============================================================
-- This script creates the complete database schema for the
-- BookClub Hub application. Run this against a fresh PostgreSQL
-- database before running seed.sql.
-- ============================================================

-- ============================================================
-- 1. usuarios
-- ============================================================
CREATE TABLE usuarios (
    id_usuario  SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    senha_hash  VARCHAR(255) NOT NULL,
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);

-- ============================================================
-- 2. clubes
-- ============================================================
CREATE TABLE clubes (
    id_clube   SERIAL PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    descricao  TEXT,
    id_admin   INT NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_clubes_admin FOREIGN KEY (id_admin)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE
);

-- ============================================================
-- 3. membros
-- ============================================================
CREATE TABLE membros (
    id_membro   SERIAL PRIMARY KEY,
    id_clube    INT NOT NULL,
    id_usuario  INT NOT NULL,
    papel       VARCHAR(20) NOT NULL,
    entrou_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_membros_clube FOREIGN KEY (id_clube)
        REFERENCES clubes(id_clube) ON DELETE CASCADE,
    CONSTRAINT fk_membros_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE,
    CONSTRAINT uk_membro_clube UNIQUE (id_clube, id_usuario)
);

-- ============================================================
-- 4. autores
-- ============================================================
CREATE TABLE autores (
    id_autor   SERIAL PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    biografia  TEXT
);

-- ============================================================
-- 5. categorias
-- ============================================================
CREATE TABLE categorias (
    id_categoria  SERIAL PRIMARY KEY,
    nome          VARCHAR(80) NOT NULL
);

-- ============================================================
-- 6. livros
-- ============================================================
CREATE TABLE livros (
    id_livro        SERIAL PRIMARY KEY,
    titulo          VARCHAR(200) NOT NULL,
    id_autor        INT NOT NULL,
    id_categoria    INT,
    ano_publicacao  INT,
    sinopse         TEXT,
    capa_url        VARCHAR(255),
    CONSTRAINT fk_livros_autor FOREIGN KEY (id_autor)
        REFERENCES autores(id_autor) ON UPDATE CASCADE,
    CONSTRAINT fk_livros_categoria FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria) ON UPDATE CASCADE
);

-- ============================================================
-- 7. leituras
-- ============================================================
CREATE TABLE leituras (
    id_leitura   SERIAL PRIMARY KEY,
    id_clube     INT NOT NULL,
    id_livro     INT NOT NULL,
    data_inicio  DATE,
    data_fim     DATE,
    status       VARCHAR(20) NOT NULL,
    CONSTRAINT fk_leituras_clube FOREIGN KEY (id_clube)
        REFERENCES clubes(id_clube) ON DELETE CASCADE,
    CONSTRAINT fk_leituras_livro FOREIGN KEY (id_livro)
        REFERENCES livros(id_livro) ON UPDATE CASCADE
);

-- ============================================================
-- 8. encontros
-- ============================================================
CREATE TABLE encontros (
    id_encontro  SERIAL PRIMARY KEY,
    id_leitura   INT NOT NULL,
    data_hora    TIMESTAMP NOT NULL,
    local_link   VARCHAR(255),
    descricao    TEXT,
    CONSTRAINT fk_encontros_leitura FOREIGN KEY (id_leitura)
        REFERENCES leituras(id_leitura) ON DELETE CASCADE
);

-- ============================================================
-- 9. presencas
-- ============================================================
CREATE TABLE presencas (
    id_presenca  SERIAL PRIMARY KEY,
    id_encontro  INT NOT NULL,
    id_membro    INT NOT NULL,
    confirmado   BOOLEAN DEFAULT FALSE,
    presente      BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_presencas_encontro FOREIGN KEY (id_encontro)
        REFERENCES encontros(id_encontro) ON DELETE CASCADE,
    CONSTRAINT fk_presencas_membro FOREIGN KEY (id_membro)
        REFERENCES membros(id_membro) ON DELETE CASCADE,
    CONSTRAINT uk_presenca_encontro_membro UNIQUE (id_encontro, id_membro)
);

-- ============================================================
-- 10. avaliacoes
-- ============================================================
CREATE TABLE avaliacoes (
    id_avaliacao  SERIAL PRIMARY KEY,
    id_membro     INT NOT NULL,
    id_leitura    INT NOT NULL,
    nota          SMALLINT NOT NULL,
    comentario    TEXT,
    criado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_avaliacoes_membro FOREIGN KEY (id_membro)
        REFERENCES membros(id_membro) ON DELETE CASCADE,
    CONSTRAINT fk_avaliacoes_leitura FOREIGN KEY (id_leitura)
        REFERENCES leituras(id_leitura) ON DELETE CASCADE,
    CONSTRAINT ck_avaliacao_nota CHECK (nota >= 1 AND nota <= 5),
    CONSTRAINT uk_avaliacao_membro_leitura UNIQUE (id_membro, id_leitura)
);

-- ============================================================
-- 11. sugestoes
-- ============================================================
CREATE TABLE sugestoes (
    id_sugestao       SERIAL PRIMARY KEY,
    id_clube          INT NOT NULL,
    id_membro         INT NOT NULL,
    id_livro          INT,
    titulo_sugerido   VARCHAR(200),
    criado_em         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sugestoes_clube FOREIGN KEY (id_clube)
        REFERENCES clubes(id_clube) ON DELETE CASCADE,
    CONSTRAINT fk_sugestoes_membro FOREIGN KEY (id_membro)
        REFERENCES membros(id_membro) ON DELETE CASCADE,
    CONSTRAINT fk_sugestoes_livro FOREIGN KEY (id_livro)
        REFERENCES livros(id_livro) ON UPDATE CASCADE,
    CONSTRAINT ck_sugestao_titulo CHECK (
        id_livro IS NOT NULL OR titulo_sugerido IS NOT NULL
    )
);

-- ============================================================
-- 12. votacoes
-- ============================================================
CREATE TABLE votacoes (
    id_votacao  SERIAL PRIMARY KEY,
    id_clube    INT NOT NULL,
    titulo      VARCHAR(150) NOT NULL,
    aberta      BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_votacoes_clube FOREIGN KEY (id_clube)
        REFERENCES clubes(id_clube) ON DELETE CASCADE
);

-- ============================================================
-- 13. votacao_opcoes
-- ============================================================
CREATE TABLE votacao_opcoes (
    id_opcao     SERIAL PRIMARY KEY,
    id_votacao   INT NOT NULL,
    id_sugestao  INT NOT NULL,
    CONSTRAINT fk_opcoes_votacao FOREIGN KEY (id_votacao)
        REFERENCES votacoes(id_votacao) ON DELETE CASCADE,
    CONSTRAINT fk_opcoes_sugestao FOREIGN KEY (id_sugestao)
        REFERENCES sugestoes(id_sugestao) ON DELETE CASCADE
);

-- ============================================================
-- 14. votos
-- ============================================================
CREATE TABLE votos (
    id_voto    SERIAL PRIMARY KEY,
    id_opcao   INT NOT NULL,
    id_membro   INT NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_votos_opcao FOREIGN KEY (id_opcao)
        REFERENCES votacao_opcoes(id_opcao) ON DELETE CASCADE,
    CONSTRAINT fk_votos_membro FOREIGN KEY (id_membro)
        REFERENCES membros(id_membro) ON DELETE CASCADE,
    CONSTRAINT uk_voto_opcao_membro UNIQUE (id_opcao, id_membro)
);

-- ============================================================
-- Trigger: prevent a member from voting twice in the same votacao
-- (even on different options of the same votacao)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_prevent_duplicate_vote()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM votos v
        JOIN votacao_opcoes vo ON v.id_opcao = vo.id_opcao
        WHERE vo.id_votacao = (
            SELECT id_votacao FROM votacao_opcoes WHERE id_opcao = NEW.id_opcao
        )
        AND v.id_membro = NEW.id_membro
    ) THEN
        RAISE EXCEPTION 'Member % has already voted in this votacao', NEW.id_membro;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_duplicate_vote
    BEFORE INSERT ON votos
    FOR EACH ROW
    EXECUTE FUNCTION fn_prevent_duplicate_vote();

-- ============================================================
-- Indexes for performance on foreign keys
-- ============================================================
CREATE INDEX idx_clubes_admin             ON clubes(id_admin);
CREATE INDEX idx_membros_clube            ON membros(id_clube);
CREATE INDEX idx_membros_usuario          ON membros(id_usuario);
CREATE INDEX idx_livros_autor             ON livros(id_autor);
CREATE INDEX idx_livros_categoria         ON livros(id_categoria);
CREATE INDEX idx_leituras_clube           ON leituras(id_clube);
CREATE INDEX idx_leituras_livro            ON leituras(id_livro);
CREATE INDEX idx_encontros_leitura        ON encontros(id_leitura);
CREATE INDEX idx_presencas_encontro       ON presencas(id_encontro);
CREATE INDEX idx_presencas_membro         ON presencas(id_membro);
CREATE INDEX idx_avaliacoes_membro        ON avaliacoes(id_membro);
CREATE INDEX idx_avaliacoes_leitura       ON avaliacoes(id_leitura);
CREATE INDEX idx_sugestoes_clube          ON sugestoes(id_clube);
CREATE INDEX idx_sugestoes_membro         ON sugestoes(id_membro);
CREATE INDEX idx_sugestoes_livro          ON sugestoes(id_livro);
CREATE INDEX idx_votacoes_clube           ON votacoes(id_clube);
CREATE INDEX idx_votacao_opcoes_votacao   ON votacao_opcoes(id_votacao);
CREATE INDEX idx_votacao_opcoes_sugestao  ON votacao_opcoes(id_sugestao);
CREATE INDEX idx_votos_opcao              ON votos(id_opcao);
CREATE INDEX idx_votos_membro             ON votos(id_membro);
