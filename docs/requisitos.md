# Requisitos do Laboratório 02 — o que está feito

Checklist do enunciado ([DIAW · Laboratório 02 · Sistema de Aluguel de Carros](../README.md)) contra o que existe neste repositório. Serve pra saber o que já dá pra mostrar, o que está pela metade e o que ainda falta antes da apresentação.

**Legenda**

- ✅ **atendido** — funciona no protótipo e tem código ou documento no repositório
- 🟡 **parcial** — existe, mas falta uma parte ou uma evidência
- ⬜ **falta**

## 1. Stack tecnológica

| Requisito do enunciado | Status | Onde está |
|---|---|---|
| Java – JDK 25 | ✅ | `backend/pom.xml` (`<java.version>25</java.version>`) |
| Spring Boot 4.0.x | ✅ | `backend/pom.xml` (parent `spring-boot-starter-parent` 4.0.0) |
| Apache Maven | ✅ | `backend/pom.xml`; build com `mvn clean package` |
| Front-end React + Vite | ✅ | `frontend/package.json` (React 19, Vite 8) |
| Banco de dados Supabase (PostgreSQL) | ✅ | `backend/src/main/resources/application.properties` (`DB_URL`, `DB_USER`, `DB_PASSWORD`) e o esquema em [`banco-de-dados.sql`](banco-de-dados.sql) |
| Autenticação com login obrigatório (usuário e senha) | ✅ | `security/SecurityConfig.java`, `controller/AuthController.java`, `frontend/src/auth/AuthContext.tsx` |

## 2. Descrição do sistema

| Requisito do enunciado | Status | Onde está |
|---|---|---|
| O sistema só pode ser usado após cadastro prévio e autenticação | ✅ | `SecurityConfig` libera só `/api/auth/login` e `/api/auth/registro`; no front, `Protegida` em `App.tsx` manda quem não entrou pra `/sobre` |
| Cliente introduz pedidos de aluguel | ✅ | `POST /api/pedidos` (`PedidoController`) + `pages/PedidoForm.tsx` |
| Cliente modifica pedidos | ✅ | `PUT /api/pedidos/{id}`, permitido só enquanto o pedido está **Em análise** |
| Cliente consulta pedidos e o status | ✅ | `GET /api/pedidos` e `GET /api/pedidos/{id}` + `pages/Pedidos.tsx` e `pages/PedidoDetalhe.tsx` |
| Cliente cancela pedidos | ✅ | `POST /api/pedidos/{id}/cancelar`, bloqueado para pedido já encerrado |
| Agentes (empresas e bancos) modificam e avaliam pedidos | ✅ | `PUT /api/pedidos/{id}` e `POST /api/pedidos/{id}/avaliar`, com `@PreAuthorize` para `AGENTE_EMPRESA` e `AGENTE_BANCO` |
| Pedidos analisados financeiramente, com parecer | ✅ | `AvaliacaoRequest` (parecer obrigatório) e estados `APROVADO_FINANCEIRAMENTE` / `REPROVADO` |
| Contratantes: RG, CPF, nome, endereço, profissão | ✅ | `model/Cliente.java`, `dto/Dtos.java` e `components/ClienteForm.tsx` |
| Empregadores e rendimentos, no máximo 3 | ✅ | `model/Empregador.java` + `@Size(max = 3)` em `Dtos.java` + `MAX_EMPREGADORES` no formulário |
| Automóvel registrado como propriedade do cliente, da empresa ou do banco | ✅ | `model/TipoProprietario.java` e `ExecucaoRequest.propriedade` |
| Automóveis: matrícula, ano, marca, modelo e placa | ✅ | `model/Automovel.java`, `AutomovelRequest` e `pages/Automoveis.tsx` |
| Aluguel pode ter contrato de crédito concedido por um banco agente | ✅ | `model/ContratoCredito.java`; `PedidoService` recusa crédito de quem não é `AGENTE_BANCO` |
| Servidor central ligado a clientes e agentes pela Internet | ✅ | SPA React consumindo a API REST Spring Boot (mesma origem no dev, via proxy do Vite) |
| Dois subsistemas: gestão de pedidos/contratos e construção dinâmica das páginas | ✅ | Back-end MVC (controllers, services, repositories) e front-end que monta as telas a partir da API |
| Apresentação final comparando o protótipo com os modelos e as mudanças feitas | 🟡 | O protótipo e os modelos existem; falta um roteiro de apresentação e o registro do que mudou em relação ao desenho inicial |

## 3. Processo de desenvolvimento

