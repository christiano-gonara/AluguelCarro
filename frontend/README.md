# Front-end (React + Vite)

O site do **Aluga.**, que consome a API do [`../backend`](../backend).

## Estrutura

| Pasta | O que tem |
|---|---|
| `src/pages` | telas, uma por rota |
| `src/components` | peças comuns: layout, formulários, tabelas e avisos |
| `src/auth` | contexto de login |
| `src/demo` | "servidor" da demonstração, que roda no navegador |
| `src/styles` | CSS separado por bloco, um arquivo por parte da interface |
| `src/utils` | formatadores, Tabela FIPE e dados das fotos |
| `src/api.ts` | cliente HTTP tipado |
| `src/types.ts` | tipos que espelham os DTOs da API |

## Rodar

```bash
npm install
npm run dev      # com o back-end em localhost:8080
npm run demo     # sem back-end: dados de exemplo no navegador
npm run build    # typecheck + build de produção
```

Instruções completas em [`docs/instalacao.md`](../docs/instalacao.md).
