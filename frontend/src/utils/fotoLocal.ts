// Fotos recortadas (sem fundo) dos modelos mais comuns do catálogo, servidas de /public/carros.
// Vêm do Wikimedia Commons, com fundo removido e cores neutralizadas; os créditos estão no rodapé.
// Para os outros modelos, o FotoCarro continua buscando a foto na Wikipédia.

const RECORTES: { trecho: string; arquivo: string }[] = [
  { trecho: 'corolla', arquivo: 'corolla.png' },
  { trecho: 'argo', arquivo: 'argo.png' },
  { trecho: 'onix', arquivo: 'onix.png' },
  { trecho: 't-cross', arquivo: 'tcross.png' },
  { trecho: 'tcross', arquivo: 'tcross.png' },
  { trecho: 'hb20', arquivo: 'hb20.png' },
  { trecho: 'compass', arquivo: 'compass.png' },
]

/** Caminho da foto recortada do modelo, ou null quando não há recorte para ele. */
export function fotoRecortada(modelo: string): string | null {
  const nome = modelo.toLowerCase()
  const achado = RECORTES.find((r) => nome.includes(r.trecho))
  return achado ? `/carros/${achado.arquivo}` : null
}
