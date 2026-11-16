import type { ReactNode } from 'react'
import Icone from './Icone'

/** Barra de cima da tabela: título, itens por página, busca e uma ação opcional. */
export function BarraTabela({
  titulo,
  busca,
  aoBuscar,
  rotuloBusca,
  porPagina,
  aoMudarPorPagina,
  children,
}: {
  titulo: string
  busca: string
  aoBuscar: (t: string) => void
  rotuloBusca: string
  porPagina: number
  aoMudarPorPagina: (n: number) => void
  children?: ReactNode
}) {
  return (
    <div className="tabela-barra">
      <h2>{titulo}</h2>
      <label className="por-pagina">
        Mostrar
        <select value={porPagina} onChange={(e) => aoMudarPorPagina(Number(e.target.value))}>
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        por página
      </label>
      <div className="campo-busca">
        <Icone nome="busca" tamanho={18} />
        <input aria-label={rotuloBusca} placeholder={rotuloBusca} value={busca} onChange={(e) => aoBuscar(e.target.value)} />
      </div>
      {children}
    </div>
  )
}

/** Cabeçalho de coluna que ordena ao clicar. */
export function ColunaOrdenavel({
  rotulo,
  ativa,
  crescente,
  aoOrdenar,
}: {
  rotulo: string
  ativa: boolean
  crescente: boolean
  aoOrdenar: () => void
}) {
  return (
    <th scope="col" aria-sort={ativa ? (crescente ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="ordenar" onClick={aoOrdenar}>
        {rotulo}
        <Icone nome="ordenar" tamanho={14} />
      </button>
    </th>
  )
}

/** Rodapé da tabela: quantos itens e a navegação entre páginas. */
export function PaginasTabela({
  total,
  nome,
  pagina,
  totalPaginas,
  irPara,
}: {
  total: number
  nome: string
  pagina: number
  totalPaginas: number
  irPara: (p: number) => void
}) {
  return (
    <div className="tabela-paginas">
      <span>
        {total} {nome}
      </span>
      <nav aria-label="Páginas">
        <button type="button" className="pagina-texto" disabled={pagina === 1} onClick={() => irPara(pagina - 1)}>
          Anterior
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
          <button
            type="button"
            key={p}
            className={p === pagina ? 'pagina atual' : 'pagina'}
            aria-current={p === pagina ? 'page' : undefined}
            onClick={() => irPara(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="pagina-texto"
          disabled={pagina === totalPaginas}
          onClick={() => irPara(pagina + 1)}
        >
          Próxima
        </button>
      </nav>
    </div>
  )
}
