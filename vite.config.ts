import {defineConfig} from 'vite'
import checker from 'vite-plugin-checker'
import reactPlugin from '@vitejs/plugin-react'

export default defineConfig({
    root: 'src',
    build: {
        outDir: '/dist',
        emptyOutDir: true,
        sourcemap: true,
    },
    server: {
        port: 8000,
    },
    esbuild: {
        charset: 'utf8',
        legalComments: 'none',
        target: 'safari12',
    },
    plugins: [
        reactPlugin({
            babel: {
                parserOpts: {
                    plugins: ['decorators'],
                },
            },
        }),
        checker({
            typescript: true,
        }),
    ],
})
