# Solís Dental — Sitio web (Demo)

Sitio web estático para un cirujano dentista, construido con **HTML, CSS y JavaScript puro** (sin frameworks ni build step). Listo para desplegar en **Cloudflare Pages**.

> ⚠️ Es un **demo**: la información, el nombre del doctor, las opiniones y las imágenes son ficticias / de stock.

## Características

- Estética de "lujo clínico" — tipografía serif (Fraunces) + sans (Outfit)
- Sin gradientes ni marquesinas rotativas (banda de confianza estática)
- Transiciones y efectos modernos: revelados al hacer scroll, contadores animados, cursor personalizado, barra de progreso, micro-interacciones en hover
- Totalmente responsive
- Respeta `prefers-reduced-motion`

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
