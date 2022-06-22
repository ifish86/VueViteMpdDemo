import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls }
        }),
        quasar({
            sassVariables: 'src/quasar-variables.sass'
        })
    ],
    server: {
        proxy: {
            '^/api/.*': {
            target: 'http://localhost:88',
            rewrite: path => path.replace('/api', ''),
            changeOrigin: true,
            secure: false

            },
            '/socket.io': {
                target: 'http://localhost:89',
                ws: false

            }

        },
        host: '0.0.0.0'
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
