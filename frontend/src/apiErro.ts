// Erro devolvido pela API, no formato do ApiExceptionHandler do back-end: { mensagem, detalhes }.

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
