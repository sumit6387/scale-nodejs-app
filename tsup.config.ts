import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['cjs'],
  outDir: 'dist',
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: false,
  dts: false,
  external: ['*.hbs'],
});
