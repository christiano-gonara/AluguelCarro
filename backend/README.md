# Back-end (Spring Boot)

API REST do **Aluga.** O site em [`../frontend`](../frontend) consome estas rotas.

## Estrutura

| Pasta | O que tem |
|---|---|
| `controller` | rotas REST |
| `service` | regras de negócio: pedido, cliente, automóvel e usuário |
| `repository` | acesso ao banco com Spring Data JPA |
| `model` | entidades e enums |
| `dto` | contratos de entrada e saída da API |
| `security` | login, sessão e papéis |
| `exception` | erros de negócio virando resposta HTTP |
| `config` | `DataSeeder`, que cria contas e carros de exemplo |

## Rodar

```bash
export DB_URL='jdbc:postgresql://db.SEU_PROJETO.supabase.co:5432/postgres?sslmode=require'
export DB_USER=postgres
export DB_PASSWORD='sua-senha'
mvn spring-boot:run
```

As variáveis e o passo a passo do Supabase estão no [README da raiz](../README.md#-instalação-e-execução).

## Testes

```bash
mvn test   # 20 testes: modelo, regras de pedido e de cliente
```