| Requisito do enunciado | Status | Onde está |
|---|---|---|
| Diagrama de Casos de Uso | ✅ | [`modelagem/01-casos-de-uso.md`](modelagem/01-casos-de-uso.md) |
| Histórias do Usuário | ✅ | [`modelagem/02-historias-do-usuario.md`](modelagem/02-historias-do-usuario.md) |
| Diagrama de Classes | ✅ | [`modelagem/03-diagrama-de-classes.md`](modelagem/03-diagrama-de-classes.md) |
| Diagrama de Pacotes (visão lógica) | ✅ | [`modelagem/04-diagrama-de-pacotes.md`](modelagem/04-diagrama-de-pacotes.md) |
| Autenticação de clientes e agentes | ✅ | Perfis `CLIENTE`, `AGENTE_EMPRESA` e `AGENTE_BANCO`; sessão HTTP com cookie |
| CRUD de cliente | ✅ | Cadastro (`POST /api/auth/registro`), leitura e atualização (`GET`/`PUT /api/clientes/me`), exclusão (`DELETE /api/clientes/me`) e consulta pelos agentes (`GET /api/clientes`) |
| Protótipo em que o usuário cria e vê o status de um pedido | ✅ | Fluxo completo: catálogo → novo pedido → análise → contrato → detalhe com linha do tempo |
| Revisão dos diagramas ao longo do desenvolvimento | 🟡 | Os diagramas estão atualizados com o código atual, mas o histórico de revisões não está registrado |
| Repositório GitHub com todas as versões dos modelos e o código final | 🟡 | Modelos e código estão versionados; falta o commit final e conferir se nenhuma versão de modelo ficou de fora |
| README no template do professor | ✅ | Todas as seções do template presentes; itens opcionais (logo, foto/LinkedIn) na seção 4 |

## 4. README × template oficial

Comparação com o [`template_README.md`](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md) indicado no enunciado.

| Seção do template | Status | Observação |
|---|---|---|
| Título, descrição e logo | ✅ | Título e descrição ok (logo próprio é opcional) |
| Status do Projeto (badges) | ✅ | Badges de Java, Spring Boot, Maven, React, TypeScript, Vite e Supabase |
| Índice | ✅ | |
| Links Úteis | ✅ | Inclui modelagem, requisitos, FIPE e esquema do banco |
| Sobre o Projeto | ✅ | |
| Funcionalidades Principais | ✅ | |
| Tecnologias Utilizadas | ✅ | |
| Arquitetura (+ diagramas) | ✅ | Seção + `docs/fluxos/06-arquitetura.md` e `docs/modelagem` |
| Instalação e Execução | ✅ | Pré-requisitos, variáveis, dependências, banco e execução |
| Deploy | ✅ | Build e observação sobre o Pages |
| Estrutura de Pastas | ✅ | |
| Demonstração (prints/GIFs) | ✅ | 6 prints em `docs/prints` + exemplo de saída da API |
| Testes | ✅ | 20 testes no back-end (`mvn test`); front-end sem testes automatizados |
| Documentações utilizadas | ✅ | |
| Autores | 🟡 | Nome e GitHub; foto, LinkedIn e e-mail são opcionais |
| Contribuição | ✅ | Passo a passo de fork, branch, commit e PR |
| Agradecimentos | ✅ | |
| Licença | ✅ | MIT, com `LICENSE` na raiz e seção no README |

## 5. O que ainda falta fazer

1. **Commit e push** — as mudanças desta rodada estão no diretório de trabalho, ainda sem commit. O repositório só fica “atualizado” depois disso.
2. **Deploy do back-end** — a demonstração do GitHub Pages roda sem API. Pra mostrar o sistema completo na Internet falta hospedar o Spring Boot (ou a apresentação roda localmente).
3. **Testes de controller** (opcional) — as regras de serviço e de modelo estão cobertas (20 testes); falta um teste de integração dos endpoints.
4. **Itens opcionais do README** — logo próprio e foto/LinkedIn na seção de autores.

O roteiro da apresentação, com a comparação modelo × código, está em [`apresentacao.md`](apresentacao.md).

## 6. Sobre hospedar só no GitHub Pages

O enunciado pede **Spring Boot no back-end, React + Vite no front-end, Supabase como banco, arquitetura MVC e autenticação**. Ele não diz onde o sistema precisa estar hospedado: a avaliação olha o repositório e o protótipo funcionando.

O GitHub Pages serve arquivos estáticos, então ele **não roda o Spring Boot nem acessa o Supabase**. Hoje o Pages publica a **versão de demonstração** (`VITE_MODO_DEMO=true`), em que os dados de exemplo ficam no `localStorage` do navegador (`frontend/src/demo`). Isso é ótimo pra mostrar o visual e os cenários de uso, mas **não substitui o sistema completo** como evidência.

O que fazer pra não perder ponto:

- Manter o Pages como **demo visual**, deixando claro no README e na fala da apresentação que ali não tem back-end.
- Mostrar o **sistema completo rodando localmente**: `Supabase` configurado + `cd backend && mvn spring-boot:run` + `cd frontend && npm run dev` (instruções no README).
- Se quiser um sistema completo na Internet, hospede o Spring Boot (Render, Railway, Fly.io, uma VM…) e sirva o `frontend/dist` atrás do mesmo domínio. Vercel não serve pra isso: ele hospeda o front, não o Java.
- Deixar no repositório os artefatos que o professor vai olhar: modelos UML, código, README e a coleção de cenários de teste.
