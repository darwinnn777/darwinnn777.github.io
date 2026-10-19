# Web personal · Darwin Fabián Vizhnay Corral

Web estática (HTML + CSS + JS, sin build). Se abre con doble clic en `index.html` o con un servidor local.

## Qué editar

Todo lo que cambia con el tiempo está en `lib/manifest.js`:

- **`contact`**: email, LinkedIn y GitHub. Lo que dejes vacío no se muestra.
- **`projects`**: cuando tengas proyectos, añádelos ahí (hay un ejemplo en el comentario) y los huecos "próximamente" se sustituyen solos. Las capturas van en `assets/img/` en formato `.webp`.
- **Textos en inglés**: `i18n.en` en el mismo archivo. El español está en `index.html`.

## Publicar en GitHub Pages

1. Crea un repositorio público llamado `darwinnn777.github.io` (así la web queda en `https://darwinnn777.github.io`).
2. Sube el **contenido de esta carpeta** (`index.html`, `styles.css`, `main.js`, `scene.js`, `lib/`, `assets/`, `.nojekyll`) a la raíz del repositorio, rama `main`.
3. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
4. En 1–2 minutos estará online.

GitHub Pages no permite configurar cabeceras de caché, así que **cada vez que cambies `styles.css`, `main.js`, `scene.js` o `lib/*.js`**, cambia el `?v=YYYYMMDD` de esas líneas en `index.html` (hay 8 ocurrencias) para que los visitantes reciban la versión nueva.

`assets/photos/source/` guarda la foto original; puedes no subirla.
