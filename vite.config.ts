import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: './',
    root: '',
    server: {
        watch: {
            ignored: ['**/render-build/**', '**/build/**'],
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false
            }
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, 'packages/render/src')
        }
    },
    build: {
        sourcemap: true,
        outDir: 'packages/render-build'
    }
})
