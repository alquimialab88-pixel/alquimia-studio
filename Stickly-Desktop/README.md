# Stickly Desktop

App de escritorio para Windows que empaqueta la misma PWA de Stickly.

## Para instalarla

Ejecuta `dist/Stickly-Setup-1.0.0.exe` y sigue el asistente. Crea accesos en el
escritorio y en el menú Inicio.

- Windows puede mostrar el aviso de SmartScreen porque el instalador no está
  firmado. Elige **Más información → Ejecutar de todas formas**.
- Los datos se guardan en `%APPDATA%\Stickly` y no se comparten con el celular.
  Para pasarlos de un dispositivo a otro usa **Ajustes → Copia de seguridad**.
- Funciona sin internet.

## Para desarrollar

```powershell
npm.cmd install
npm.cmd start
```

`npm run sync` copia `../alquimialab-web/stickly` a `app/stickly` antes de abrir
o compilar, así que la app de escritorio siempre usa la misma base de código
que la web y el APK.

## Para compilar el instalador

```powershell
npm.cmd run dist
```

El instalador queda en `dist/Stickly-Setup-1.0.0.exe`.

## Notas técnicas

- Usa un servidor local en `127.0.0.1` para que WebCrypto e IndexedDB
  funcionen como en un contexto seguro, sin depender de internet.
- El service worker se desactiva dentro de la app (igual que en el APK) para
  evitar versiones antiguas en caché.
- La exportación de copias de seguridad usa el diálogo nativo de Windows.
- El micrófono se habilita para las notas de voz.
