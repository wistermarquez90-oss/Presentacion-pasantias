# Dinámica Comercial y Migratoria Colombia–Venezuela 2013–2025

Presentación web interactiva para la defensa de monografía.
Universidad de los Andes · Escuela de Economía · HUMANIC · 2026.

## Controles

| Tecla / botón | Acción |
|---|---|
| `→` / `Espacio` / botón **Siguiente** | Revela el siguiente paso (o avanza de diapositiva) |
| `←` / botón **Anterior** | Retrocede un paso |
| `F` | Pantalla completa |
| `N` | Muestra/oculta las notas del expositor (guion verbal, solo para quien presenta) |

## Requisitos

- Node.js 18 o superior (recomendado: 20 LTS) — https://nodejs.org
- Git — https://git-scm.com

## Build local

```bash
npm install     # una sola vez: instala dependencias
npm run dev     # desarrollo en http://localhost:4321
npm run build   # genera el sitio estático en dist/
npm run preview # previsualiza el build en http://localhost:4321
```

> `npm run build` ejecuta automáticamente un postbuild (`scripts/fix-paths.mjs`)
> que convierte las rutas de los assets a relativas (`./_astro/...`),
> requisito para que el sitio funcione bajo la subcarpeta de GitHub Pages.

## Despliegue en GitHub Pages (paso a paso)

### 1. Crear el repositorio

En https://github.com/new crea un repositorio **público**, por ejemplo
`defensa-monografia` (sin README, sin .gitignore: el proyecto ya los trae).

### 2. Subir el código

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Presentación defensa de monografía"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/defensa-monografia.git
git push -u origin main
```

### 3. Publicar con GitHub Actions (recomendado, automático)

Crea el archivo `.github/workflows/deploy.yml` con este contenido:

```yaml
name: Deploy a GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Sube el workflow:

```bash
git add .github/workflows/deploy.yml
git commit -m "Workflow de despliegue"
git push
```

### 4. Activar Pages

En el repositorio: **Settings → Pages → Build and deployment → Source:
"GitHub Actions"**. El workflow corre solo al hacer push y en ~2 minutos el
sitio queda en:

```
https://TU-USUARIO.github.io/defensa-monografia/
```

Cada `git push` a `main` republica automáticamente.

### Alternativa sin Actions (manual)

```bash
npm run build
npm install -g gh-pages   # una sola vez
npx gh-pages -d dist
```

Esto publica `dist/` en la rama `gh-pages`. Luego en **Settings → Pages →
Source** elige la rama `gh-pages`, carpeta `/ (root)`.

## Verificación antes de la defensa

1. Abre la URL en Chrome/Edge (WebGL activo para los globos 3D).
2. Pulsa `F` para pantalla completa.
3. Pulsa `N` para ocultar las notas (el jurado no debe verlas).
4. Recorre con `→` hasta la diapositiva 24: cada clic revela un solo elemento.
5. Prueba `←` para retroceder paso a paso.

## Estructura

```
src/pages/index.astro   24 diapositivas (contenido + orden de pasos data-s)
src/scripts/deck.js     motor de pasos, ECharts, globos 3D, notas del expositor
src/styles/global.css   sistema visual (paleta navy/dorado, revelado por pasos)
public/data/            GeoJSON (mundo, Colombia, Venezuela) + heatmap
scripts/fix-paths.mjs   postbuild: rutas relativas para GitHub Pages
```
