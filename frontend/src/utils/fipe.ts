// Cliente da API pública da Tabela FIPE (https://deividfortuna.github.io/fipe/).
// Em desenvolvimento as chamadas passam pelo proxy /fipe do Vite (vite.config.ts).

export interface FipeItem {
  codigo: string
  nome: string
}

export interface FipeValor {
  Valor: string
  Marca: string
  Modelo: string
  AnoModelo: number
  Combustivel: string
  CodigoFipe: string
  MesReferencia: string
}

const BASE = '/fipe/carros'

async function get<T>(caminho: string): Promise<T> {
  const resp = await fetch(BASE + caminho)
  if (!resp.ok) throw new Error(`A Tabela FIPE não respondeu (${resp.status}). Preencha os dados à mão.`)
  return (await resp.json()) as T
}

const paraItem = (i: { codigo: string | number; nome: string }): FipeItem => ({ codigo: String(i.codigo), nome: i.nome })

export const fipe = {
  marcas: () => get<FipeItem[]>('/marcas').then((l) => l.map(paraItem)),
  modelos: (marca: string) =>
    get<{ modelos: { codigo: number; nome: string }[] }>(`/marcas/${marca}/modelos`).then((r) =>
      r.modelos.map(paraItem),
    ),
  anos: (marca: string, modelo: string) =>
    get<FipeItem[]>(`/marcas/${marca}/modelos/${modelo}/anos`).then((l) => l.map(paraItem)),
  valor: (marca: string, modelo: string, ano: string) =>
    get<FipeValor>(`/marcas/${marca}/modelos/${modelo}/anos/${ano}`),
}

/** "R$ 28.989,00" -> 28989 */
export function valorFipeEmNumero(valor: string): number {
  return Number(valor.replace(/[^\d,]/g, '').replace(',', '.'))
}

/** A FIPE usa 32000 para veículos zero km. */
export function anoReal(anoModelo: number): number {
  return anoModelo >= 3000 ? new Date().getFullYear() : anoModelo
}

/** Diária sugerida: 0,3% do valor de tabela, arredondada para múltiplos de R$ 5 (mínimo R$ 80). */
export function diariaSugerida(valorTabela: number): number {
  return Math.max(80, Math.round((valorTabela * 0.003) / 5) * 5)
}
