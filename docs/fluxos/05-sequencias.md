# Sequências

O que acontece por trás de cada ação: o navegador (site), a API (Spring Boot) e o banco de dados (PostgreSQL no Supabase).

## Entrar

```mermaid
sequenceDiagram
    actor U as Pessoa
    participant W as Site (React)
    participant A as API (Spring)
    participant B as Banco de dados
    U->>W: digita usuário e senha
    W->>A: POST /api/auth/login
    A->>B: busca o usuário
    B-->>A: usuário e senha criptografada
    alt senha certa
        A-->>W: 200 + cookie de sessão (HttpOnly)
        W->>A: GET /api/auth/me
        A-->>W: nome e perfil
        W-->>U: abre Carros (cliente) ou Pedidos (parceiro)
    else senha errada
        A-->>W: 401
        W-->>U: "Usuário ou senha não conferem"
    end
```

## Cliente faz um pedido

```mermaid
sequenceDiagram
    actor C as Cliente
    participant W as Site
    participant A as API
    participant B as Banco de dados
    C->>W: escolhe o carro e as datas
    W->>W: confere se a data final não é antes da inicial
    W->>A: POST /api/pedidos {automovelId, dataInicio, dataFim}
    A->>A: é cliente? datas válidas?
    A->>B: salva o pedido EM_ANALISE
    B-->>A: pedido com número
    A-->>W: 201 + pedido
    W-->>C: abre o detalhe do pedido ("Em análise")
```

## Parceiro aprova ou recusa

```mermaid
sequenceDiagram
    actor P as Empresa ou banco
    participant W as Site
    participant A as API
    participant B as Banco de dados
    P->>W: abre o pedido e confere a renda
    P->>W: aprova ou recusa, com o motivo
    W->>A: POST /api/pedidos/{id}/avaliar {aprovado, parecer}
    A->>A: é agente? pedido está EM_ANALISE?
    alt pode avaliar
        A->>B: muda para APROVADO_FINANCEIRAMENTE ou REPROVADO
        A-->>W: 200 + pedido atualizado
        W-->>P: selo novo na tela
    else não pode
        A-->>W: 400 "Somente pedidos em análise podem ser avaliados"
        W-->>P: mensagem explicando o motivo
    end
```

## Parceiro fecha o contrato

```mermaid
sequenceDiagram
    actor P as Empresa ou banco
    participant W as Site
    participant A as API
    participant B as Banco de dados
    P->>W: escolhe em nome de quem fica o carro
    opt é banco e vai parcelar
        P->>W: valor, juros por mês e parcelas
    end
    W->>A: POST /api/pedidos/{id}/executar {propriedade, credito?}
    A->>A: pedido aprovado? crédito só se for banco
    A->>B: salva o contrato e muda para CONTRATO_EXECUTADO
    A-->>W: 200 + pedido
    W-->>P: "Contrato fechado"
```

## Cliente cancela

```mermaid
sequenceDiagram
    actor C as Cliente
    participant W as Site
    participant A as API
    participant B as Banco de dados
    C->>W: clica em "Cancelar pedido" e confirma
    W->>A: POST /api/pedidos/{id}/cancelar
    A->>A: o pedido é dele? ainda não terminou?
    A->>B: muda para CANCELADO
    A-->>W: 200 + pedido
    W-->>C: "Pedido cancelado"
```
