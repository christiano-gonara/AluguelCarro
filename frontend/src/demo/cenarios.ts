// Cenários de uso de cada tela, mostrados na "notch" do topo da versão de demonstração.
// A notch só aparece depois do login e cada perfil vê apenas os cenários dele: cliente, empresa ou banco.
// Mesmo conteúdo de docs/fluxos/07-cenarios.md.

import type { Perfil } from '../types'

export type TipoCenario = 'principal' | 'alternativo' | 'erro'

export interface Cenario {
  tipo: TipoCenario
  acao: string
  resultado: string
}

export interface TelaCenarios {
  titulo: string
  cenarios: Cenario[]
}

const c = (tipo: TipoCenario, acao: string, resultado: string): Cenario => ({ tipo, acao, resultado })

export const ROTULO_PERFIL: Record<Perfil, string> = {
  CLIENTE: 'Cliente',
  AGENTE_EMPRESA: 'Empresa',
  AGENTE_BANCO: 'Banco',
}

// ---------- Cliente ----------

const CLIENTE = {
  carros: {
    titulo: 'Carros disponíveis',
    cenarios: [
      c('principal', 'Escolhe um carro e clica em Alugar', 'Abre o pedido com o carro já escolhido e a diária na tela'),
      c('alternativo', 'Passa o mouse num carro', 'O cartão sobe de leve pra mostrar que dá pra clicar'),
      c('alternativo', 'Confere o dono de cada carro', 'O rodapé do cartão diz se é de uma empresa ou de um banco'),
    ],
  },
  novoPedido: {
    titulo: 'Novo pedido',
    cenarios: [
      c('principal', 'Escolhe as datas e envia', '“Pedido enviado”; ele nasce Em análise'),
      c('alternativo', 'Troca o carro antes de enviar', 'O total do lado direito é recalculado na hora'),
      c('alternativo', 'Abre um pedido em análise e muda as datas', '“Pedido alterado”; o total é recalculado'),
      c('erro', 'Põe a devolução antes da retirada', 'O próprio campo avisa: “A devolução tem que ser depois da retirada.”'),
      c('erro', 'Tenta enviar sem escolher o carro', '“Alguns campos precisam de ajuste”, com o campo indicado'),
    ],
  },
  meusPedidos: {
    titulo: 'Meus pedidos',
    cenarios: [
      c('principal', 'Busca, ordena e abre um pedido', 'Vai pro detalhe, com a linha do tempo do pedido'),
      c('alternativo', 'Abre a setinha de um pedido', 'Vê total, placa e quem aprova sem sair da lista'),
      c('alternativo', 'Cancela um pedido pela tabela', 'Pede confirmação e mostra “Pedido nº … cancelado”'),
      c('alternativo', 'Muda quantos pedidos aparecem por página', 'A tabela pagina em 10, 25 ou 50 linhas'),
      c('alternativo', 'Troca pra conta do Lucas Pereira (Primeira vez)', 'Tela vazia com o botão “Escolher um carro”'),
    ],
  },
  detalhe: {
    titulo: 'Detalhe do pedido',
    cenarios: [
      c('principal', 'Abre o pedido nº 1 (em análise)', 'Vê a linha do tempo e pode mudar as datas ou cancelar'),
      c('principal', 'Abre o pedido nº 3 (contrato fechado)', 'Vê o parcelamento do banco e em nome de quem o carro ficou'),
      c('alternativo', 'Abre o pedido nº 4 (recusado)', 'Vê o motivo que o parceiro escreveu'),
      c('alternativo', 'Abre o pedido nº 5 (cancelado)', 'Vê o atalho “Pedir este carro de novo”'),
      c('erro', 'Tenta mudar as datas do pedido nº 2', '“Só dá pra mudar o pedido enquanto ele está em análise.”'),
      c('erro', 'Abre #/pedidos/6 (é da Marina)', '“Você não tem permissão pra fazer isso com esta conta.”'),
      c('erro', 'Abre #/pedidos/999', '“Esse pedido não existe ou foi apagado.”'),
    ],
  },
  meusDados: {
    titulo: 'Meus dados',
    cenarios: [
      c('principal', 'Muda o endereço ou a renda e salva', 'Aparece “Dados salvos”'),
      c('alternativo', 'Adiciona até 3 empregadores', 'A renda total é somada e passa a valer na análise'),
      c('alternativo', 'Remove um dos empregadores', 'A renda total diminui na hora'),
      c('erro', 'Troca o CPF para 98765432100 e salva', '“Já tem uma conta com esse CPF…”'),
      c('erro', 'Tenta apagar a conta (tem o contrato nº 3)', '“Você tem um contrato fechado, então a conta não pode ser apagada agora.”'),
    ],
  },
} satisfies Record<string, TelaCenarios>

// ---------- Empresa e banco ----------

