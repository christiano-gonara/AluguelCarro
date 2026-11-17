# Roteiro da apresentação

Sequência curta para mostrar o protótipo, comparar com os modelos e fechar os requisitos do Laboratório 02.

## Antes de começar

Duas opções, escolha uma:

- **Demonstração online** (sem back-end): https://christiano-gonara.github.io/AluguelCarro/ — contas de exemplo com a senha `demo`.
- **Sistema completo**: Supabase configurado, `cd backend && mvn spring-boot:run` e `cd frontend && npm run dev` (passo a passo em [instalacao.md](instalacao.md)).

Deixe aberto também o repositório no GitHub, na pasta `docs/`, para mostrar os diagramas em Mermaid.

## Roteiro da demo

| # | Tela | O que mostrar |
|---|---|---|
| 1 | Apresentação (`/#/sobre`) | O problema, quem usa (cliente, empresa, banco) e o caminho do pedido até o contrato. |
| 2 | Criar conta | O cadastro em 3 passos (acesso → dados → renda) e a renda somada na hora. |
| 3 | Login | Entrar como `cliente.demo` (senha `demo`) sem digitar nada. |
| 4 | Catálogo | Escolher um carro e mandar um pedido; mostrar o total calculado pelas diárias. |
| 5 | Meus pedidos | Abrir a setinha de um pedido (total, placa, quem aprova) e o detalhe com a linha do tempo. |
| 6 | Meus dados | Alterar a renda e mostrar que a soma é recalculada. |
| 7 | Sair e entrar como `agente.empresa` | Fila de pedidos: cliente, renda, carro, período e situação. |
| 8 | Analisar o pedido #1 | Escrever o parecer, aprovar e depois fechar o contrato (escolher o proprietário). |
| 9 | Entrar como `agente.banco` | Fechar um contrato **com parcelamento** (valor, juros e parcelas) e abrir o pedido #3 para ver o crédito concedido. |
| 10 | Voltar ao cliente | Ver o pedido aprovado/executado com o parecer e o parcelamento. |
| 11 | Exceções | `/#/xyz` (404), `/#/pedidos/999` (pedido inexistente) e uma tela do outro perfil. |
| 12 | Diagramas | `docs/modelagem` (casos de uso, classes, pacotes) e `docs/fluxos` (jornadas e sequências). |

Atalho para trocar de conta no meio da demo: a aba verde **Cenários de uso**, no topo, só aparece depois do login.

## Modelo × código

### Casos de uso → endpoints e telas

| Caso de uso | API | Tela |
|---|---|---|
| Cadastrar-se | `POST /api/auth/registro` | `pages/Registro.tsx` |
| Autenticar-se | `POST /api/auth/login` e `GET /api/auth/me` | `pages/Login.tsx`, `auth/AuthContext.tsx` |
| Consultar/atualizar os próprios dados | `GET`/`PUT /api/clientes/me` | `pages/MeusDados.tsx` |
| Excluir cadastro | `DELETE /api/clientes/me` | `pages/MeusDados.tsx` |
| Consultar catálogo | `GET /api/automoveis` | `pages/Catalogo.tsx` |
| Introduzir pedido | `POST /api/pedidos` | `pages/PedidoForm.tsx` |
| Modificar pedido | `PUT /api/pedidos/{id}` | `pages/PedidoForm.tsx` |
| Consultar pedidos e status | `GET /api/pedidos`, `GET /api/pedidos/{id}` | `pages/Pedidos.tsx`, `pages/PedidoDetalhe.tsx` |
| Cancelar pedido | `POST /api/pedidos/{id}/cancelar` | `pages/PedidoDetalhe.tsx` |
| Avaliar pedido | `POST /api/pedidos/{id}/avaliar` | `pages/PedidoDetalhe.tsx` |
| Executar contrato | `POST /api/pedidos/{id}/executar` | `pages/PedidoDetalhe.tsx` |
| Gerir automóveis | `POST`/`PUT`/`DELETE /api/automoveis` | `pages/Automoveis.tsx` |
| Consultar clientes | `GET /api/clientes` | `pages/Clientes.tsx` |
| Conceder contrato de crédito | `POST /api/pedidos/{id}/executar` com `credito` | `pages/PedidoDetalhe.tsx` (só banco) |

### Diagrama de classes → entidades

| Modelo | Código |
|---|---|
| `Usuario` (username, senha, perfil) | `model/Usuario.java` + `model/Perfil.java` |
| `Cliente` (RG, CPF, nome, endereço, profissão) | `model/Cliente.java` |
| `Empregador` (entidade e rendimento, até 3) | `model/Empregador.java` |
| `Automovel` (matrícula, ano, marca, modelo, placa) | `model/Automovel.java` |
| `PedidoAluguel` (datas, status, parecer, proprietário) | `model/PedidoAluguel.java` + `model/StatusPedido.java` |
| `ContratoCredito` (banco, valor, juros, parcelas) | `model/ContratoCredito.java` |

### Diagrama de pacotes → pastas

| Pacote | Pasta |
|---|---|
| Controller / Service / Repository / Model / DTO | `backend/src/main/java/br/com/aluguelcarro/{controller,service,repository,model,dto}` |
| Segurança e tratamento de erros | `security/`, `exception/` |
| View (SPA) | `frontend/src/pages`, `components`, `auth`, `demo`, `styles` |

## O que mudou em relação ao desenho inicial

- **Cadastro em 3 passos** (acesso, dados e renda) para reduzir a quantidade de campos por tela.
- **Tabela de pedidos compacta**, com uma linha expansível para renda, total, placa e “quem aprova”.
- **Versão de demonstração** no GitHub Pages, com dados no navegador e um painel **Sistema** no rodapé (mensagens e telas de exceção).
- **Consulta à Tabela FIPE** para sugerir a diária no cadastro de carros.
- **Avisos do sistema** (toasts), página 404 e feedback de erro em linguagem simples.

Nenhuma dessas mudanças altera o domínio: classes, estados e casos de uso continuam os mesmos dos diagramas.

## Checklist antes de entregar

1. `cd backend && mvn test` — 20 testes verdes.
2. `cd frontend && npm run build` — build sem erros.
3. `git status` — commitar e dar push de tudo.
4. Conferir [`docs/requisitos.md`](requisitos.md) e os prints em [`docs/prints`](prints).
5. Abrir a demo e o sistema local uma última vez.
