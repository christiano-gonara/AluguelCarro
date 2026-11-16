import { useMemo, useState } from 'react'

export type Ordem<C extends string> = { campo: C; crescente: boolean }

/**
 * Busca, ordenação e paginação feitas no navegador para as tabelas de pedidos e clientes.
 * `texto` diz onde procurar; `valor` diz como comparar cada coluna ordenável.
 */
export function useTabela<T, C extends string>(
  itens: T[],
  texto: (item: T) => string,
  valor: (item: T, campo: C) => string | number,
  ordemInicial: Ordem<C>,
) {
  const [busca, setBusca] = useState('')
  const [porPagina, setPorPagina] = useState(10)
  const [pagina, setPagina] = useState(1)
  const [ordem, setOrdem] = useState<Ordem<C>>(ordemInicial)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const lista = termo ? itens.filter((i) => texto(i).toLowerCase().includes(termo)) : [...itens]
    lista.sort((a, b) => {
      const va = valor(a, ordem.campo)
      const vb = valor(b, ordem.campo)
      const comp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR')
      return ordem.crescente ? comp : -comp
    })
    return lista
  }, [itens, busca, ordem, texto, valor])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtrados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina)

  function ordenarPor(campo: C) {
    setOrdem((o) => (o.campo === campo ? { campo, crescente: !o.crescente } : { campo, crescente: true }))
  }

  return {
    busca,
    buscar: (t: string) => {
      setBusca(t)
      setPagina(1)
    },
    porPagina,
    mudarPorPagina: (n: number) => {
      setPorPagina(n)
      setPagina(1)
    },
    pagina: paginaAtual,
    totalPaginas,
    irPara: setPagina,
    ordem,
    ordenarPor,
    visiveis,
    total: filtrados.length,
  }
}
