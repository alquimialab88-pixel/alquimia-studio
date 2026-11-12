package com.alquimialab.stickly

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebChromeClient.FileChooserParams
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.FileProvider
import java.io.ByteArrayInputStream
import java.io.File

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private var pendingPermission: PermissionRequest? = null

    private val selectorArchivos = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        fileCallback?.onReceiveValue(if (uri != null) arrayOf(uri) else null)
        fileCallback = null
    }

    private val permisoAudio = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { concedido ->
        val solicitud = pendingPermission
        pendingPermission = null
        if (concedido && solicitud != null) {
            solicitud.grant(solicitud.resources)
        } else {
            solicitud?.deny()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (BuildConfig.DEBUG) WebView.setWebContentsDebuggingEnabled(true)

        webView = WebView(this)
        webView.setBackgroundColor(Color.parseColor("#F8F7FB"))
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(false)
            builtInZoomControls = false
        }

        webView.addJavascriptInterface(Bridge(), "SticklyAndroid")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? = responderAsset(request.url)

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val url = request.url
                return url.scheme != "https" || url.host != HOST
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                val pideAudio = request.resources.any { it == PermissionRequest.RESOURCE_AUDIO_CAPTURE }
                if (!pideAudio) {
                    request.deny()
                    return
                }
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) ==
                    PackageManager.PERMISSION_GRANTED
                ) {
                    request.grant(request.resources)
                } else {
                    pendingPermission = request
                    permisoAudio.launch(Manifest.permission.RECORD_AUDIO)
                }
            }

            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    selectorArchivos.launch(arrayOf("application/json", "text/plain", "*/*"))
                    true
                } catch (e: Exception) {
                    fileCallback = null
                    false
                }
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        webView.loadUrl("https://$HOST/stickly/index.html")
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    /* ===== Servir la PWA desde assets con origen https (contexto seguro) ===== */

    private fun responderAsset(uri: Uri): WebResourceResponse? {
        if (uri.host != HOST) return null
        val ruta = uri.path ?: return noEncontrado()
        if (!ruta.startsWith("/stickly/")) return noEncontrado()

        var relativa = ruta.removePrefix("/stickly/")
        if (relativa.isEmpty() || relativa.endsWith("/")) relativa += "index.html"
        if (relativa.contains("..")) return noEncontrado()

        return try {
            val flujo = assets.open("stickly/$relativa")
            val tipo = tipoMime(relativa)
            val codificacion = if (tipo.startsWith("text/") || tipo.contains("json") || tipo.contains("javascript")) "utf-8" else null
            WebResourceResponse(
                tipo,
                codificacion,
                200,
                "OK",
                mapOf("Cache-Control" to "no-cache"),
                flujo
            )
        } catch (e: Exception) {
            noEncontrado()
        }
    }

    private fun noEncontrado(): WebResourceResponse =
        WebResourceResponse(
            "text/plain",
            "utf-8",
            404,
            "Not Found",
            emptyMap(),
            ByteArrayInputStream(ByteArray(0))
        )

    private fun tipoMime(ruta: String): String = when (ruta.substringAfterLast('.', "").lowercase()) {
        "html" -> "text/html"
        "js" -> "text/javascript"
        "css" -> "text/css"
        "json" -> "application/json"
        "webmanifest" -> "application/manifest+json"
        "svg" -> "image/svg+xml"
        "png" -> "image/png"
        "ico" -> "image/x-icon"
        "woff2" -> "font/woff2"
        else -> "application/octet-stream"
    }

    /* ===== Puente para compartir copias de seguridad ===== */

    private inner class Bridge {
        @JavascriptInterface
        fun saveFile(nombre: String, contenido: String) {
            runOnUiThread {
                try {
                    val carpeta = File(cacheDir, "exports").apply { mkdirs() }
                    val seguro = nombre.replace(Regex("[^A-Za-z0-9._-]"), "_")
                    val archivo = File(carpeta, seguro.ifBlank { "stickly.json" })
                    archivo.writeText(contenido, Charsets.UTF_8)

                    val uri = FileProvider.getUriForFile(
                        this@MainActivity,
                        "$packageName.fileprovider",
                        archivo
                    )
                    val enviar = Intent(Intent.ACTION_SEND).apply {
                        type = "application/json"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    startActivity(Intent.createChooser(enviar, getString(R.string.share_backup)))
                } catch (e: Exception) {
                    Toast.makeText(
                        this@MainActivity,
                        getString(R.string.backup_error),
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    companion object {
        private const val HOST = "appassets.androidplatform.net"
    }
}
