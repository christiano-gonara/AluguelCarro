// Dados de exemplo da versão de demonstração (GitHub Pages).
// Espelham o DataSeeder do back-end e trazem um pedido em cada situação, pra todos os cenários de docs/fluxos poderem ser testados.

import type { Automovel, Cliente, Perfil, StatusPedido, TipoProprietario } from '../types'

export interface UsuarioDemo {
  username: string
  senha: string
  perfil: Perfil
  clienteId: number | null
}

export interface PedidoDemo {
  id: number
  clienteId: number
  automovelId: number
  dataInicio: string
  dataFim: string
  status: StatusPedido
  parecer: string | null
  propriedadeRegistrada: TipoProprietario | null
  credito: { banco: string; valor: number; taxaJurosMensal: number; parcelas: number } | null
  criadoEm: string
  atualizadoEm: string
}

export interface BancoDemo {
  versao: number
  proximoId: number
  usuarios: UsuarioDemo[]
  clientes: Omit<Cliente, 'rendimentoTotal'>[]
  automoveis: Automovel[]
  pedidos: PedidoDemo[]
}

/** Senha das contas de exemplo. Aparece na tela de login, já que aqui nada é de verdade. */
export const SENHA_DEMO = 'demo'

function dia(deslocamento: number): string {
  const d = new Date()
  d.setDate(d.getDate() + deslocamento)
  return d.toISOString().slice(0, 10)
}

function instante(diasAtras: number): string {
  return new Date(Date.now() - diasAtras * 86_400_000).toISOString()
}

export function bancoInicial(): BancoDemo {
  const pedido = (
    id: number,
    clienteId: number,
    automovelId: number,
    inicio: number,
    fim: number,
    status: StatusPedido,
    criado: number,
    extra: Partial<PedidoDemo> = {},
  ): PedidoDemo => ({
    id,
    clienteId,
    automovelId,
    dataInicio: dia(inicio),
    dataFim: dia(fim),
    status,
    parecer: null,
    propriedadeRegistrada: null,
    credito: null,
    criadoEm: instante(criado),
    atualizadoEm: instante(Math.max(0, criado - 1)),
    ...extra,
  })

  return {
    versao: 1,
    proximoId: 100,
    usuarios: [
      { username: 'cliente.demo', senha: SENHA_DEMO, perfil: 'CLIENTE', clienteId: 1 },
      { username: 'agente.empresa', senha: SENHA_DEMO, perfil: 'AGENTE_EMPRESA', clienteId: null },
      { username: 'agente.banco', senha: SENHA_DEMO, perfil: 'AGENTE_BANCO', clienteId: null },
      { username: 'marina.souza', senha: SENHA_DEMO, perfil: 'CLIENTE', clienteId: 2 },
    ],
    clientes: [
      {
        id: 1,
        rg: 'MG-12.345.678',
        cpf: '12345678909',
        nome: 'Cliente de Demonstração',
        endereco: 'Rua das Acácias, 120 · Contagem, MG',
        profissao: 'Analista de sistemas',
        empregadores: [{ entidade: 'Empresa Exemplo Ltda.', rendimento: 6500 }],
      },
      {
        id: 2,
        rg: 'MG-98.765.432',
        cpf: '98765432100',
        nome: 'Marina Souza',
        endereco: 'Av. Afonso Pena, 1500 · Belo Horizonte, MG',
        profissao: 'Designer',
        empregadores: [
          { entidade: 'Estúdio Linha Ltda.', rendimento: 4200 },
          { entidade: 'Freelas', rendimento: 1300 },
        ],
      },
    ],
    automoveis: [
      { id: 1, matricula: 'MAT-0001', ano: 2024, marca: 'Fiat', modelo: 'Argo', placa: 'ABC1D23', valorDiaria: 180, tipoProprietario: 'EMPRESA' },
      { id: 2, matricula: 'MAT-0002', ano: 2023, marca: 'Chevrolet', modelo: 'Onix', placa: 'DEF4G56', valorDiaria: 170, tipoProprietario: 'EMPRESA' },
      { id: 3, matricula: 'MAT-0003', ano: 2025, marca: 'Toyota', modelo: 'Corolla', placa: 'GHI7J89', valorDiaria: 320, tipoProprietario: 'BANCO' },
      { id: 4, matricula: 'MAT-0004', ano: 2022, marca: 'Volkswagen', modelo: 'T-Cross', placa: 'JKL0M12', valorDiaria: 260, tipoProprietario: 'BANCO' },
      { id: 5, matricula: 'MAT-0005', ano: 2024, marca: 'Hyundai', modelo: 'HB20', placa: 'MNO3P45', valorDiaria: 175, tipoProprietario: 'EMPRESA' },
      { id: 6, matricula: 'MAT-0006', ano: 2024, marca: 'Jeep', modelo: 'Compass', placa: 'QRS6T78', valorDiaria: 340, tipoProprietario: 'BANCO' },
    ],
    pedidos: [
      pedido(1, 1, 3, 5, 8, 'EM_ANALISE', 1),
      pedido(2, 1, 1, 12, 15, 'APROVADO_FINANCEIRAMENTE', 4, { parecer: 'Renda compatível com o valor do aluguel.' }),
      pedido(3, 1, 6, -20, -14, 'CONTRATO_EXECUTADO', 30, {
        parecer: 'Renda confere. Parcelamento liberado.',
        propriedadeRegistrada: 'BANCO',
        credito: { banco: 'agente.banco', valor: 2380, taxaJurosMensal: 1.9, parcelas: 6 },
      }),
      pedido(4, 1, 2, -5, -3, 'REPROVADO', 10, { parecer: 'A renda informada não cobre o valor das diárias neste período.' }),
      pedido(5, 1, 5, -40, -38, 'CANCELADO', 45),
      pedido(6, 2, 4, 3, 6, 'EM_ANALISE', 0),
    ],
  }
}
