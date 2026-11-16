// "Servidor" da versão de demonstração: roda no próprio navegador e guarda tudo no localStorage.
// Segue as mesmas regras e mensagens do back-end (PedidoService, ClienteService, UsuarioService e
// ApiExceptionHandler), pra que a tela se comporte igual à versão completa.

import { ApiError } from '../apiErro'
import type {
  Automovel,
  AutomovelRequest,
  AvaliacaoRequest,
  Cliente,
  ClienteRequest,
  ExecucaoRequest,
  Pedido,
  PedidoRequest,
  RegistroRequest,
  Usuario,
} from '../types'
import { bancoInicial } from './dados'
import type { BancoDemo, PedidoDemo, UsuarioDemo } from './dados'

const CHAVE_BANCO = 'aluga-demo-dados'
const CHAVE_SESSAO = 'aluga-demo-sessao'

// ---------- armazenamento ----------

function ler(): BancoDemo {
  try {
    const bruto = localStorage.getItem(CHAVE_BANCO)
    if (bruto) {
      const banco = JSON.parse(bruto) as BancoDemo
      if (banco.versao === bancoInicial().versao) return banco
    }
  } catch {
    // localStorage indisponível ou corrompido: começa do zero
  }
  return bancoInicial()
}

let banco = ler()

function salvar(): void {
  try {
    localStorage.setItem(CHAVE_BANCO, JSON.stringify(banco))
  } catch {
    // sem localStorage os dados valem só até fechar a aba
  }
}

function sessao(): string | null {
  try {
    return localStorage.getItem(CHAVE_SESSAO)
  } catch {
    return null
  }
}

function definirSessao(username: string | null): void {
  try {
    if (username) localStorage.setItem(CHAVE_SESSAO, username)
    else localStorage.removeItem(CHAVE_SESSAO)
  } catch {
    // ignora
  }
}

/** Volta os dados de exemplo ao começo (botão "Recomeçar" do aviso de demonstração). */
export function recomecarDemo(): void {
  banco = bancoInicial()
  salvar()
  definirSessao(null)
}

// ---------- erros no mesmo formato do ApiExceptionHandler ----------

const regra = (mensagem: string) => new ApiError(400, mensagem)
const naoEncontrado = (mensagem: string) => new ApiError(404, mensagem)
const acessoNegado = () => new ApiError(403, 'Acesso negado')
const naoLogado = () => new ApiError(401, 'Não autenticado')

function validacao(detalhes: string[]): void {
  if (detalhes.length > 0) throw new ApiError(400, 'Dados inválidos', detalhes)
}

// ---------- ajudantes ----------

/** Espera um pouquinho, pra telas de "carregando" aparecerem como na versão real. */
function esperar<T>(fn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn())
      } catch (e) {
        reject(e)
      }
    }, 250 + Math.random() * 250)
  })
}

function usuarioLogado(): UsuarioDemo {
  const nome = sessao()
  const u = banco.usuarios.find((x) => x.username === nome)
  if (!u) throw naoLogado()
  return u
}

const ehAgente = (u: UsuarioDemo) => u.perfil === 'AGENTE_EMPRESA' || u.perfil === 'AGENTE_BANCO'
const ehFinal = (p: PedidoDemo) => p.status === 'CONTRATO_EXECUTADO' || p.status === 'CANCELADO'
const agora = () => new Date().toISOString()

function exigirAgente(): UsuarioDemo {
  const u = usuarioLogado()
  if (!ehAgente(u)) throw acessoNegado()
  return u
}

function paraUsuario(u: UsuarioDemo): Usuario {
  return { username: u.username, perfil: u.perfil, clienteId: u.clienteId }
}

function paraCliente(c: BancoDemo['clientes'][number]): Cliente {
  return { ...c, rendimentoTotal: c.empregadores.reduce((s, e) => s + e.rendimento, 0) }
}

function obterCliente(id: number) {
  const c = banco.clientes.find((x) => x.id === id)
  if (!c) throw naoEncontrado('Cliente não encontrado')
  return c
}

