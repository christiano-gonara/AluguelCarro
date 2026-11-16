// Configurações que mudam entre a versão completa e a de demonstração (GitHub Pages).

/** true quando o site foi gerado sem back-end: os dados ficam só no navegador (src/demo). */
export const MODO_DEMO = import.meta.env.VITE_MODO_DEMO === 'true'

/** Caminho de um arquivo da pasta public, respeitando o endereço base (ex.: /AluguelCarro/ no GitHub Pages). */
export function publico(caminho: string): string {
  return import.meta.env.BASE_URL + caminho.replace(/^\//, '')
}
