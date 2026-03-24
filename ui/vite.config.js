import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import history from 'connect-history-api-fallback';
function rewriteAll() {
    return {
        name: 'rewrite-all',
        configureServer(server) {
            return () => {
                server.middlewares.use(history({ disableDotRule: true }));
            };
        },
        configurePreviewServer(server) {
            return () => {
                server.middlewares.use(history({ disableDotRule: true }));
            };
        }
    };
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact(), rewriteAll()]
});
