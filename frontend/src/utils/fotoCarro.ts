// Foto real do modelo a partir da Wikipédia (API pública, sem chave, com CORS liberado via origin=*).
// As fotos vêm do Wikimedia Commons, com licenças livres; o card mostra o crédito com link para o artigo.

export interface FotoCarro {
  foto: string
  pagina: string
}

const CHAVE_CACHE = 'fotos-carros-v1'
const memoria = new Map<string, Promise<FotoCarro | null>>()

function lerCache(): Record<string, FotoCarro | null> {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_CACHE) ?? '{}') as Record<string, FotoCarro | null>
  } catch {
    return {}
  }
}

function salvarCache(termo: string, valor: FotoCarro | null) {
  try {
    sessionStorage.setItem(CHAVE_CACHE, JSON.stringify({ ...lerCache(), [termo]: valor }))
  } catch {
    // Sem sessionStorage (aba privada etc.): segue só com o cache em memória.
  }
}

/**
 * "VW - VolksWagen" + "T-Cross 200 TSI 1.0 Flex" -> "VolksWagen T-Cross".
 * A FIPE traz o nome completo da versão; para achar o artigo basta marca + nome do modelo.
 */
export function termoDeBusca(marca: string, modelo: string): string {
  const marcaLimpa = marca.includes(' - ') ? marca.split(' - ').pop()! : marca
  const nomeModelo = modelo.trim().split(/\s+/)[0] ?? modelo
  return `${marcaLimpa} ${nomeModelo}`.trim()
}

async function consultar(termo: string): Promise<FotoCarro | null> {
  const url = new URL('https://pt.wikipedia.org/w/api.php')
  const params: Record<string, string> = {
    action: 'query',
    generator: 'search',
    gsrsearch: termo,
    gsrlimit: '1',
    prop: 'pageimages|info',
    inprop: 'url',
    piprop: 'thumbnail',
    pithumbsize: '640',
    format: 'json',
    origin: '*',
  }
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const resp = await fetch(url)
  if (!resp.ok) return null
  const dados = (await resp.json()) as {
    query?: { pages?: Record<string, { fullurl?: string; thumbnail?: { source?: string } }> }
  }
  const pagina = Object.values(dados.query?.pages ?? {})[0]
  if (!pagina?.thumbnail?.source || !pagina.fullurl) return null
  return { foto: pagina.thumbnail.source, pagina: pagina.fullurl }
}

export function buscarFotoCarro(marca: string, modelo: string): Promise<FotoCarro | null> {
  const termo = termoDeBusca(marca, modelo)
  const emCache = lerCache()
  if (termo in emCache) return Promise.resolve(emCache[termo])

  let pendente = memoria.get(termo)
  if (!pendente) {
    pendente = consultar(termo)
      .catch(() => null)
      .then((r) => {
        salvarCache(termo, r)
        return r
      })
    memoria.set(termo, pendente)
  }
  return pendente
}
