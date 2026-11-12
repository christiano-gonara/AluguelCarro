// Cliente HTTP da API. A sessão é mantida pelo cookie JSESSIONID (credentials: 'include').

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
} from './types'

export class ApiError extends Error {
  readonly status: number
  readonly detalhes: string[]

  constructor(status: number, mensagem: string, detalhes: string[] = []) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
    this.detalhes = detalhes
  }
}

/** Garante um Error em blocos catch, onde o valor capturado é unknown. */
export function paraErro(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e))
}

let aoPerderSessao: () => void = () => {}

export function definirAoPerderSessao(fn: () => void): void {
  aoPerderSessao = fn
}

interface CorpoErro {
  mensagem?: string
  detalhes?: string[]
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const resp = await fetch(url, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (resp.status === 204) return undefined as unknown as T

  let dados: unknown = null
  const texto = await resp.text()
  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      dados = null
    }
  }

  if (!resp.ok) {
    // 401 fora da tela de login significa sessão expirada
    if (resp.status === 401 && !url.endsWith('/api/auth/login')) aoPerderSessao()
    const erro = (dados ?? {}) as CorpoErro
    throw new ApiError(resp.status, erro.mensagem ?? `Erro inesperado (${resp.status})`, erro.detalhes ?? [])
  }
  return dados as T
}

export const api = {
  login: (username: string, senha: string) => request<Usuario>('POST', '/api/auth/login', { username, senha }),
  logout: () => request<void>('POST', '/api/auth/logout'),
  me: () => request<Usuario>('GET', '/api/auth/me'),
  registrar: (dados: RegistroRequest) => request<Usuario>('POST', '/api/auth/registro', dados),

  meuCadastro: () => request<Cliente>('GET', '/api/clientes/me'),
  atualizarCadastro: (dados: ClienteRequest) => request<Cliente>('PUT', '/api/clientes/me', dados),
  excluirCadastro: () => request<void>('DELETE', '/api/clientes/me'),
  listarClientes: () => request<Cliente[]>('GET', '/api/clientes'),

  listarAutomoveis: () => request<Automovel[]>('GET', '/api/automoveis'),
  criarAutomovel: (dados: AutomovelRequest) => request<Automovel>('POST', '/api/automoveis', dados),
  atualizarAutomovel: (id: number, dados: AutomovelRequest) =>
    request<Automovel>('PUT', `/api/automoveis/${id}`, dados),
  excluirAutomovel: (id: number) => request<void>('DELETE', `/api/automoveis/${id}`),

  listarPedidos: () => request<Pedido[]>('GET', '/api/pedidos'),
  buscarPedido: (id: number | string) => request<Pedido>('GET', `/api/pedidos/${id}`),
  criarPedido: (dados: PedidoRequest) => request<Pedido>('POST', '/api/pedidos', dados),
  modificarPedido: (id: number | string, dados: PedidoRequest) =>
    request<Pedido>('PUT', `/api/pedidos/${id}`, dados),
  cancelarPedido: (id: number) => request<Pedido>('POST', `/api/pedidos/${id}/cancelar`),
  avaliarPedido: (id: number, dados: AvaliacaoRequest) =>
    request<Pedido>('POST', `/api/pedidos/${id}/avaliar`, dados),
  executarPedido: (id: number, dados: ExecucaoRequest) =>
    request<Pedido>('POST', `/api/pedidos/${id}/executar`, dados),
}
