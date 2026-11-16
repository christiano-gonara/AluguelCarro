// Cenários de uso de cada tela, mostrados na "notch" do topo da versão de demonstração.
// Cada perfil só vê os cenários dele: cliente, empresa ou banco. Mesmo conteúdo de docs/fluxos/07-cenarios.md.

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

// ---------- Quem ainda não entrou ----------

const APRESENTACAO: TelaCenarios = {
  titulo: 'Apresentação',
  cenarios: [
    c('principal', 'Clica em Criar conta', 'Abre o cadastro de cliente'),
    c('principal', 'Clica em Entrar', 'Abre o login, com as contas de exemplo'),
    c('alternativo', 'Usa o menu (O que é, Preços, Dúvidas…)', 'A página desce até a parte escolhida'),
  ],
}

const ENTRAR: TelaCenarios = {
  titulo: 'Entrar',
  cenarios: [
    c('principal', 'Entra com usuário e senha (senha demo)', 'Aparece “Que bom te ver” e abre a tela inicial do perfil'),
    c('alternativo', 'Clica numa conta de exemplo', 'Entra direto, sem digitar nada'),
    c('alternativo', 'Clica em Voltar', 'Volta pra apresentação'),
    c('erro', 'Erra a senha', '“Usuário ou senha não conferem. Confere se o Caps Lock está ligado.”'),
  ],
}

const CADASTRO: TelaCenarios = {
  titulo: 'Criar conta',
  cenarios: [
    c('principal', 'Preenche tudo e cria a conta', 'Aparece “Conta criada” e já entra no catálogo'),
    c('alternativo', 'Clica em Voltar', 'Volta pro login'),
    c('erro', 'Usa o usuário cliente.demo', '“Esse nome de usuário já está em uso. Tente outro.”'),
    c('erro', 'Usa o CPF 12345678909', '“Já tem uma conta com esse CPF. Que tal entrar?”'),
    c('erro', 'Põe um CPF com menos de 11 números', '“Alguns campos precisam de ajuste”, com o campo indicado'),
  ],
}

// ---------- Cliente ----------

const CLIENTE = {
  carros: {
    titulo: 'Carros',
    cenarios: [
      c('principal', 'Escolhe um carro e clica em Alugar', 'Abre o pedido com o carro já escolhido'),
      c('alternativo', 'Passa o mouse num carro', 'O cartão sobe de leve pra mostrar que dá pra clicar'),
    ],
  },
  novoPedido: {
    titulo: 'Novo pedido',
    cenarios: [
      c('principal', 'Escolhe as datas e envia', 'Aparece “Pedido enviado” e o pedido fica Em análise'),
      c('alternativo', 'Muda as datas de um pedido em análise', 'Aparece “Pedido alterado” e o total é recalculado'),
      c('erro', 'Põe a devolução antes da retirada', 'Aviso no próprio campo de data'),
      c('erro', 'Põe a retirada numa data que já passou', '“Alguns campos precisam de ajuste”'),
    ],
  },
  meusPedidos: {
    titulo: 'Meus pedidos',
    cenarios: [
      c('principal', 'Busca, ordena e abre um pedido', 'Vai pro detalhe do pedido'),
      c('alternativo', 'Cancela um pedido pela tabela', 'Aparece “Pedido nº … cancelado”'),
      c('alternativo', 'Entra como Lucas Pereira (Primeira vez), em Contas de exemplo', 'Tela vazia com “Escolher um carro”'),
    ],
  },
  detalhe: {
    titulo: 'Detalhe do pedido',
    cenarios: [
      c('principal', 'Abre o pedido nº 1 (em análise)', 'Vê a linha do tempo e pode mudar ou cancelar'),
      c('alternativo', 'Cancela o pedido nº 2 (aprovado)', 'Aparece “Pedido cancelado”'),
      c('alternativo', 'Abre o pedido nº 4 (recusado)', 'Vê o motivo que o parceiro escreveu'),
      c('erro', 'Tenta mudar as datas do pedido nº 2', '“Só dá pra mudar o pedido enquanto ele está em análise.”'),
      c('erro', 'Abre #/pedidos/6 (é da Marina)', '“Você não tem permissão pra fazer isso com esta conta.”'),
      c('erro', 'Abre #/pedidos/999', '“Esse pedido não existe ou foi apagado.”'),
    ],
  },
  meusDados: {
    titulo: 'Meus dados',
    cenarios: [
      c('principal', 'Muda o endereço ou a renda e salva', 'Aparece “Dados salvos”'),
      c('alternativo', 'Adiciona até 3 lugares onde trabalha', 'A renda total é somada'),
      c('erro', 'Troca o CPF para 98765432100 e salva', '“Já tem uma conta com esse CPF…”'),
      c('erro', 'Tenta apagar a conta (tem o contrato nº 3)', '“Você tem um contrato fechado, então a conta não pode ser apagada agora.”'),
    ],
  },
} satisfies Record<string, TelaCenarios>

