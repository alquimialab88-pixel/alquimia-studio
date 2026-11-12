# Stickly Android (referencia)

App Kotlin/Compose original de Stickly, actualizada a la versión 1.0.0 con las mismas
reglas de seguridad que la PWA. La app que se publicará como APK es el contenedor de
`Stickly-APK`, que reutiliza la PWA; este proyecto queda como referencia y respaldo nativo.

## Seguridad

- PIN de 6 dígitos; nunca se guarda.
- PBKDF2-SHA256 (310 000 iteraciones) deriva una llave que envuelve una llave AES-256.
- Contraseñas (usuario, clave, URL y nota) y notas privadas (título, contenido y checklist)
  se guardan cifradas con AES-256-GCM.
- Bloqueo tras 5 intentos fallidos, con espera exponencial.
- Autobloqueo configurable (5, 15 o 60 minutos; o nunca).
- `allowBackup=false` y sin permiso de INTERNET.
- Room con migración 3→4 (sin borrado destructivo).
- Exportar/importar copia JSON desde Ajustes; la copia conserva los datos cifrados y el
  material del PIN, así que hace falta el PIN para leerla.
- Las credenciales del keystore viven en `local.properties` (ignorado por git) o en
  variables de entorno `STICKLY_STORE_PASSWORD` / `STICKLY_KEY_PASSWORD`.

## Compilar

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
.\gradlew.bat :app:assembleDebug
```

APK de depuración: `app/build/outputs/apk/debug/app-debug.apk`.

Para release, define las credenciales en `local.properties` y ejecuta
`:app:assembleRelease`. El APK firmado queda en `app/build/outputs/apk/release/`.

## Versión

`versionName = "1.0.0"` · `versionCode = 2`.
