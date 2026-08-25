-- ============================================================
-- BookClub Hub - Seed Data
-- Run AFTER schema.sql
-- ============================================================
-- All passwords are bcrypt hashes of "password123"
-- (generated for development/testing only)
-- ============================================================

-- ============================================================
-- 1. usuarios
-- ============================================================
INSERT INTO usuarios (nome, email, senha_hash) VALUES
('Ana Silva', 'ana.silva@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Bruno Costa', 'bruno.costa@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Carla Mendes', 'carla.mendes@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Diego Ferreira', 'diego.ferreira@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Eduarda Lima', 'eduarda.lima@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Felipe Santos', 'felipe.santos@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Gabriela Rocha', 'gabriela.rocha@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z'),
('Henrique Alves', 'henrique.alves@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD0xV8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z');

-- ============================================================
-- 2. clubes
-- ============================================================
INSERT INTO clubes (nome, descricao, id_admin) VALUES
('Clube Literário Aurora', 'Clube dedicado à leitura de clássicos e contemporâneos brasileiros.', 1),
('Leitores da Noite', 'Encontros mensais para discutir livros de mistério e suspense.', 2),
('Páginas Infinitas', 'Foco em literatura fantástica, ficção científica e distopias.', 3);

-- ============================================================
-- 3. membros
-- ============================================================
INSERT INTO membros (id_clube, id_usuario, papel) VALUES
(1, 1, 'admin'),
(1, 2, 'membro'),
(1, 3, 'membro'),
(1, 4, 'membro'),
(2, 2, 'admin'),
(2, 5, 'membro'),
(2, 6, 'membro'),
(3, 3, 'admin'),
(3, 7, 'membro'),
(3, 8, 'membro'),
(3, 1, 'membro');

-- ============================================================
-- 4. autores
-- ============================================================
INSERT INTO autores (nome, biografia) VALUES
('Machado de Assis', 'Considerado o maior escritor da literatura brasileira, autor de obras imortais como Dom Casmurro e Memórias Póstumas de Brás Cubas.'),
('Clarice Lispector', 'Escritora ucraniano-brasileira, uma das mais importantes figuras da literatura nacional, conhecada por sua prosa introspectiva.'),
('Gabriel García Márquez', 'Jornalista e escritor colombiano, Nobel de Literatura, autor de Cem Anos de Solidão.'),
('George Orwell', 'Escritor britânico, autor de 1984 e A Revolução dos Bichos, obras fundamentais sobre totalitarismo.'),
('J.R.R. Tolkien', 'Escritor, filólogo e professor britânico, autor de O Senhor dos Anéis e O Hobbit.'),
('Agatha Christie', 'Escritora britânica de romances policiais, criadora de Hercule Poirot e Miss Marple.'),
('Yuval Noah Harari', 'Historiador israelense, autor de Sapiens e Homo Deus, obras de grande impacto sobre a história da humanidade.'),
('Terry Pratchett', 'Escritor britânico de fantasia humorística, criador do universo do Discworld (Mundo Disco).');

-- ============================================================
-- 5. categorias
-- ============================================================
INSERT INTO categorias (nome) VALUES
('Romance'),
('Clássico'),
('Mistério'),
('Ficção Científica'),
('Fantasia'),
('Distopia'),
('Não-Ficção'),
('Aventura'),
('Drama'),
('Policial');