function obterAutomovel(id: number): Automovel {
  const a = banco.automoveis.find((x) => x.id === id)
  if (!a) throw naoEncontrado('Automóvel não encontrado')
  return a
}

function obterPedido(id: number | string): PedidoDemo {
  const p = banco.pedidos.find((x) => x.id === Number(id))
  if (!p) throw naoEncontrado('Pedido não encontrado')
  return p
}

function garantirAcesso(u: UsuarioDemo, p: PedidoDemo): void {
  if (ehAgente(u)) return
  if (u.clienteId === null || p.clienteId !== u.clienteId) throw acessoNegado()
}

function dias(inicio: string, fim: string): number {
  return Math.round((Date.parse(fim) - Date.parse(inicio)) / 86_400_000) + 1
}

function paraPedido(p: PedidoDemo): Pedido {
  const cliente = paraCliente(obterCliente(p.clienteId))
  const automovel = obterAutomovel(p.automovelId)
  return {
    id: p.id,
    clienteId: p.clienteId,
    clienteNome: cliente.nome,
    clienteRendimentoTotal: cliente.rendimentoTotal,
    automovel,
    dataInicio: p.dataInicio,
    dataFim: p.dataFim,
    valorTotalEstimado: automovel.valorDiaria * dias(p.dataInicio, p.dataFim),
    status: p.status,
    parecer: p.parecer,
    propriedadeRegistrada: p.propriedadeRegistrada,
    credito: p.credito,
    criadoEm: p.criadoEm,
    atualizadoEm: p.atualizadoEm,
  }
}

function validarPeriodo(req: PedidoRequest): void {
  const detalhes: string[] = []
  if (!req.automovelId) detalhes.push('automovelId: não deve ser nulo')
  if (!req.dataInicio) detalhes.push('dataInicio: não deve ser nulo')
  if (!req.dataFim) detalhes.push('dataFim: não deve ser nulo')
  const hoje = new Date().toISOString().slice(0, 10)
  if (req.dataInicio && req.dataInicio < hoje) detalhes.push('dataInicio: deve ser hoje ou depois')
  validacao(detalhes)
  if (req.dataFim < req.dataInicio) throw regra('A data final não pode ser anterior à data inicial')
}

function validarCliente(req: ClienteRequest): void {
  const detalhes: string[] = []
  if (!req.nome?.trim()) detalhes.push('nome: não deve estar em branco')
  if (!/^\d{11}$/.test(req.cpf ?? '')) detalhes.push('cpf: CPF deve ter 11 dígitos numéricos')
  if (!req.rg?.trim()) detalhes.push('rg: não deve estar em branco')
  if (!req.endereco?.trim()) detalhes.push('endereco: não deve estar em branco')
  if (!req.profissao?.trim()) detalhes.push('profissao: não deve estar em branco')
  if ((req.empregadores ?? []).length > 3) detalhes.push('empregadores: Máximo de 3 empregadores')
  validacao(detalhes)
}

function validarAutomovel(req: AutomovelRequest): void {
  const detalhes: string[] = []
  if (!req.matricula?.trim()) detalhes.push('matricula: não deve estar em branco')
  if (!req.placa?.trim()) detalhes.push('placa: não deve estar em branco')
  if (!req.marca?.trim()) detalhes.push('marca: não deve estar em branco')
  if (!req.modelo?.trim()) detalhes.push('modelo: não deve estar em branco')
  if (!(req.valorDiaria > 0)) detalhes.push('valorDiaria: deve ser maior que 0')
  validacao(detalhes)
}

function novoId(): number {
  banco.proximoId += 1
  return banco.proximoId
}

// ---------- a "API" ----------

