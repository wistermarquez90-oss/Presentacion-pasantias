// Post-build: convierte rutas absolutas (/./_astro/..., /_astro/...) en relativas
// para que el sitio funcione en GitHub Pages (sitio de proyecto, bajo subcarpeta).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;

// index.html: href/src="/./_astro/..." → "./_astro/..."
const htmlPath = join(dist, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
html = html.replaceAll('="/./_astro/', '="./_astro/');
writeFileSync(htmlPath, html);

// CSS: url(/_astro/archivo) → url(archivo)  (las fuentes viven en la misma carpeta)
const astroDir = join(dist, '_astro');
for (const f of readdirSync(astroDir)) {
  if (!f.endsWith('.css')) continue;
  const p = join(astroDir, f);
  let css = readFileSync(p, 'utf8');
  css = css.replaceAll('url(/_astro/', 'url(');
  writeFileSync(p, css);
}
console.log('fix-paths: rutas relativas aplicadas');
