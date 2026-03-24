import {defineConfig, type Plugin, type PreviewServer, type ViteDevServer} from 'vite'
import preact from '@preact/preset-vite'
import history from 'connect-history-api-fallback'

const historyMiddleware = history({ disableDotRule: true }) as any;

function rewriteAll(): Plugin {
  return {
    name: 'rewrite-all',
    configureServer(server: ViteDevServer) {
      return () => { server.middlewares.use(historyMiddleware); };
    },
    configurePreviewServer(server: PreviewServer) {
      return () => { server.middlewares.use(historyMiddleware); };
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), rewriteAll()]
})
