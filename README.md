# 🚗 Aluguel de Carros 👨‍💻

Sistema web para gestão de aluguéis de automóveis: clientes fazem, modificam, consultam e cancelam pedidos pela Internet, e agentes (empresas e bancos) avaliam financeiramente os pedidos e executam os contratos.

Projeto do **Laboratório 02** da disciplina **DIAW** (Desenvolvimento e Integração de Aplicações Web), Engenharia de Software, PUC Minas. Professor: João Paulo Carneiro Aramuni.

## 🚧 Status do Projeto

![Java](https://img.shields.io/badge/Java-25-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.x-brightgreen)
![Maven](https://img.shields.io/badge/Maven-build-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

Protótipo funcional em desenvolvimento acadêmico.

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Agradecimentos](#-agradecimentos)

## 🔗 Links Úteis

- Modelagem UML (Mermaid, renderizada pelo GitHub): [`docs/modelagem`](docs/modelagem)
- Esquema do banco de dados: [`docs/banco-de-dados.sql`](docs/banco-de-dados.sql)

## 📝 Sobre o Projeto

O objetivo é apoiar a gestão de aluguéis de automóveis, permitindo efetuar, cancelar e modificar pedidos pela Internet. Os pedidos, depois de introduzidos, passam por análise financeira dos agentes e, com parecer positivo, seguem para a execução do contrato.

Sobre os contratantes, o sistema guarda RG, CPF, nome, endereço, profissão e as entidades empregadoras com os respectivos rendimentos (no máximo 3). Dependendo do tipo de contrato, o automóvel é registrado como propriedade do cliente, de uma empresa ou de um banco, e o aluguel pode estar associado a um contrato de crédito concedido por um banco agente. O contexto é acadêmico.

O sistema só pode ser usado após **cadastro prévio e login** (usuário e senha).

## ✨ Funcionalidades Principais

- **Autenticação**: cadastro de clientes, login obrigatório com usuário e senha, sessão HTTP e logout.
- **CRUD de cliente**: cadastro, consulta, atualização e exclusão dos próprios dados, incluindo até 3 empregadores com rendimento.
- **Pedidos de aluguel (cliente)**: introduzir, modificar (enquanto em análise), consultar o status e cancelar.
- **Análise e contratos (agentes)**: avaliar pedidos com parecer financeiro, modificar pedidos, executar o contrato definindo o proprietário do automóvel e, para bancos, associar contrato de crédito.
- **Catálogo de automóveis**: matrícula, ano, marca, modelo, placa e diária; gerido pelos agentes.
- **Perfis e autorização**: cliente, agente (empresa) e agente (banco), com regras de acesso aplicadas no back-end.

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
- React 19 + Vite 8 (TypeScript)
- React Router 7
- CSS puro, organizado em `src/styles`

### 🖥️ Back-end
- Java (JDK 25)
- Spring Boot 4.0.x (Spring Web MVC, Spring Data JPA, Spring Security, Bean Validation)
- Apache Maven
- Banco de dados: Supabase (PostgreSQL), acesso via JPA/Hibernate
- Autenticação: usuário e senha (BCrypt) com sessão HTTP

## 🏗 Arquitetura

Back-end em **MVC** com camadas bem separadas, e front-end como SPA que consome a API REST.

- **Model**: entidades JPA e enums (`model`).
- **View**: telas React em TypeScript (`frontend/src/pages`), montadas dinamicamente a partir dos dados da API. Os tipos em `frontend/src/types.ts` espelham os DTOs do back-end.
- **Controller**: endpoints REST (`controller`), que validam a entrada e delegam aos serviços.
- **Service / Repository**: regras de negócio (`service`) e acesso a dados (`repository`).
- **Segurança**: todas as rotas exigem autenticação, exceto login e cadastro. O cookie de sessão é HttpOnly e SameSite=Lax.

Principais decisões:

- Entidades nunca são expostas diretamente: a API usa DTOs.
- As regras de transição de status e de dono do pedido ficam no serviço, não na tela.
- Em desenvolvimento, o Vite encaminha `/api` ao Spring (proxy), mantendo a mesma origem e dispensando CORS.
- CSRF está desativado por simplicidade acadêmica (API com sessão e SameSite=Lax); em produção seria preciso reavaliar.

Diagramas (UML em Mermaid):

| Diagrama | Arquivo |
|---|---|
| Casos de uso | [`docs/modelagem/01-casos-de-uso.md`](docs/modelagem/01-casos-de-uso.md) |
| Histórias do usuário | [`docs/modelagem/02-historias-do-usuario.md`](docs/modelagem/02-historias-do-usuario.md) |
| Classes e estados do pedido | [`docs/modelagem/03-diagrama-de-classes.md`](docs/modelagem/03-diagrama-de-classes.md) |
| Pacotes (visão lógica) | [`docs/modelagem/04-diagrama-de-pacotes.md`](docs/modelagem/04-diagrama-de-pacotes.md) |

### Endpoints da API

| Método | Rota | Quem acessa |
|---|---|---|
| POST | `/api/auth/registro` | público (cadastro de cliente) |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/me` | autenticado |
| POST | `/api/auth/logout` | autenticado |
| GET, PUT, DELETE | `/api/clientes/me` | cliente |
| GET | `/api/clientes`, `/api/clientes/{id}` | agente |
| GET | `/api/automoveis` | autenticado |
| POST, PUT, DELETE | `/api/automoveis`, `/api/automoveis/{id}` | agente |
| POST | `/api/pedidos` | cliente |
| GET | `/api/pedidos`, `/api/pedidos/{id}` | cliente (os seus) ou agente (todos) |
| PUT | `/api/pedidos/{id}` | cliente (em análise) ou agente |
| POST | `/api/pedidos/{id}/cancelar` | cliente |
| POST | `/api/pedidos/{id}/avaliar` | agente |
| POST | `/api/pedidos/{id}/executar` | agente (crédito apenas banco) |

## 🔧 Instalação e Execução

### Pré-requisitos

- JDK 25
- Maven 3.9+
- Node.js 20+ e npm
- Um projeto no [Supabase](https://supabase.com) (banco PostgreSQL)

### 🔑 Variáveis de Ambiente

#### 1. Back-end (Spring Boot)

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_URL` | URL JDBC do Supabase | `jdbc:postgresql://db.SEU_PROJETO.supabase.co:5432/postgres?sslmode=require` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | definida no Supabase |
| `PORT` | Porta do servidor (opcional) | `8080` |
| `SEED_ENABLED` | Cria agentes e carros de exemplo (opcional) | `true` |
| `SEED_AGENT_PASSWORD` | Senha dos agentes criados pelo seed | escolha uma senha |

Há um modelo em [`backend/.env.example`](backend/.env.example). O Spring não lê `.env` sozinho: exporte as variáveis no terminal. **Nunca faça commit de senhas.**

#### 2. Front-end (React, Vite)

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_PROXY_TARGET` | Back-end para o proxy do Vite (opcional) | `http://localhost:8080` |

### 📦 Instalação de Dependências

```bash
git clone https://github.com/christiano-gonara/AluguelCarro.git
cd AluguelCarro

# Front-end
cd frontend && npm install && cd ..

# Back-end (baixa as dependências ao compilar)
cd backend && mvn clean package -DskipTests && cd ..
```

### 💾 Inicialização do Banco de Dados (Supabase)

1. No Supabase, copie os dados de conexão do banco em *Project Settings > Database*.
2. Defina `DB_URL`, `DB_USER` e `DB_PASSWORD`.
3. As tabelas são criadas automaticamente pelo Hibernate na primeira execução (`ddl-auto=update`). Para criá-las manualmente, use [`docs/banco-de-dados.sql`](docs/banco-de-dados.sql) no SQL Editor.

### ⚡ Como Executar a Aplicação

**Terminal 1: Back-end (porta 8080)**

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

**Terminal 2: Front-end (porta 5173)**

```bash
cd frontend
npm run dev
```

Acesse `http://localhost:5173`. Com o seed habilitado, os agentes `agente.empresa` e `agente.banco` usam a senha definida em `SEED_AGENT_PASSWORD`. Clientes se cadastram pela própria tela.

## 🚀 Deploy

```bash
# Front-end: gera frontend/dist
cd frontend && npm run build

# Back-end: gera backend/target/aluguel-carro-1.0.0.jar
cd backend && mvn clean package
java -jar target/aluguel-carro-1.0.0.jar
```

Configure as variáveis de ambiente de produção no servidor. Como o front-end em produção ficará em outra origem, será preciso servir `dist` atrás do mesmo domínio da API (proxy reverso) ou habilitar CORS com credenciais no back-end.

## 📂 Estrutura de Pastas

```text
AluguelCarro/
├── backend/                      # Spring Boot (Maven)
│   ├── pom.xml
│   └── src/
│       ├── main/java/br/com/aluguelcarro/
│       │   ├── config/           # DataSeeder
│       │   ├── controller/       # Endpoints REST
│       │   ├── dto/              # Entrada e saída da API
│       │   ├── exception/        # Erros de negócio e tratamento
│       │   ├── model/            # Entidades e enums
│       │   ├── repository/       # Spring Data JPA
│       │   ├── security/         # Login, sessão e papéis
│       │   └── service/          # Regras de negócio
│       ├── main/resources/application.properties
│       └── test/                 # Testes
├── frontend/                     # React + Vite + TypeScript
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── auth/                 # Contexto de autenticação
│       ├── components/           # Layout, formulários e peças comuns
│       ├── pages/                # Telas
│       ├── styles/               # CSS separado dos componentes
│       ├── utils/                # Formatadores
│       ├── api.ts                # Cliente HTTP tipado
│       └── types.ts              # Tipos que espelham os DTOs da API
└── docs/
    ├── modelagem/                # Casos de uso, histórias, classes e pacotes
    └── banco-de-dados.sql
```

## 🎥 Demonstração

### 💻 Exemplo de Saída no Terminal (API com cURL)

```bash
# Login (guarda o cookie de sessão)
curl -i -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"username":"agente.empresa","senha":"SUA_SENHA"}' \
  http://localhost:8080/api/auth/login
```

```json
{ "username": "agente.empresa", "perfil": "AGENTE_EMPRESA", "clienteId": null }
```

```bash
# Listar pedidos usando a sessão
curl -b cookies.txt http://localhost:8080/api/pedidos
```

## 🧪 Testes

```bash
cd backend
mvn test
```

Os testes atuais cobrem regras do modelo (valor estimado do pedido, limite de 3 empregadores e soma de rendimentos).

## 🔗 Documentações utilizadas

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Supabase](https://supabase.com/docs)
- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Mermaid](https://mermaid.js.org)

## 👥 Autores

| Nome | GitHub |
|---|---|
| Christiano Gonçalves Araujo | [@christiano-gonara](https://github.com/christiano-gonara) |

## 🙏 Agradecimentos

À PUC Minas e ao professor João Paulo Carneiro Aramuni, pela proposta e pelo material da disciplina DIAW.
