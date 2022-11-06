import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [solid()],
  ssr: {
    external: ['@prisma/client', '@graphql-tools/schema', 'graphql-request'],
  },
  // envDir: __dirname,
});
