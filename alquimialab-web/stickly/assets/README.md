# Fotos de Antonio para la bienvenida

Las tres fotos ya están integradas en la app:

| Archivo | Paso de la bienvenida |
| --- | --- |
| `antonio-1.webp` | «Tu día, en orden y en un solo lugar.» |
| `antonio-2.webp` | «Privado de verdad.» |
| `antonio-3.webp` | «Instálala como app.» |

Detalles técnicos:

- Formato WebP con transparencia, 900 × 900 px, calidad 90 (~112–120 KB cada una).
- La app las muestra con `object-fit: contain` sobre un resplandor lavanda suave.
- Si un archivo falta, se intenta el mismo nombre en `.png` y luego en `.jpg`;
  si tampoco existe, se queda la ilustración de respaldo (sin iconos rotos).
- Para cambiarlas, sustituye los archivos manteniendo el nombre y vuelve a
  subir la app (la caché del service worker se actualiza con cada versión).
