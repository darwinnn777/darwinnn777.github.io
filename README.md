# Darwin Fabián Vizhnay Corral · Portfolio

Web personal y portfolio de **Darwin Fabián Vizhnay Corral**, desarrollador web full stack junior (PHP, Java, JavaScript y SQL) y estudiante de Data Engineering e IA en Madrid.

**Web en producción:** https://darwinnn777.github.io

## Qué es

Una web de presentación con mis datos, mi trayectoria, mi formación y mi stack, y un espacio para el portfolio de proyectos. Está disponible en español e inglés.

## Características

- Diseño oscuro y minimalista, con una escena de partículas en WebGL que cambia de forma a medida que se hace scroll.
- Bilingüe (ES / EN), con el idioma elegido guardado en el navegador.
- Responsive: probada en escritorio y móvil.
- Cuidada en accesibilidad: enlace para saltar al contenido, foco visible, textos alternativos en las imágenes y estructura de encabezados semántica.
- Funciona sin JavaScript: el contenido está en el HTML y el JS solo añade las animaciones.
- Respeta `prefers-reduced-motion`.
- Sin paso de compilación ni dependencias de npm.

## Tecnologías

- HTML5, CSS3 y JavaScript sin frameworks
- [Three.js](https://threejs.org/) (escena de partículas)
- [GSAP](https://gsap.com/) y ScrollTrigger (animaciones ligadas al scroll)
- Tipografías de Google Fonts: Cormorant Garamond, Manrope y JetBrains Mono
- Alojada en GitHub Pages

## Ejecutar en local

No requiere instalación. Abre `index.html` en el navegador o, mejor, sirve la carpeta con un servidor local:

```bash
python -m http.server 8000
```

y visita http://localhost:8000.

## Estructura

```
index.html      página principal
styles.css      estilos
main.js         interfaz: idioma, navegación, animaciones al scroll
scene.js        escena WebGL de partículas
lib/            librerías (Three.js, GSAP) y datos de la web (manifest.js)
assets/         imágenes y favicon
```

## Contacto

- LinkedIn: [Darwin Fabián Vizhnay Corral](https://www.linkedin.com/in/darwin-fabi%C3%A1n-vizhnay-corral-b73b48289/)
- GitHub: [@darwinnn777](https://github.com/darwinnn777)

## Licencias

Three.js se distribuye bajo licencia MIT y GSAP bajo su [licencia estándar sin coste](https://gsap.com/standard-license/).

© Darwin Fabián Vizhnay Corral. Todos los derechos reservados sobre el código propio, los textos y las imágenes.
