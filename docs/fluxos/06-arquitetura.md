# Arquitetura: site e API separados

O projeto tem duas partes, cada uma na sua pasta:

| Pasta | O que é | Tecnologia |
|---|---|---|
| `frontend/` | O **site** (a parte web que a pessoa vê) | React + TypeScript + Vite |
| `backend/` | A **API** (regras de negócio e acesso ao banco) | Java 25 + Spring Boot |
| `docs/` | Documentação: diagramas, fluxos e script do banco | Markdown + Mermaid + SQL |

O site nunca fala direto com o banco de dados: ele sempre pede à API.

```mermaid
flowchart LR
    U([Navegador]) --> W

    subgraph W["frontend/ — site"]
        P[pages<br/>telas] --> CO[components<br/>peças comuns]
        P --> AP[api.ts<br/>chamadas HTTP]
        CO --> ST[styles<br/>CSS separado]
    end

    AP -- "/api (JSON + cookie de sessão)" --> CT

    subgraph A["backend/ — API"]
        CT[controller<br/>rotas REST] --> SV[service<br/>regras]
        SV --> RP[repository<br/>JPA]
        SEC[security<br/>login e papéis] -.-> CT
    end

    RP --> DB[(PostgreSQL<br/>Supabase)]
    W -. "busca preço" .-> FIPE[(Tabela FIPE<br/>API pública)]
```

## Versão de demonstração (GitHub Pages)

O GitHub Pages só hospeda arquivos estáticos, então lá o site roda **sem a API**. Quando o build é feito com `VITE_MODO_DEMO=true`, as chamadas que iriam pro Spring Boot são atendidas por `frontend/src/demo/servidor.ts`, que roda no navegador, segue as mesmas regras e mensagens da API e guarda os dados no `localStorage`.

```mermaid
flowchart LR
    P[pages] --> AP[api.ts]
    AP -- "versão completa" --> SB[Spring Boot<br/>backend/]
    AP -- "demonstração<br/>VITE_MODO_DEMO=true" --> DM[demo/servidor.ts<br/>no navegador]
    DM --> LS[(localStorage)]
```

## Como o CSS está dividido

Os estilos ficam em `frontend/src/styles/`, separados dos componentes, um arquivo por bloco da interface:

| Arquivo | Cuida de |
|---|---|
| `base.css` | cores, fontes e medidas (variáveis) |
| `layout.css` | topo, vidro, rodapé |
| `forms.css` | campos e botões |
| `tables.css` | tabelas de vidro, busca e paginação |
| `components.css` | selos de situação, avisos, telas vazias e de erro |
| `catalogo.css` | cartões de carro |
| `login.css` | tela de entrar |
| `landing.css` | página de apresentação |
| `avisos.css` | notificações do sistema, aviso da demo/Sistema e página 404 |
| `animacoes.css` | tudo o que se mexe ao passar o mouse |
| `index.css` | junta todos na ordem certa |
