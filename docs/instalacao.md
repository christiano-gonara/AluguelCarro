# Instalação e execução

Pré-requisitos: JDK 25, Maven 3.9+, Node.js 20+ e npm, e um projeto no [Supabase](https://supabase.com) (banco PostgreSQL).

## Variáveis de ambiente

### Back-end (Spring Boot)

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_URL` | URL JDBC do Supabase | `jdbc:postgresql://db.SEU_PROJETO.supabase.co:5432/postgres?sslmode=require` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | definida no Supabase |
| `PORT` | Porta do servidor (opcional) | `8080` |
| `SEED_ENABLED` | Cria contas e carros de exemplo (opcional) | `true` |
| `SEED_AGENT_PASSWORD` | Senha das contas de exemplo (`agente.empresa`, `agente.banco` e `cliente.demo`) | escolha uma senha |

Há um modelo em [`backend/.env.example`](../backend/.env.example). O Spring não lê `.env` sozinho: exporte as variáveis no terminal. **Nunca faça commit de senhas.**

### Front-end (React, Vite)

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_PROXY_TARGET` | Back-end para o proxy do Vite (opcional) | `http://localhost:8080` |
| `VITE_DEMO_PASSWORD` | Mostra os botões de contas de exemplo no login (opcional, só demonstração); use o mesmo valor de `SEED_AGENT_PASSWORD`. Coloque em `frontend/.env.local` | `uma-senha-de-dev` |

## Instalação das dependências

```bash
git clone https://github.com/christiano-gonara/AluguelCarro.git
cd AluguelCarro

# Front-end
cd frontend && npm install && cd ..

# Back-end (baixa as dependências ao compilar)
cd backend && mvn clean package -DskipTests && cd ..
```

## Banco de dados (Supabase)

1. No Supabase, copie os dados de conexão do banco em *Project Settings > Database*.
2. Defina `DB_URL`, `DB_USER` e `DB_PASSWORD`.
3. As tabelas são criadas automaticamente pelo Hibernate na primeira execução (`ddl-auto=update`). Para criá-las manualmente, use [`banco-de-dados.sql`](banco-de-dados.sql) no SQL Editor.

## Como executar

### Terminal 1: back-end (porta 8080)

```bash
cd backend
export DB_URL='jdbc:postgresql://db.SEU_PROJETO.supabase.co:5432/postgres?sslmode=require'
export DB_USER=postgres
export DB_PASSWORD='sua-senha'
# opcional: agentes e carros de exemplo
export SEED_ENABLED=true
export SEED_AGENT_PASSWORD='uma-senha-de-desenvolvimento'
mvn spring-boot:run
```

### Terminal 2: front-end (porta 5174)

```bash
cd frontend
npm run dev
```

Acesse `http://localhost:5174`. Com o seed habilitado, as contas `agente.empresa`, `agente.banco` e `cliente.demo` usam a senha definida em `SEED_AGENT_PASSWORD`. Outros clientes se cadastram pela própria tela.

Em desenvolvimento, o Vite encaminha `/api` ao Spring Boot e `/fipe` à API da Tabela FIPE (veja `frontend/vite.config.ts`).

## Deploy

```bash
# Front-end: gera frontend/dist
cd frontend && npm run build

# Back-end: gera backend/target/aluguel-carro-1.0.0.jar
cd backend && mvn clean package
java -jar target/aluguel-carro-1.0.0.jar
```

Configure as variáveis de ambiente de produção no servidor. Como o front-end em produção ficará em outra origem, será preciso servir `dist` atrás do mesmo domínio da API (proxy reverso) ou habilitar CORS com credenciais no back-end.

O GitHub Pages só publica a demonstração: ele não roda o Spring Boot nem acessa o Supabase. Pra mostrar o sistema completo é preciso hospedar a API em outro lugar ou rodar localmente na apresentação — os detalhes estão em [`requisitos.md`](requisitos.md).
