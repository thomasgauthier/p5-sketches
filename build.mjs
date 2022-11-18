import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

esbuild.build({
  // ...
  bundle: true,
  outdir: 'dist',
  entryPoints: ['src/index.js'],
  sourcemap: true,
  minify: true,
  define : {
    '__dirname' : '""',
    module : '{}',
    'exports.default' : '""'
  },
  plugins: [
    alias({
      'path': path.join(__dirname,'src/alias.js'),
    }),
  ],
})
