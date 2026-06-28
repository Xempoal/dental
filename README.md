# Solís · Atelier Dental — Sitio web (Demo)

Sitio web estático para un cirujano dentista en **Xalapa, Veracruz**, construido con **HTML, CSS y JavaScript puro** (sin frameworks ni build step). Listo para desplegar en **Cloudflare Pages**.

> ⚠️ Es un **demo**: el nombre del doctor, la dirección, el teléfono, las opiniones y las imágenes son ficticios / de stock.

## Características

- Estética editorial premium "atelier dental" — azul medianoche, tipografía Bodoni Moda (alto contraste) + Hanken Grotesk
- Sin gradientes ni marquesinas rotativas
- Lista de servicios con imagen flotante que sigue al cursor (estilo editorial)
- Galería de fotos en mosaico, sección de método sobre fondo claro (contraste)
- Transiciones y efectos modernos: revelados al hacer scroll, máscara clip-path en imágenes, contadores animados, cursor personalizado, barra de progreso, grano sutil
- Totalmente responsive · respeta `prefers-reduced-motion`
- Fallback visual si alguna imagen de stock no carga

## Estructura

```
dental/
├── index.html      # Estructura y contenido
├── styles.css      # Estilos y animaciones
├── script.js       # Interactividad (vanilla JS)
└── README.md
```

## Desarrollo local

No requiere instalación. Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python -m http.server 8080
# luego abre http://localhost:8080
```

## Despliegue en Cloudflare Pages

1. Entra a **Cloudflare Dashboard → Workers & Pages → Create → Pages**.
2. Conecta este repositorio de GitHub (`dental`).
3. Configuración de build:
   - **Framework preset:** None
   - **Build command:** *(vacío)*
   - **Build output directory:** `/`
4. Deploy. Cloudflare publicará el sitio estático automáticamente.

## Créditos

Imágenes: [Unsplash](https://unsplash.com). Tipografías: [Google Fonts](https://fonts.google.com).
