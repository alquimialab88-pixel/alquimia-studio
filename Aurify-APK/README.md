# Aurify APK

Contenedor Android de la PWA de Aurify. No duplica la aplicación: en cada compilación
copia `../alquimialab-web/aurify` a los assets y la sirve con un origen `https`
(`appassets.androidplatform.net`).

## Compilar

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
.\gradlew.bat :app:assembleRelease
```

El APK queda en `app/build/outputs/apk/release/app-release.apk` y se copia a
`Aurify-1.0.0.apk`.

La firma se toma de `local.properties` (no se sube a git), reutilizando el mismo
keystore de Alquimia Lab:

```
STICKLY_STORE_FILE=../../Stickly-Android/mi-keystore.jks
STICKLY_STORE_PASSWORD=...
STICKLY_KEY_ALIAS=mi-alias
STICKLY_KEY_PASSWORD=...
```

## Qué añade el contenedor

- WebView con JavaScript, DOM Storage e IndexedDB.
- Selector de imágenes para poner el logo del negocio.
- Puente `AurifyAndroid.printPage`: el botón «Guardar como PDF» abre el diálogo
  nativo de impresión de Android, donde se elige «Guardar como PDF». Sin este
  puente, `window.print()` no hace nada en un WebView.
- Botón atrás integrado con el historial.
- Sin permiso de INTERNET: todo el contenido vive dentro de la app.
- `allowBackup=false`.

## Notas

- La PWA tiene su propia documentación en `alquimialab-web/aurify`.
- Cambiar la PWA y recompilar es suficiente para actualizar el APK.
- Mantiene el mismo `applicationId` (`com.alquimialab.aurify`) que la versión publicada,
  así que las actualizaciones se instalan encima.
