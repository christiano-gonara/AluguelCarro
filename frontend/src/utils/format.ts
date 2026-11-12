import type { StatusPedido } from '../types'

export function moeda(valor: number | string | null | undefined): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor ?? 0))
}

/** Converte 2026-11-12 em 12/11/2026. */
export function dataBR(iso: string | null | undefined): string {
  return iso ? iso.split('-').reverse().join('/') : ''
}

export const STATUS_ROTULO: Record<StatusPedido, string> = {
  EM_ANALISE: 'Em análise',
  APROVADO_FINANCEIRAMENTE: 'Aprovado financeiramente',
  REPROVADO: 'Reprovado',
  CONTRATO_EXECUTADO: 'Contrato executado',
  CANCELADO: 'Cancelado',
}
