import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Em desenvolvimento:
// - /api é encaminhado ao Spring Boot (mesma origem => cookie de sessão funciona);
// - /fipe é encaminhado à API pública da Tabela FIPE (evita problemas de CORS no navegador).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'
  return {
    plugins: [react()],
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
