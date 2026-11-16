# Cenários de cada fluxo

Cada fluxo tem três tipos de cenário:

- ✅ **principal**: tudo dá certo, o caminho mais comum
- 🔀 **alternativo**: a pessoa faz outra escolha, mas ainda chega num resultado válido
- ⚠️ **de erro**: algo impede a ação, e a tela precisa explicar o que houve

Todos podem ser testados na versão de demonstração (GitHub Pages), que já vem com dados de exemplo. A senha das contas de exemplo é `demo`.

| Conta | Quem é | O que já tem |
|---|---|---|
| `cliente.demo` | cliente | um pedido em cada situação (nº 1 a 5) |
| `marina.souza` | outra cliente | um pedido em análise (nº 6) |
| `lucas.pereira` | cliente que acabou de chegar | nenhum pedido ainda (telas vazias) |
| `agente.empresa` | empresa parceira | carros Argo, Onix e HB20 |
| `agente.banco` | banco parceiro | carros Corolla, T-Cross e Compass |

No topo de cada tela da demonstração tem a aba verde **Cenários de uso**. Ela abre uma janelinha com duas abas: **Contas de exemplo** (um cartão por conta, com os números dela; um clique troca de conta e a atual fica marcada com “Você está aqui”) e **O que testar nesta tela** (os cenários daquela tela, só do perfil de quem entrou: cliente, empresa ou banco). O botão **Recomeçar**, na faixa da demonstração, volta tudo ao começo.

---

## 1. Entrar e criar conta

| # | Tipo | Dado que… | Quando… | Então… |
|---|---|---|---|---|
| 1.1 | ✅ | a pessoa tem conta | entra com usuário e senha certos | vê "Que bom te ver" e vai pra tela inicial do perfil dela |
| 1.2 | ✅ | a pessoa não tem conta | preenche o cadastro e clica em "Criar minha conta" | vê "Conta criada" e já entra no catálogo |
| 1.3 | 🔀 | a pessoa está no login | clica numa conta de exemplo | entra direto, sem digitar nada |
| 1.4 | 🔀 | a pessoa está no login ou no cadastro | clica em "Voltar" | volta pra tela anterior (apresentação ou login) |
| 1.5 | ⚠️ | a pessoa errou a senha | tenta entrar | vê "Usuário ou senha não conferem. Confere se o Caps Lock está ligado." |
| 1.6 | ⚠️ | já existe alguém com aquele usuário | tenta criar a conta | vê "Esse nome de usuário já está em uso. Tente outro." |
| 1.7 | ⚠️ | o CPF já foi usado (ex.: `12345678909`) | tenta criar a conta | vê "Já tem uma conta com esse CPF. Que tal entrar?" |
| 1.8 | ⚠️ | o CPF tem menos de 11 números | tenta criar a conta | vê "Alguns campos precisam de ajuste" com o campo indicado |
| 1.9 | ⚠️ | a pessoa ficou um tempo sem usar | a sessão acaba e ela tenta algo | vê "Sua sessão acabou" e volta pra apresentação |

## 2. Jornada do cliente (pedido)

| # | Tipo | Dado que… | Quando… | Então… |
|---|---|---|---|---|
| 2.1 | ✅ | o cliente está no catálogo | escolhe um carro, as datas e envia | vê "Pedido enviado" e o pedido aparece **Em análise** |
| 2.2 | 🔀 | o pedido está em análise (nº 1) | muda as datas | vê "Pedido alterado" e o valor total é recalculado |
| 2.3 | 🔀 | o pedido está em análise, aprovado ou recusado (nº 1, 2 ou 4) | cancela e confirma | vê "Pedido cancelado" e o selo muda pra **Cancelado** |
| 2.4 | 🔀 | o cliente ainda não fez nenhum pedido (`lucas.pereira`) | abre "Meus pedidos" | vê a tela vazia com o botão pra escolher um carro |
| 2.5 | ⚠️ | a devolução está antes da retirada | tenta enviar | vê "A devolução está antes da retirada…" no próprio formulário |
| 2.6 | ⚠️ | a data de retirada já passou | tenta enviar | vê "Alguns campos precisam de ajuste" |
| 2.7 | ⚠️ | o pedido já foi aprovado (nº 2) | tenta mudar as datas | vê "Só dá pra mudar o pedido enquanto ele está em análise." |
| 2.8 | ⚠️ | o pedido já terminou (nº 3 ou 5) | tenta cancelar | o botão não aparece; se tentar pela API, vê "Esse pedido já foi encerrado…" |
| 2.9 | ⚠️ | o pedido é de outra pessoa (nº 6) | abre `/#/pedidos/6` | vê "Você não tem permissão pra fazer isso com esta conta." |

