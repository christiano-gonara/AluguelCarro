# Histórias do Usuário

## Cliente

| ID | História | Critérios de aceite |
|---|---|---|
| HU01 | Como **cliente**, quero me cadastrar informando meus dados de identificação, profissão e empregadores, para poder usar o sistema. | CPF com 11 dígitos e único; usuário único; senha com no mínimo 6 caracteres; no máximo 3 empregadores, cada um com rendimento. |
| HU02 | Como **cliente**, quero entrar com usuário e senha, para acessar minhas informações. | Sem login, nenhuma tela além de login e cadastro abre; credenciais inválidas mostram erro. |
| HU03 | Como **cliente**, quero consultar e atualizar meus dados, para mantê-los corretos. | Alterações respeitam as mesmas validações do cadastro. |
| HU04 | Como **cliente**, quero excluir meu cadastro, para encerrar minha conta. | Bloqueado se houver contrato executado; os demais pedidos são removidos junto. |
| HU05 | Como **cliente**, quero ver o catálogo de automóveis com a diária, para escolher o que alugar. | Lista marca, modelo, ano, placa e valor da diária. |
| HU06 | Como **cliente**, quero criar um pedido de aluguel, para solicitar um automóvel por um período. | Data final não pode ser anterior à inicial; o valor estimado é exibido; status inicial **Em análise**. |
| HU07 | Como **cliente**, quero acompanhar o status dos meus pedidos, para saber em que etapa estão. | Vejo apenas os meus pedidos, com status e parecer quando houver. |
| HU08 | Como **cliente**, quero modificar um pedido em análise, para corrigir automóvel ou datas. | Pedidos já avaliados, cancelados ou executados não podem ser alterados por mim. |
| HU09 | Como **cliente**, quero cancelar um pedido, para desistir do aluguel. | Não é possível cancelar pedido já cancelado ou com contrato executado. |

## Agente (empresa ou banco)

| ID | História | Critérios de aceite |
|---|---|---|
| HU10 | Como **agente**, quero ver todos os pedidos e os dados financeiros do cliente, para analisá-los. | Lista mostra cliente, automóvel, período e status; detalhe mostra o rendimento total. |
| HU11 | Como **agente**, quero aprovar ou reprovar um pedido registrando um parecer, para concluir a análise financeira. | Parecer obrigatório; só pedidos em análise. |
| HU12 | Como **agente**, quero modificar um pedido, para ajustar condições combinadas com o cliente. | Não vale para pedidos cancelados ou com contrato executado. |
| HU13 | Como **agente**, quero executar o contrato de um pedido aprovado e definir quem é o proprietário do automóvel, para formalizar o aluguel. | Só após aprovação; proprietário: cliente, empresa ou banco. |
| HU14 | Como **agente banco**, quero associar um contrato de crédito ao aluguel, para financiar o cliente. | Informa valor, juros mensais e parcelas; empresas não podem conceder crédito. |
| HU15 | Como **agente**, quero cadastrar, alterar e remover automóveis, para manter o catálogo. | Placa e matrícula únicas; automóvel com pedidos vinculados não pode ser removido. |
| HU16 | Como **agente**, quero consultar os clientes cadastrados, para apoiar a análise. | Lista com identificação, profissão, empregadores e rendimento total. |
