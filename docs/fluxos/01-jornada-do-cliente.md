# Jornada do cliente

Quem aluga entra pela página de apresentação, cria a conta (ou entra), escolhe um carro e manda o pedido. Daí em diante, só acompanha: quem decide é a empresa ou o banco dono do carro.

```mermaid
flowchart TD
    A([Página de apresentação<br/>/sobre]) --> B{Já tem conta?}
    B -- não --> C[Cria a conta<br/>/registro]
    B -- sim --> D[Entra<br/>/login]
    C --> E
    D --> E[Escolhe o carro<br/>catálogo /]
    E --> F[Escolhe as datas<br/>/pedidos/novo]
    F --> G{As datas estão certas?}
    G -- não --> F
    G -- sim --> H[Envia o pedido]
    H --> I{{Em análise}}
    I -- quer mudar --> F
    I -- desistiu --> X([Cancelado])
    I -- parceiro aprova --> J{{Aprovado}}
    I -- parceiro recusa --> K{{Recusado}}
    J -- desistiu --> X
    K -- tira da lista --> X
    J -- parceiro fecha o contrato --> L([Contrato fechado])

    classDef acao fill:#eef2e2,stroke:#8fa36a,color:#2c3418
    classDef fim fill:#ebeeea,stroke:#7b8574,color:#232a1c
    class I acao
    class K,L,X fim
```

## O que o cliente pode fazer em cada momento

```mermaid
flowchart LR
    subgraph Conta
        R[Criar conta] --> M[Ver e editar<br/>meus dados<br/>/meus-dados]
        M --> Z[Apagar a conta]
    end
    subgraph Pedidos
        P[Ver meus pedidos<br/>/pedidos] --> PD[Abrir um pedido<br/>/pedidos/:id]
        PD --> MU[Mudar as datas<br/>só em análise]
        PD --> CA[Cancelar<br/>em análise, aprovado ou recusado]
    end
    Conta --> Pedidos
```
