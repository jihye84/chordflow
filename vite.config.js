import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chordflow/',
  server: {
    watch: {
      ignored: ['**/*복사본*']
    }
  }
})
