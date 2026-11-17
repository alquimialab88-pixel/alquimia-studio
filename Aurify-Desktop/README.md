# Aurify Desktop

App de Windows para Aurify. Es un cascarón de Electron que sirve la misma PWA que
`../alquimialab-web/aurify` desde un servidor local en `127.0.0.1`, así que no hay
dos versiones del código: se edita la PWA y se reconstruye.

## Comandos

```powershell
npm.cmd install      # solo la primera vez
npm.cmd start        # abre la app en modo desarrollo
npm.cmd run dist     # genera el instalador
```

El instalador queda en `dist/Aurify-Setup-1.0.0.exe`. Al no estar firmado, Windows
muestra SmartScreen: «Más información → Ejecutar de todas formas».

## Qué añade el cascarón

- `preload.js` expone `window.AurifyDesktop.savePdf(nombre)`.
- El botón «Guardar como PDF» abre un diálogo nativo y genera el PDF con
  `webContents.printToPDF` (A4, respetando el CSS de impresión).
- Ventana propia, sin menú, con el icono de Aurify.
- Los enlaces externos se abren en el navegador del sistema.
- Datos en `%APPDATA%\Aurify`.

## Estructura

- `main.js`: servidor local, ventana e IPC del PDF.
- `preload.js`: puente seguro para la PWA.
- `scripts/sync.js`: copia `../alquimialab-web/aurify` a `app/aurify` antes de empaquetar.
- `icon.ico`: icono multi-resolución (16 a 256 px) generado desde el logo.