// ---------- Empresa e banco ----------

function parceiro(banco: boolean) {
  return {
    pedidos: {
      titulo: 'Pedidos pra analisar',
      cenarios: [
        c('principal', 'Filtra por situação e abre um pedido', 'Vai pra análise do pedido'),
        c('alternativo', 'Busca pelo nome do cliente', 'A tabela filtra na hora'),
      ],
    },
    analisar: {
      titulo: banco ? 'Analisar e fechar contrato (com parcelamento)' : 'Analisar e fechar contrato',
      cenarios: [
        c('principal', 'Abre o pedido nº 1, confere a renda e aprova', 'Aparece “Pedido aprovado”'),
        c('alternativo', 'Recusa escrevendo o motivo', 'Aparece “Pedido recusado”; o cliente vê o motivo'),
        c('principal', 'Abre o pedido nº 2 (aprovado) e fecha o contrato', 'Aparece “Contrato fechado”'),
        ...(banco
          ? [
              c('principal', 'Fecha com parcelamento: valor, juros e parcelas', 'Aparece “Contrato fechado · com o parcelamento do banco”'),
              c('erro', 'Põe 0 parcelas ou mais de 120', '“Alguns campos precisam de ajuste”'),
            ]
          : [c('erro', 'Procura a opção de parcelar', 'Ela não aparece: parcelamento é só do banco')]),
        c('erro', 'Deixa o parecer em branco', '“Alguns campos precisam de ajuste”'),
        c('erro', 'Tenta avaliar um pedido já respondido', '“Esse pedido já foi respondido.”'),
      ],
    },
    carros: {
      titulo: 'Seus carros',
      cenarios: [
        c('principal', 'Busca na FIPE e cadastra', 'Diária sugerida de 0,3% e aviso “Carro cadastrado”'),
        c('alternativo', 'A FIPE não respondeu', 'Preenche marca, modelo e ano à mão'),
        c('alternativo', 'Edita a diária de um carro', 'Aparece “Carro atualizado”'),
        c('erro', 'Cadastra com a placa ABC1D23', '“Já tem um carro cadastrado com essa placa.”'),
        c('erro', banco ? 'Tenta apagar o Toyota Corolla (está em pedidos)' : 'Tenta apagar o Fiat Argo (está em pedidos)', '“Esse carro já aparece em pedidos, então não dá pra apagar.”'),
      ],
    },
    clientes: {
      titulo: 'Clientes',
      cenarios: [
        c('principal', 'Busca um cliente e confere a renda', 'Vê onde trabalha e quanto ganha por mês'),
        c('alternativo', 'Muda quantos aparecem por página', 'A tabela pagina em 10, 25 ou 50'),
      ],
    },
  } satisfies Record<string, TelaCenarios>
}

/** Cenários que valem em qualquer tela de quem já entrou. */
export const QUALQUER_TELA: TelaCenarios = {
  titulo: 'Em qualquer tela',
  cenarios: [
    c('erro', 'Abre um endereço que não existe (ex.: #/xyz)', 'Página “Essa página saiu pra dar uma volta”, com Voltar'),
    c('alternativo', 'Clica em Sair', 'Aparece “Você saiu da conta”'),
    c('alternativo', 'Troca de conta na aba Contas de exemplo, aqui na notch', 'Entra com outra conta de exemplo'),
  ],
}

/** Descobre os cenários da tela atual, só do perfil de quem entrou. */
export function cenariosDaTela(caminho: string, perfil: Perfil | null): TelaCenarios | null {
  if (caminho === '/sobre') return APRESENTACAO
  if (caminho === '/login') return ENTRAR
  if (caminho === '/registro') return CADASTRO
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