-- ============================================================
-- 6. livros
-- ============================================================
INSERT INTO livros (titulo, id_autor, id_categoria, ano_publicacao, sinopse, capa_url) VALUES
('Dom Casmurro', 1, 2, 1899, 'Um dos maiores clássicos da literatura brasileira, narra a história de Bentinho e suas dúvidas sobre a fidelidade de Capitu.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('Memórias Póstumas de Brás Cubas', 1, 2, 1881, 'Brás Cubas, um homem defunto, narra sua vida com ironia e humor, revolucionando a literatura brasileira.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('A Hora da Estrela', 2, 9, 1977, 'A história de Macabéa, uma datilógrafa nordestina no Rio de Janeiro, narrada por Rodrigo S.M. com profunda reflexão existencial.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1507389757i/882930.jpg'),
('Cem Anos de Solidão', 3, 1, 1967, 'A saga da família Buendía na cidade fictícia de Macondo, uma obra-prima do realismo mágico.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('1984', 4, 6, 1949, 'Em um futuro totalitário, Winston Smith luta contra o Grande Irmão e o controle absoluto do Estado.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('A Revolução dos Bichos', 4, 6, 1945, 'Uma fábula satírica sobre o totalitarismo, onde animais tomam o controle de uma fazenda.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('O Senhor dos Anéis', 5, 5, 1954, 'A épica jornada de Frodo e a Sociedade do Anel para destruir o Um Anel e derrotar Sauron.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('O Hobbit', 5, 5, 1937, 'Bilbo Bolseiro embarca em uma aventura com treze anões para recuperar o tesouro guardado pelo dragão Smaug.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('Assassinato no Expresso Oriente', 6, 3, 1934, 'Hercule Poirot investiga um assassinato a bordo do famoso trem Expresso Oriente, preso na neve.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('Morte no Nilo', 6, 10, 1937, 'Durante um cruzeiro pelo Nilo, um assassinato ocorre e Poirot precisa descobrir o culpado entre os passageiros.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('Sapiens: Uma Breve História da Humanidade', 7, 7, 2011, 'Uma exploração abrangente da história da humanidade, desde os primeiros humanos até a era moderna.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('Homo Deus: Uma Breve História do Amanhã', 7, 7, 2015, 'Harari explora o futuro da humanidade, onde biotecnologia e inteligência artificial podem redefinir o que significa ser humano.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('A Cor da Magia', 8, 5, 1983, 'O primeiro livro do Discworld, seguindo as desventuras do mago incompetente Rincewind e do turista Twoflower.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg'),
('Mort', 8, 5, 1987, 'Mort é escolhido como aprendiz da Morte e descobre que o trabalho não é tão simples quanto parece.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328324655i/882930.jpg');

-- ============================================================
-- 7. leituras
-- ============================================================
INSERT INTO leituras (id_clube, id_livro, data_inicio, data_fim, status) VALUES
(1, 1, '2026-08-01', '2026-08-31', 'em_andamento'),
(1, 3, '2026-07-01', '2026-07-31', 'concluida'),
(2, 9, '2026-08-10', NULL, 'em_andamento'),
(2, 10, '2026-07-01', '2026-07-31', 'concluida'),
(3, 7, '2026-08-15', '2026-09-30', 'em_andamento'),
(3, 5, '2026-06-01', '2026-06-30', 'concluida');

-- ============================================================
-- 8. encontros
-- ============================================================
INSERT INTO encontros (id_leitura, data_hora, local_link, descricao) VALUES
(1, '2026-08-20 19:00:00', 'https://meet.example.com/aurora-1', 'Discussão dos capítulos 1-10 de Dom Casmurro.'),
(1, '2026-08-27 19:00:00', 'https://meet.example.com/aurora-2', 'Discussão dos capítulos 11-20 e conclusão da leitura.'),
(2, '2026-07-25 19:00:00', 'https://meet.example.com/aurora-passada', 'Encontro final sobre A Hora da Estrela.'),
(3, '2026-08-28 20:00:00', 'https://meet.example.com/noite-1', 'Análise do assassinato e suspeitos no Expresso Oriente.'),
(4, '2026-07-30 20:00:00', 'https://meet.example.com/noite-passada', 'Discussão de Morte no Nilo.'),
(5, '2026-09-15 18:30:00', 'https://meet.example.com/paginas-1', 'Discussão da primeira parte da Sociedade do Anel.'),
(6, '2026-06-28 18:30:00', 'https://meet.example.com/paginas-passada', 'Debate sobre 1984 e sua relevância atual.');

-- ============================================================
-- 9. presencas
-- ============================================================
INSERT INTO presencas (id_encontro, id_membro, confirmado, presente) VALUES
(1, 1, TRUE, TRUE),
(1, 2, TRUE, TRUE),
(1, 3, FALSE, FALSE),
(1, 4, TRUE, TRUE),
(2, 1, TRUE, FALSE),
(2, 2, TRUE, TRUE),
(2, 3, TRUE, TRUE),
(2, 4, FALSE, FALSE),
(3, 1, TRUE, TRUE),
(3, 2, TRUE, TRUE),
(3, 3, TRUE, TRUE),
(3, 4, TRUE, TRUE),
(4, 5, TRUE, TRUE),
(4, 6, TRUE, FALSE),
(4, 2, TRUE, TRUE),
(5, 5, TRUE, TRUE),
(5, 6, TRUE, TRUE),
(5, 2, FALSE, FALSE),
(6, 7, TRUE, TRUE),
(6, 8, TRUE, TRUE),
(6, 3, TRUE, TRUE),
(6, 1, FALSE, FALSE),
(7, 7, TRUE, TRUE),
(7, 8, TRUE, TRUE),
(7, 3, TRUE, TRUE),
(7, 1, TRUE, TRUE);

-- ============================================================
-- 10. avaliacoes
-- ============================================================
INSERT INTO avaliacoes (id_membro, id_leitura, nota, comentario) VALUES
(1, 2, 5, 'Obra-prima absoluta. Clarice consegue transmitir emoções profundas com poucas palavras.'),
(2, 2, 4, 'Leitura densa, mas recompensadora. A narrativa de Rodrigo S.M. é fascinante.'),
(3, 2, 5, 'Uma das melhores leituras do clube este ano. Inesquecível.'),
(4, 2, 4, 'Demorei a me envolver, mas o final valeu cada página.'),
(2, 4, 5, 'Agatha Christie é genial. O final me pegou completamente de surpresa!'),
(5, 4, 4, 'Bom mistério, bem construído. Poirot é um detetive incrível.'),
(6, 4, 3, 'Achei um pouco lento no início, mas o desfecho é excelente.'),
(2, 5, 4, 'Clássico atemporal. Morte no Nilo mantém o suspense até o fim.'),
(5, 5, 5, 'Perfeito do início ao fim. Não consegui parar de ler.'),
(7, 6, 5, 'Uma das melhores obras de fantasia já escritas. Mundo incrível.'),
(8, 6, 4, 'Epicamente grande, mas vale cada página. A construção de mundo é sem igual.'),
(3, 6, 5, 'Tolkien é o mestre da fantasia. A Sociedade do Anel me prendeu do início ao fim.'),
(1, 6, 4, 'Excelente início da saga. Alguns trechos longos, mas a história é magnífica.'),
(7, 7, 5, '1984 é perturbadoramente atual. Uma leitura obrigatória para todos.'),
(8, 7, 4, 'Distopia brilhante. O final é devastador, mas necessário.'),
(3, 7, 5, 'Orwell foi visionário. Cada página faz refletir sobre o mundo atual.'),
(1, 7, 4, 'Leitura angustiante, mas fundamental. Recomendo a todos.');

-- ============================================================
-- 11. sugestoes
-- ============================================================
INSERT INTO sugestoes (id_clube, id_membro, id_livro, titulo_sugerido) VALUES
(1, 2, 2, NULL),  -- Memórias Póstumas de Brás Cubas
(1, 3, NULL, 'O Quincas Borba - Machado de Assis'),  -- sugestão de título livre
(1, 4, 4, NULL),  -- Cem Anos de Solidão
(2, 5, 10, NULL), -- Morte no Nilo
(2, 6, NULL, 'O Código Da Vinci - Dan Brown'),
(3, 7, 8, NULL),  -- O Hobbit
(3, 8, 11, NULL), -- Sapiens
(3, 1, 14, NULL); -- Mort

-- ============================================================
-- 12. votacoes
-- ============================================================
INSERT INTO votacoes (id_clube, titulo, aberta) VALUES
(1, 'Próxima leitura do Clube Aurora - Setembro 2026', TRUE),
(2, 'Próximo mistério do Leitores da Noite', TRUE),
(3, 'Próxima aventura nas Páginas Infinitas', FALSE);

-- ============================================================
-- 13. votacao_opcoes
-- ============================================================
INSERT INTO votacao_opcoes (id_votacao, id_sugestao) VALUES
(1, 1),  -- Memórias Póstumas de Brás Cubas
(1, 2),  -- O Quincas Borba (título livre)
(1, 3),  -- Cem Anos de Solidão
(2, 4),  -- Morte no Nilo
(2, 5),  -- O Código Da Vinci (título livre)
(3, 6),  -- O Hobbit
(3, 7),  -- Sapiens
(3, 8);  -- Mort

-- ============================================================
-- 14. votos
-- ============================================================
INSERT INTO votos (id_opcao, id_membro) VALUES
(1, 1),  -- Ana votou em Memórias Póstumas
(1, 2),  -- Bruno votou em Memórias Póstumas
(2, 3),  -- Carla votou em O Quincas Borba
(3, 4),  -- Diego votou em Cem Anos de Solidão
(4, 2),  -- Bruno votou em Morte no Nilo (membro do clube 2)
(4, 5),  -- Eduarda votou em Morte no Nilo
(5, 6),  -- Felipe votou em O Código Da Vinci
(6, 3),  -- Carla votou em O Hobbit (membro do clube 3)
(6, 7),  -- Gabriela votou em O Hobbit (membro do clube 3)
(7, 8),  -- Henrique votou em Sapiens
(7, 1);  -- Ana votou em Sapiens (membro do clube 3)
