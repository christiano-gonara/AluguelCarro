# Fluxo do parceiro (empresa ou banco)

Empresa e banco seguem o mesmo caminho. A única diferença é que o banco, ao fechar o contrato, pode oferecer um parcelamento (contrato de crédito).

```mermaid
flowchart TD
    A[Entra<br/>/login] --> B[Pedidos<br/>/pedidos]
    A --> C[Carros<br/>/automoveis]
    A --> CL[Clientes<br/>/clientes]

    C --> C1[Escolhe marca, modelo e ano<br/>na Tabela FIPE]
    C1 --> C2[Diária sugerida:<br/>0,3% do valor FIPE]
    C2 --> C3[Salva o carro]

    B --> D[Abre o pedido<br/>e confere a renda do cliente]
    D --> E{Aprova?}
    E -- não --> F[Escreve o motivo] --> F1([Recusado])
    E -- sim --> G[Escreve o parecer] --> G1{{Aprovado}}
    G1 --> H[Fecha o contrato:<br/>em nome de quem fica o carro]
    H --> I{É banco?}
    I -- não --> J([Contrato fechado])
    I -- sim --> K{Vai parcelar?}
    K -- não --> J
    K -- sim --> L[Valor, juros por mês<br/>e número de parcelas] --> J
```

## Regras que a API confere

| Ação | Só funciona se… |
|---|---|
| Aprovar ou recusar | o pedido estiver **em análise** |
| Fechar o contrato | o pedido estiver **aprovado** |
| Oferecer parcelamento | quem fecha for um **banco** |
| Qualquer ação de parceiro | quem está logado for **agente** (empresa ou banco) |
