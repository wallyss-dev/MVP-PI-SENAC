# BookClub Hub

Aplicação web completa para gestão de clubes de leitura, com frontend em React, backend em Python (Flask), banco de dados PostgreSQL, API REST e scripts SQL prontos para execução.

## Requisitos

- **Node.js** 18+ (frontend)
- **Python** 3.10+ (backend)
- **PostgreSQL** 14+ (banco de dados)
- **Docker** e **Docker Compose** (opcional, para execução containerizada)

## Estrutura do Projeto

```
bookclub-hub/
├── database/
│   ├── schema.sql          # Cria as 14 tabelas do banco
│   └── seed.sql             # Dados fictícios para teste
├── backend/
│   ├── app.py               # Entry point do Flask
│   ├── config.py            # Configuração via variáveis de ambiente
│   ├── requirements.txt     # Dependências Python
│   ├── database/
│   │   └── connection.py    # Conexão PostgreSQL (psycopg)
│   ├── models/
│   ├── routes/
│   │   └── routes.py        # Endpoints da API REST
│   └── services/
│       └── services.py      # Lógica de negócio + queries SQL
├── src/                     # Frontend React + Vite + Tailwind
│   ├── components/          # Componentes reutilizáveis (Button, Card, Modal, etc.)
│   ├── hooks/               # Hooks customizados (useApi, useToast)
│   ├── pages/               # 17 telas da aplicação
│   ├── services/            # Camada de integração com a API
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Funções utilitárias
├── .env.example             # Template de variáveis de ambiente
├── docker-compose.yml       # Orquestração Docker (PostgreSQL + Backend + Frontend)
├── Dockerfile               # Imagem do backend
└── README.md
```

## Instalação e Configuração

### 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd bookclub-hub
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme seu ambiente:

```bash
cp .env.example .env
```

Variáveis necessárias:

| Variável            | Descrição                    | Padrão           |
|---------------------|------------------------------|------------------|
| `DATABASE_HOST`     | Host do PostgreSQL           | `localhost`      |
| `DATABASE_PORT`     | Porta do PostgreSQL           | `5432`           |
| `DATABASE_NAME`     | Nome do banco                | `bookclub_hub`   |
| `DATABASE_USER`     | Usuário do banco             | `bookclub`       |
| `DATABASE_PASSWORD` | Senha do banco               | `bookclub_secret`|
| `BACKEND_HOST`      | Host do backend Flask         | `0.0.0.0`        |
| `BACKEND_PORT`      | Porta do backend              | `5000`           |
| `VITE_API_URL`      | URL da API para o frontend    | `http://localhost:5000/api` |

### 3. Configurar o PostgreSQL

Crie o banco de dados e o usuário:

```bash
psql -U postgres
```

```sql
CREATE DATABASE bookclub_hub;
CREATE USER bookclub WITH PASSWORD 'bookclub_secret';
GRANT ALL PRIVILEGES ON DATABASE bookclub_hub TO bookclub;
```

### 4. Executar o schema e o seed

```bash
psql -U bookclub -d bookclub_hub -f database/schema.sql
psql -U bookclub -d bookclub_hub -f database/seed.sql
```

### 5. Instalar e iniciar o backend

```bash
pip install -r backend/requirements.txt
python -m backend.app
```

O backend estará disponível em `http://localhost:5000/api`.

### 6. Instalar e iniciar o frontend

```bash
O npm install baixa apenas o frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Execução com Docker

Para executar tudo com Docker Compose (PostgreSQL, backend e frontend):

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api`
- PostgreSQL: `localhost:5432`

O schema e o seed são executados automaticamente na primeira inicialização do container do PostgreSQL.

## Modelo do Banco de Dados

O banco possui 14 entidades com relacionamentos completos:

1. **usuarios** - Usuários do sistema
2. **clubes** - Clubes de leitura (com admin)
3. **membros** - Associação usuário-clube (N:N)
4. **autores** - Autores de livros
5. **categorias** - Categorias de livros
6. **livros** - Catálogo de livros
7. **leituras** - Leitura de um livro por um clube
8. **encontros** - Reuniões para discutir leituras
9. **presencas** - Presença em encontros
10. **avaliacoes** - Avaliações de leituras (nota 1-5)
11. **sugestoes** - Sugestões de leitura (livro ou título livre)
12. **votacoes** - Votações para escolher leituras
13. **votacao_opcoes** - Opções de uma votação
14. **votos** - Votos dos membros

