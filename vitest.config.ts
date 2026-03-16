import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import path from 'path';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, './src/common'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@config': path.resolve(__dirname, './src/common/config'),
      '@db': path.resolve(__dirname, './db'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['test/**/*.spec.ts'],
  },
});