## 3. Meus dados

| # | Tipo | Dado que… | Quando… | Então… |
|---|---|---|---|---|
| 3.1 | ✅ | o cliente está em "Meus dados" | muda o endereço ou a renda e salva | vê "Dados salvos" |
| 3.2 | 🔀 | o cliente tem até 3 fontes de renda | adiciona ou remove uma | a renda total é recalculada |
| 3.3 | ⚠️ | o CPF novo já é de outra pessoa (`98765432100`) | salva | vê "Já tem uma conta com esse CPF…" |
| 3.4 | ⚠️ | o cliente tem um contrato fechado (nº 3) | tenta apagar a conta | vê "Você tem um contrato fechado, então a conta não pode ser apagada agora." |
| 3.5 | ✅ | o cliente não tem contrato fechado (crie uma conta nova) | apaga a conta e confirma | vê "Conta apagada" e volta pra apresentação |

## 4. Fluxo do parceiro (empresa ou banco)

| # | Tipo | Dado que… | Quando… | Então… |
|---|---|---|---|---|
| 4.1 | ✅ | há um pedido em análise (nº 1 ou 6) | aprova com um parecer | vê "Pedido aprovado" e o selo muda pra **Aprovado** |
| 4.2 | 🔀 | há um pedido em análise | recusa com um motivo | vê "Pedido recusado"; o cliente vê o motivo no detalhe |
| 4.3 | ✅ | o pedido está aprovado (nº 2) | fecha o contrato | vê "Contrato fechado" |
| 4.4 | 🔀 | é o banco e o pedido está aprovado | fecha o contrato com parcelamento | vê "Contrato fechado · com o parcelamento do banco" |
| 4.5 | 🔀 | não há pedidos na fila | abre "Pedidos" | vê a tela vazia explicando que os pedidos aparecem ali |
| 4.6 | ⚠️ | o parecer está em branco | tenta aprovar ou recusar | vê "Alguns campos precisam de ajuste" |
| 4.7 | ⚠️ | é a empresa (não o banco) | tenta fechar com parcelamento | a opção não aparece; se tentar pela API, vê "Você não tem permissão…" |
| 4.8 | ⚠️ | o pedido já foi respondido | tenta avaliar de novo | vê "Esse pedido já foi respondido." |

## 5. Carros do parceiro

| # | Tipo | Dado que… | Quando… | Então… |
|---|---|---|---|---|
| 5.1 | ✅ | o parceiro está em "Carros" | escolhe marca, modelo e ano na FIPE e salva | vê "Carro cadastrado"; a diária sugerida é 0,3% do valor FIPE |
| 5.2 | 🔀 | a Tabela FIPE não respondeu | preenche os dados à mão | o carro é salvo normalmente |
| 5.3 | 🔀 | o carro já existe | edita a diária e salva | vê "Carro atualizado" |
| 5.4 | ✅ | o carro não aparece em nenhum pedido (cadastre um novo) | apaga e confirma | vê "Carro apagado" |
| 5.5 | ⚠️ | a placa já está cadastrada (ex.: `ABC1D23`) | tenta salvar | vê "Já tem um carro cadastrado com essa placa." |
| 5.6 | ⚠️ | o carro aparece em pedidos (ex.: Argo) | tenta apagar | vê "Esse carro já aparece em pedidos, então não dá pra apagar." |

## 6. Endereços e páginas

| # | Tipo | Dado que… | Quando… | Então… |
|---|---|---|---|---|
| 6.1 | ⚠️ | o endereço não existe (ex.: `/#/qualquer-coisa`) | a página abre | vê a tela 404 "Essa página saiu pra dar uma volta", com **Voltar** e **Ir pro começo** |
| 6.2 | ⚠️ | o endereço está fora do site (ex.: `/AluguelCarro/xyz`) | o GitHub Pages responde | mostra a mesma página 404, no visual do site |
| 6.3 | ⚠️ | o pedido não existe (ex.: `/#/pedidos/999`) | o detalhe abre | vê "Esse pedido não existe ou foi apagado." |
| 6.4 | ⚠️ | a pessoa não entrou | abre uma tela que exige login | vai pra apresentação |
| 6.5 | ⚠️ | é cliente | abre uma tela de parceiro (ex.: `/#/clientes`) | volta pra tela inicial dele |
