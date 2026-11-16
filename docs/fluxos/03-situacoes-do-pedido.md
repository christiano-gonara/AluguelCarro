# Situações do pedido

Todo pedido começa **em análise**. Ele termina em uma de duas situações finais: **contrato fechado** ou **cancelado**.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> EM_ANALISE: cliente envia
    EM_ANALISE --> EM_ANALISE: cliente muda as datas
    EM_ANALISE --> APROVADO_FINANCEIRAMENTE: parceiro aprova
    EM_ANALISE --> REPROVADO: parceiro recusa
    APROVADO_FINANCEIRAMENTE --> CONTRATO_EXECUTADO: parceiro fecha o contrato
    EM_ANALISE --> CANCELADO: cliente cancela
    APROVADO_FINANCEIRAMENTE --> CANCELADO: cliente cancela
    REPROVADO --> CANCELADO: cliente tira da lista
    CONTRATO_EXECUTADO --> [*]
    CANCELADO --> [*]
```

| No back-end | Na tela | Quem pode mexer |
|---|---|---|
| `EM_ANALISE` | Em análise | cliente muda ou cancela; parceiro aprova ou recusa |
| `APROVADO_FINANCEIRAMENTE` | Aprovado | parceiro fecha o contrato; cliente pode cancelar |
| `REPROVADO` | Recusado | cliente pode cancelar |
| `CONTRATO_EXECUTADO` | Contrato fechado | ninguém (final) |
| `CANCELADO` | Cancelado | ninguém (final) |
