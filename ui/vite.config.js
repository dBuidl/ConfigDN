import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import history from 'connect-history-api-fallback';
const historyMiddleware = history({ disableDotRule: true });
function rewriteAll() {
    return {
        name: 'rewrite-all',
        configureServer(server) {
            return () => { server.middlewares.use(historyMiddleware); };
        },
        configurePreviewServer(server) {
            return () => { server.middlewares.use(historyMiddleware); };
        }
    };
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact(), rewriteAll()]
});
