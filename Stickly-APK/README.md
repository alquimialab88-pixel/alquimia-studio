# Stickly APK

Contenedor Android de la PWA de Stickly. No duplica la aplicación: en cada compilación
copia `../alquimialab-web/stickly` a los assets y la sirve con un origen `https`
(`appassets.androidplatform.net`) para que WebCrypto e IndexedDB funcionen como en el navegador.

## Compilar

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
.\gradlew.bat :app:assembleDebug
```

El APK queda en `app/build/outputs/apk/debug/app-debug.apk`.

Para una versión firmada, define en `local.properties` (no se sube a git):

```
STICKLY_STORE_FILE=../Stickly-Android/mi-keystore.jks
STICKLY_STORE_PASSWORD=...
STICKLY_KEY_ALIAS=mi-alias
STICKLY_KEY_PASSWORD=...
```

y ejecuta `:app:assembleRelease`.

## Qué añade el contenedor

- WebView con JavaScript, DOM Storage e IndexedDB.
- Permiso de micrófono para las notas de voz (se pide en el momento).
- Selector de archivos para importar copias JSON.
- Puente `SticklyAndroid.saveFile` para compartir la copia de seguridad con el sistema.
- Botón atrás integrado con el historial de la PWA.
- Sin permiso de INTERNET: todo el contenido vive dentro de la app.
- `allowBackup=false`; la copia de seguridad la controla la persona desde Ajustes.

## Notas

- La PWA tiene su propia documentación y pruebas en `alquimialab-web/stickly`.
- Cambiar la PWA y recompilar es suficiente para actualizar el APK; el service worker
  se desactiva dentro del contenedor para evitar copias antiguas.
