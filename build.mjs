import esbuild from 'esbuild';
import path, { dirname } from 'path';
import TextToSVG from 'text-to-svg';
import fs from "fs"


import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


const textToSVG = TextToSVG.loadSync(path.join(__dirname, 'fonts/HyperFont.otf'));

for (let i = 0; i < 255; i++) {
  const thePath = path.join(__dirname, 'letters', `${i}.svg`)
  if (!fs.existsSync(thePath)) {
    const svg = textToSVG.getSVG(String.fromCharCode(i));
    fs.writeFileSync(thePath, svg)
  }
}

const svgs = new Array(255).fill(null).map((_, i) => fs.readFileSync(path.join(__dirname, 'letters', `${i}.svg`), 'utf8'))//.replaceAll('"','\\"'))

esbuild.build({
  bundle: true,
  outdir: 'dist',
  entryPoints: ['src/index.js'],
  sourcemap: true,
  minify: true,
  define: {
    ascii: JSON.stringify(svgs)
  },
})