export const apiDemo = {
  login: (username: string, senha: string) =>
    esperar(() => {
      const u = banco.usuarios.find((x) => x.username === username.trim())
      if (!u || u.senha !== senha) throw new ApiError(401, 'Usuário ou senha inválidos')
      definirSessao(u.username)
      return paraUsuario(u)
    }),
  logout: () =>
    esperar(() => {
      definirSessao(null)
    }),
  me: () => esperar(() => paraUsuario(usuarioLogado())),
  registrar: (dados: RegistroRequest) =>
    esperar(() => {
      validacao(
        [
          (dados.username ?? '').trim().length < 3 ? 'username: tamanho deve ser entre 3 e 60' : '',
          (dados.senha ?? '').length < 6 ? 'senha: tamanho deve ser entre 6 e 72' : '',
        ].filter(Boolean),
      )
      validarCliente(dados.cliente)
      if (banco.usuarios.some((u) => u.username === dados.username.trim())) throw regra('Nome de usuário já está em uso')
      if (banco.clientes.some((c) => c.cpf === dados.cliente.cpf)) throw regra('Já existe um cliente com este CPF')
      const id = novoId()
      banco.clientes.push({ id, ...dados.cliente })
      const u: UsuarioDemo = { username: dados.username.trim(), senha: dados.senha, perfil: 'CLIENTE', clienteId: id }
      banco.usuarios.push(u)
      salvar()
      definirSessao(u.username)
      return paraUsuario(u)
    }),

  meuCadastro: () =>
    esperar(() => {
      const u = usuarioLogado()
      if (u.clienteId === null) throw naoEncontrado('Este usuário não possui cadastro de cliente')
      return paraCliente(obterCliente(u.clienteId))
    }),
  atualizarCadastro: (dados: ClienteRequest) =>
    esperar(() => {
      const u = usuarioLogado()
      if (u.clienteId === null) throw naoEncontrado('Este usuário não possui cadastro de cliente')
      validarCliente(dados)
      if (banco.clientes.some((c) => c.cpf === dados.cpf && c.id !== u.clienteId)) throw regra('Já existe um cliente com este CPF')
      const c = obterCliente(u.clienteId)
      Object.assign(c, dados)
      salvar()
      return paraCliente(c)
    }),
  excluirCadastro: () =>
    esperar(() => {
      const u = usuarioLogado()
      if (u.clienteId === null) throw regra('Apenas clientes podem excluir o próprio cadastro')
      if (banco.pedidos.some((p) => p.clienteId === u.clienteId && p.status === 'CONTRATO_EXECUTADO'))
        throw regra('Não é possível excluir o cadastro: há contrato de aluguel executado')
      banco.pedidos = banco.pedidos.filter((p) => p.clienteId !== u.clienteId)
      banco.clientes = banco.clientes.filter((c) => c.id !== u.clienteId)
      banco.usuarios = banco.usuarios.filter((x) => x.username !== u.username)
      salvar()
      definirSessao(null)
    }),
  listarClientes: () =>
    esperar(() => {
      exigirAgente()
      return banco.clientes.map(paraCliente)
    }),

  listarAutomoveis: () =>
    esperar(() => {
      usuarioLogado()
      return [...banco.automoveis]
    }),
  criarAutomovel: (dados: AutomovelRequest) =>
    esperar(() => {
      exigirAgente()
      validarAutomovel(dados)
      if (banco.automoveis.some((a) => a.placa === dados.placa)) throw regra('Já existe um automóvel com esta placa')
      if (banco.automoveis.some((a) => a.matricula === dados.matricula)) throw regra('Já existe um automóvel com esta matrícula')
      const a: Automovel = { id: novoId(), ...dados }
      banco.automoveis.push(a)
      salvar()
      return a
    }),
  atualizarAutomovel: (id: number, dados: AutomovelRequest) =>
    esperar(() => {
      exigirAgente()
      validarAutomovel(dados)
      const a = obterAutomovel(id)
      if (banco.automoveis.some((x) => x.placa === dados.placa && x.id !== id)) throw regra('Já existe um automóvel com esta placa')
      if (banco.automoveis.some((x) => x.matricula === dados.matricula && x.id !== id))
        throw regra('Já existe um automóvel com esta matrícula')
      Object.assign(a, dados)
      salvar()
      return a
    }),
  excluirAutomovel: (id: number) =>
    esperar(() => {
      exigirAgente()
      obterAutomovel(id)
      if (banco.pedidos.some((p) => p.automovelId === id)) throw regra('Automóvel está vinculado a pedidos de aluguel')
      banco.automoveis = banco.automoveis.filter((a) => a.id !== id)
      salvar()
    }),

  listarPedidos: () =>
    esperar(() => {
      const u = usuarioLogado()
      const lista = ehAgente(u) ? banco.pedidos : banco.pedidos.filter((p) => p.clienteId === u.clienteId)
      return [...lista].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).map(paraPedido)
    }),
  buscarPedido: (id: number | string) =>
    esperar(() => {
      const u = usuarioLogado()
      const p = obterPedido(id)
      garantirAcesso(u, p)
      return paraPedido(p)
    }),
  criarPedido: (dados: PedidoRequest) =>
    esperar(() => {
      const u = usuarioLogado()
      if (u.clienteId === null) throw acessoNegado()
      validarPeriodo(dados)
      obterAutomovel(dados.automovelId)
      const p: PedidoDemo = {
        id: novoId(),
        clienteId: u.clienteId,
        automovelId: dados.automovelId,
        dataInicio: dados.dataInicio,
        dataFim: dados.dataFim,
        status: 'EM_ANALISE',
        parecer: null,
        propriedadeRegistrada: null,
        credito: null,
        criadoEm: agora(),
        atualizadoEm: agora(),
      }
      banco.pedidos.push(p)
      salvar()
      return paraPedido(p)
    }),
  modificarPedido: (id: number | string, dados: PedidoRequest) =>
    esperar(() => {
      const u = usuarioLogado()
      const p = obterPedido(id)
      garantirAcesso(u, p)
      if (ehFinal(p)) throw regra(`Pedido ${p.status} não pode ser modificado`)
      if (!ehAgente(u) && p.status !== 'EM_ANALISE') throw regra('O cliente só pode modificar pedidos em análise')
      validarPeriodo(dados)
      obterAutomovel(dados.automovelId)
      Object.assign(p, { automovelId: dados.automovelId, dataInicio: dados.dataInicio, dataFim: dados.dataFim, atualizadoEm: agora() })
      salvar()
      return paraPedido(p)
    }),
  cancelarPedido: (id: number) =>
    esperar(() => {
      const u = usuarioLogado()
      const p = obterPedido(id)
      if (u.perfil !== 'CLIENTE') throw acessoNegado()
      garantirAcesso(u, p)
      if (ehFinal(p)) throw regra(`Pedido já está ${p.status}`)
      p.status = 'CANCELADO'
      p.atualizadoEm = agora()
      salvar()
      return paraPedido(p)
    }),
  avaliarPedido: (id: number, dados: AvaliacaoRequest) =>
    esperar(() => {
      exigirAgente()
      const p = obterPedido(id)
      validacao(!dados.parecer?.trim() ? ['parecer: não deve estar em branco'] : [])
      if (p.status !== 'EM_ANALISE') throw regra('Somente pedidos em análise podem ser avaliados')
      p.status = dados.aprovado ? 'APROVADO_FINANCEIRAMENTE' : 'REPROVADO'
      p.parecer = dados.parecer.trim()
      p.atualizadoEm = agora()
      salvar()
      return paraPedido(p)
    }),
  executarPedido: (id: number, dados: ExecucaoRequest) =>
    esperar(() => {
      const agente = exigirAgente()
      const p = obterPedido(id)
      if (p.status !== 'APROVADO_FINANCEIRAMENTE')
        throw regra('O contrato só pode ser executado após parecer financeiro positivo')
      if (dados.credito) {
        if (agente.perfil !== 'AGENTE_BANCO') throw acessoNegado()
        p.credito = { banco: agente.username, ...dados.credito }
      }
      p.propriedadeRegistrada = dados.propriedade
      p.status = 'CONTRATO_EXECUTADO'
      p.atualizadoEm = agora()
      salvar()
      return paraPedido(p)
    }),
}
