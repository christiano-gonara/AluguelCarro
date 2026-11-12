// Tipos que espelham os DTOs da API (backend/src/main/java/br/com/aluguelcarro/dto/Dtos.java).

export type Perfil = 'CLIENTE' | 'AGENTE_EMPRESA' | 'AGENTE_BANCO'

export type StatusPedido =
  | 'EM_ANALISE'
  | 'APROVADO_FINANCEIRAMENTE'
  | 'REPROVADO'
  | 'CONTRATO_EXECUTADO'
  | 'CANCELADO'

export type TipoProprietario = 'CLIENTE' | 'EMPRESA' | 'BANCO'

export interface Usuario {
  username: string
  perfil: Perfil
  clienteId: number | null
}

export interface Empregador {
  entidade: string
  rendimento: number
}

export interface ClienteRequest {
  rg: string
  cpf: string
  nome: string
  endereco: string
  profissao: string
  empregadores: Empregador[]
}

export interface Cliente extends ClienteRequest {
  id: number
  rendimentoTotal: number
}

export interface RegistroRequest {
  username: string
  senha: string
  cliente: ClienteRequest
}

export interface AutomovelRequest {
  matricula: string
  ano: number
  marca: string
  modelo: string
  placa: string
  valorDiaria: number
  tipoProprietario: TipoProprietario
}

export interface Automovel extends AutomovelRequest {
  id: number
}

export interface PedidoRequest {
  automovelId: number
  dataInicio: string
  dataFim: string
}

export interface AvaliacaoRequest {
  aprovado: boolean
  parecer: string
}

export interface CreditoRequest {
  valor: number
  taxaJurosMensal: number
  parcelas: number
}

export interface ExecucaoRequest {
  propriedade: TipoProprietario
  credito: CreditoRequest | null
}

export interface CreditoPedido {
  banco: string
  valor: number
  taxaJurosMensal: number
  parcelas: number
}

export interface Pedido {
  id: number
  clienteId: number
  clienteNome: string
  clienteRendimentoTotal: number
  automovel: Automovel
  dataInicio: string
  dataFim: string
  valorTotalEstimado: number
  status: StatusPedido
  parecer: string | null
  propriedadeRegistrada: TipoProprietario | null
  credito: CreditoPedido | null
  criadoEm: string
  atualizadoEm: string
}

// Estado dos formulários: campos numéricos ficam como texto até o envio.

export interface EmpregadorForm {
  entidade: string
  rendimento: string
}

export interface ClienteForm {
  rg: string
  cpf: string
  nome: string
  endereco: string
  profissao: string
  empregadores: EmpregadorForm[]
}
