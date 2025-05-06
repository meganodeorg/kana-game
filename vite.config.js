import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/rapier'
          ],
          'wallet': [
            'wagmi',
            '@rainbow-me/rainbowkit',
            '@tanstack/react-query'
          ],
          'ui': [
            'styled-components',
            'leva'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  resolve: {
    dedupe: [
      'react', 
      'react-dom', 
      'three', 
      'wagmi', 
      '@rainbow-me/rainbowkit',
      '@tanstack/react-query',
      'styled-components'
    ]
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'wagmi',
      '@rainbow-me/rainbowkit'
    ]
  }
})
