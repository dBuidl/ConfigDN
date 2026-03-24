import {defineConfig, type Plugin, ViteDevServer} from 'vite/dist/node'
import preact from '@preact/preset-vite'
import history from 'connect-history-api-fallback'

function rewriteAll(): Plugin {
  return {
    name: 'rewrite-all',
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(history({ disableDotRule: true }));
      };
    },
    configurePreviewServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(history({ disableDotRule: true }));
      };
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), rewriteAll()]
})