### Constraints e integridade

- E-mail único por usuário
- Membro único por clube
- Presença única por encontro+membro
- Avaliação única por membro+leitura
- Nota entre 1 e 5 (CHECK constraint)
- Voto único por membro por votação (trigger)
- Sugestão requer livro OU título livre (CHECK constraint)

## API REST

### Endpoints principais

| Método | Rota                        | Descrição                    |
|--------|----------------------------|------------------------------|
| GET    | `/api/dashboard`           | Dados do dashboard           |
| GET    | `/api/clubs`                | Listar clubes                |
| POST   | `/api/clubs`                | Criar clube                  |
| GET    | `/api/clubs/:id`            | Detalhes do clube            |
| PUT    | `/api/clubs/:id`            | Editar clube                 |
| DELETE | `/api/clubs/:id`            | Excluir clube                |
| GET    | `/api/books`                | Listar livros (com busca)    |
| POST   | `/api/books`                | Cadastrar livro              |
| GET    | `/api/books/:id`            | Detalhes do livro            |
| PUT    | `/api/books/:id`            | Editar livro                 |
| DELETE | `/api/books/:id`            | Excluir livro                |
| GET    | `/api/readings`             | Listar leituras              |
| POST   | `/api/readings`             | Criar leitura                |
| PUT    | `/api/readings/:id`         | Editar leitura               |
| GET    | `/api/meetings`             | Listar encontros             |
| POST   | `/api/meetings`             | Criar encontro               |
| PUT    | `/api/meetings/:id`         | Editar encontro              |
| DELETE | `/api/meetings/:id`         | Excluir encontro             |
| GET    | `/api/reviews`              | Listar avaliações            |
| POST   | `/api/reviews`              | Criar avaliação              |
| GET    | `/api/suggestions`          | Listar sugestões             |
| POST   | `/api/suggestions`          | Criar sugestão               |
| DELETE | `/api/suggestions/:id`      | Excluir sugestão             |
| GET    | `/api/votes`                | Listar votações              |
| GET    | `/api/votes/:id`            | Detalhes da votação          |
| POST   | `/api/votes`                | Criar votação                |
| PUT    | `/api/votes/:id`            | Editar votação               |
| POST   | `/api/votes/cast`           | Registrar voto               |
| GET    | `/api/autores`              | Listar autores               |
| POST   | `/api/autores`              | Cadastrar autor              |
| GET    | `/api/categorias`           | Listar categorias            |
| POST   | `/api/categorias`           | Cadastrar categoria          |
| GET    | `/api/usuarios`             | Listar usuários              |

Todas as queries usam SQL parametrizado para prevenir injeção de SQL.

## Telas da Aplicação

- **Login** - Tela de acesso (MVP: qualquer e-mail/senha funciona)
- **Dashboard** - Visão geral com estatísticas, leituras atuais, próximos encontros, avaliações e sugestões recentes
- **Clubes** - Lista, criação e detalhes de clubes (com membros, leituras e sugestões)
- **Livros** - Catálogo com busca, cadastro e detalhes
- **Leituras** - Lista e criação de leituras
- **Encontros** - Lista e agendamento de encontros
- **Avaliações** - Lista e criação de avaliações (nota 1-5 estrelas)
- **Sugestões** - Lista e criação de sugestões (livro existente ou título livre)
- **Votações** - Lista, criação e votação interativa com barras de progresso
- **Perfil** - Informações do usuário
- **Configurações** - Preferências do sistema

## Credenciais de Teste (Seed)

Após executar o seed, você pode usar qualquer um dos usuários fictícios. O login é apenas demonstrativo (MVP):

- E-mail: `ana.silva@email.com`
- Senha: qualquer valor

## Tecnologias

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS 3, React Router 7, Lucide Icons
- **Backend:** Python 3, Flask 3, Flask-CORS, psycopg 3 (PostgreSQL adapter)
- **Banco:** PostgreSQL 16
- **Containerização:** Docker, Docker Compose
