# Diagrama de Casos de Uso

Atores: **Cliente** (usuário individual) e **Agente** (empresa ou banco). O **Agente Banco** é uma especialização que, além de tudo que o agente faz, concede contratos de crédito.

```mermaid
flowchart LR
    Cliente([Cliente])
    Agente([Agente<br/>empresa ou banco])
    Banco([Agente Banco])
    Banco -. especializa .-> Agente

    subgraph Sistema["Sistema de Aluguel de Carros"]
        UC1(Cadastrar-se)
        UC2(Autenticar-se - login)
        UC3(Consultar e atualizar<br/>próprios dados)
        UC4(Excluir cadastro)
        UC5(Consultar catálogo<br/>de automóveis)
        UC6(Introduzir pedido<br/>de aluguel)
        UC7(Modificar pedido)
        UC8(Consultar pedidos<br/>e status)
        UC9(Cancelar pedido)
        UC10(Avaliar pedido<br/>financeiramente)
        UC11(Executar contrato)
        UC12(Gerir automóveis)
        UC13(Consultar clientes)
        UC14(Conceder contrato<br/>de crédito)
    end

    Cliente --- UC1
    Cliente --- UC2
    Cliente --- UC3
    Cliente --- UC4
    Cliente --- UC5
    Cliente --- UC6
    Cliente --- UC7
    Cliente --- UC8
    Cliente --- UC9

    Agente --- UC2
    Agente --- UC5
    Agente --- UC7
    Agente --- UC8
    Agente --- UC10
    Agente --- UC11
    Agente --- UC12
    Agente --- UC13
    Banco --- UC14

    UC11 -. extend .-> UC14
```

## Descrição resumida

| Caso de uso | Ator | Regra principal |
|---|---|---|
| Cadastrar-se | Cliente | Cadastro prévio obrigatório: usuário, senha, RG, CPF, nome, endereço, profissão e até 3 empregadores com rendimento. |
| Autenticar-se | Cliente, Agente | O sistema só é usado após login com usuário e senha. |
| Introduzir pedido | Cliente | Escolhe automóvel e período; o pedido nasce **Em análise**. |
| Modificar pedido | Cliente, Agente | Cliente: só enquanto em análise. Agente: enquanto o pedido não estiver cancelado ou executado. |
| Cancelar pedido | Cliente | Apenas os próprios pedidos, antes da execução do contrato. |
| Avaliar pedido | Agente | Parecer financeiro positivo (Aprovado) ou negativo (Reprovado). |
| Executar contrato | Agente | Só após parecer positivo; define em nome de quem o automóvel é registrado (cliente, empresa ou banco). |
| Conceder contrato de crédito | Agente Banco | Opcional, associado à execução do contrato. |
| Gerir automóveis | Agente | Cadastrar, alterar e remover automóveis (matrícula, ano, marca, modelo, placa). |
