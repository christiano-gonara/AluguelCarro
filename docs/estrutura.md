# Estrutura de pastas

O projeto tem duas partes independentes (`frontend/` e `backend/`), a documentação em `docs/` e o esquema do banco dentro dela.

```text
AluguelCarro/
├── backend/                      # Spring Boot (Maven) — veja backend/README.md
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
│       └── test/                 # Testes de modelo e de regras de negócio
├── frontend/                     # React + Vite + TypeScript — veja frontend/README.md
│   ├── public/carros/            # Fotos recortadas dos carros (sem fundo)
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── auth/                 # Contexto de autenticação
│       ├── demo/                 # "Servidor" e dados da versão de demonstração (GitHub Pages)
│       ├── components/           # Layout, formulários e peças comuns
│       ├── pages/                # Telas
│       ├── styles/               # CSS separado dos componentes, um arquivo por bloco
│       ├── utils/                # Formatadores e cliente da Tabela FIPE
│       ├── api.ts                # Cliente HTTP tipado
│       └── types.ts              # Tipos que espelham os DTOs da API
├── docs/
│   ├── fluxos/                   # Fluxogramas, mapa de telas, sequências e arquitetura (Mermaid)
│   ├── modelagem/                # Casos de uso, histórias, classes e pacotes
│   ├── prints/                   # Capturas de tela usadas no README
│   ├── apresentacao.md           # Roteiro da demo e comparação modelo × código
│   ├── arquitetura.md            # Os dois caminhos, em diagrama
│   ├── instalacao.md             # Variáveis, banco e execução
│   ├── requisitos.md             # Checklist do laboratório
│   └── banco-de-dados.sql
└── LICENSE
```

`frontend/src/styles/` tem um arquivo por bloco da interface (tabelas, formulários, catálogo, avisos…) e o `index.css` junta todos na ordem certa. `animacoes.css` concentra o que se mexe ao passar o mouse.
