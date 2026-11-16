import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Gera dist/404.html (página que o GitHub Pages mostra quando o endereço não existe) com o endereço base certo. */
function pagina404(base: string): Plugin {
  return {
    name: 'pagina-404',
    apply: 'build',
    generateBundle() {
      const html = readFileSync(new URL('./paginas/404.html', import.meta.url), 'utf8').replaceAll('%BASE%', base)
      this.emitFile({ type: 'asset', fileName: '404.html', source: html })
    },
  }
}

// Versão de demonstração (GitHub Pages): VITE_MODO_DEMO=true e VITE_BASE=/AluguelCarro/ (veja .github/workflows/pages.yml).
// Em desenvolvimento:
// - /api é encaminhado ao Spring Boot (mesma origem => cookie de sessão funciona);
// - /fipe é encaminhado à API pública da Tabela FIPE (evita problemas de CORS no navegador).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'
  const base = env.VITE_BASE || '/'
  return {
    base,
    plugins: [react(), pagina404(base)],
    server: {
      port: 5174,
      strictPort: true,
      proxy: {
        '/api': { target, changeOrigin: true },
        '/fipe': {
          target: 'https://parallelum.com.br',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fipe/, '/fipe/api/v1'),
        },
      },
    },
  }
})