function parceiro(banco: boolean) {
  return {
    pedidos: {
      titulo: 'Fila de pedidos',
      cenarios: [
        c('principal', 'Abre a fila de pedidos', 'Vê cliente, renda por mês, carro, período e situação'),
        c('alternativo', 'Busca pelo nome do cliente', 'A tabela filtra enquanto digita'),
        c('alternativo', 'Abre a setinha de um pedido', 'Vê renda, total e placa ali mesmo, sem abrir o pedido'),
        c('alternativo', 'Ordena por renda ou por total', 'Dá pra ver quem tem mais folga financeira primeiro'),
        c('alternativo', 'Muda quantos pedidos aparecem por página', 'A tabela pagina em 10, 25 ou 50 linhas'),
        c('alternativo', 'Abre um pedido em análise', 'O botão vira “Analisar”, levando pro detalhe'),
      ],
    },
    analisar: {
      titulo: banco ? 'Análise, contrato e crédito' : 'Análise e contrato',
      cenarios: [
        c('principal', 'Aprova o pedido nº 1 escrevendo o parecer', '“Pedido aprovado”; o cliente vê o motivo'),
        c('alternativo', 'Recusa o pedido nº 6 escrevendo o motivo', '“Pedido recusado”; o cliente vê o motivo'),
        c('principal', 'Fecha o contrato do pedido nº 2', 'Escolhe em nome de quem o carro fica e vê “Contrato fechado”'),
        ...(banco
          ? [
              c('principal', 'Marca “Oferecer parcelamento do banco”', 'Preenche valor, juros e parcelas; o contrato fica com o crédito'),
              c('alternativo', 'Abre o pedido nº 3 (já fechado)', 'Vê o parcelamento que o banco concedeu'),
              c('erro', 'Põe 0 parcelas ou mais de 120', '“Alguns campos precisam de ajuste”'),
            ]
          : [
              c('alternativo', 'Procura a opção de parcelar', 'Ela não aparece: parcelamento é só do banco'),
            ]),
        c('erro', 'Deixa o parecer em branco', 'Aprovar e Recusar ficam desligados até escrever algo'),
        c('erro', 'Tenta avaliar um pedido já respondido', '“Esse pedido já foi respondido.”'),
      ],
    },
    carros: {
      titulo: banco ? 'Carros do banco' : 'Carros da empresa',
      cenarios: [
        c('principal', 'Busca marca, modelo e ano na FIPE', 'O resto é preenchido e a diária sugerida é 0,3% do valor FIPE'),
        c('alternativo', 'Edita a diária de um carro', '“Carro atualizado”; o catálogo do cliente muda junto'),
        c('alternativo', 'Cadastra um carro novo e depois apaga', '“Carro apagado”; ele some do catálogo'),
        c('alternativo', 'A FIPE não respondeu', 'Dá pra preencher marca, modelo e ano à mão'),
        c('erro', 'Usa a placa ABC1D23', '“Já tem um carro cadastrado com essa placa.”'),
        c(
          'erro',
          banco ? 'Tenta apagar o Toyota Corolla (tem pedidos)' : 'Tenta apagar o Fiat Argo (tem pedidos)',
          '“Esse carro já aparece em pedidos, então não dá pra apagar.”',
        ),
        c('erro', 'Cadastra com a diária zerada', '“Alguns campos precisam de ajuste”'),
      ],
    },
    clientes: {
      titulo: 'Clientes',
      cenarios: [
        c('principal', 'Busca um cliente pelo nome', 'Vê profissão, empregadores e renda total por mês'),
        c('alternativo', 'Ordena por renda', 'Do maior pro menor'),
        c('alternativo', 'Confere o CPF na tabela', 'Aparece mascarado (***.456.789-**) pra proteger a pessoa'),
        c('alternativo', 'Muda quantos clientes aparecem por página', 'A tabela pagina em 10, 25 ou 50 linhas'),
        c('erro', 'Busca por um nome que não existe', '“Nenhum cliente encontrado com essa busca.”'),
      ],
    },
  } satisfies Record<string, TelaCenarios>
}

/** Cenários que valem em qualquer tela de quem já entrou. */
export const QUALQUER_TELA: TelaCenarios = {
  titulo: 'Em qualquer tela',
  cenarios: [
    c('erro', 'Abre um endereço que não existe (ex.: #/xyz)', 'Página “Essa página saiu pra dar uma volta”, com Voltar'),
    c('erro', 'Abre uma tela do outro perfil (ex.: #/clientes como cliente)', 'O sistema volta pra tela inicial do seu perfil'),
    c('alternativo', 'Troca de conta na aba Contas de exemplo, aqui na notch', 'Entra com outra conta de exemplo, sem sair'),
    c('alternativo', 'Clica em Sistema, no rodapé', 'Vê as mensagens do sistema e as telas de exceção, cada uma na sua categoria'),
    c('alternativo', 'Clica em Sair', 'Aparece “Você saiu da conta” e volta pra apresentação'),
  ],
}

/** Descobre os cenários da tela atual, só do perfil de quem entrou. */
export function cenariosDaTela(caminho: string, perfil: Perfil | null): TelaCenarios | null {
  if (!perfil) return null
  if (perfil === 'CLIENTE') {
    if (caminho === '/') return CLIENTE.carros
    if (caminho === '/pedidos') return CLIENTE.meusPedidos
    if (caminho === '/pedidos/novo' || /^\/pedidos\/\d+\/editar$/.test(caminho)) return CLIENTE.novoPedido
    if (/^\/pedidos\/\d+$/.test(caminho)) return CLIENTE.detalhe
    if (caminho === '/meus-dados') return CLIENTE.meusDados
    return null
  }
  const p = parceiro(perfil === 'AGENTE_BANCO')
  if (caminho === '/' || caminho === '/pedidos') return p.pedidos
  if (/^\/pedidos\/\d+/.test(caminho)) return p.analisar
  if (caminho === '/automoveis') return p.carros
  if (caminho === '/clientes') return p.clientes
  return null
}
