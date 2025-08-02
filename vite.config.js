import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: isDev
      ? {
          host: true,
          port: 5173,
          proxy: {
            '/api': {
              target: 'http://192.168.0.27:8000',
              changeOrigin: true,
              secure: false,
            },
            '/media': {
              target: 'http://192.168.0.27:8000',
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
  }
})
