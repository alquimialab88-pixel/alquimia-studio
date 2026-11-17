package com.alquimialab.aurify

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.JavascriptInterface
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
import java.io.ByteArrayInputStream

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    private val selectorArchivos = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        fileCallback?.onReceiveValue(if (uri != null) arrayOf(uri) else null)
        fileCallback = null
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
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(false)
            builtInZoomControls = false
        }

        webView.addJavascriptInterface(Bridge(), "AurifyAndroid")

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
            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    /* El logo del negocio se elige desde el almacenamiento del teléfono. */
                    selectorArchivos.launch(arrayOf("image/*"))
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

        webView.loadUrl("https://$HOST/aurify/index.html")
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
        if (!ruta.startsWith("/aurify/")) return noEncontrado()

        var relativa = ruta.removePrefix("/aurify/")
        if (relativa.isEmpty() || relativa.endsWith("/")) relativa += "index.html"
        if (relativa.contains("..")) return noEncontrado()

        return try {
            val flujo = assets.open("aurify/$relativa")
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
        "webp" -> "image/webp"
        "jpg", "jpeg" -> "image/jpeg"
        "ico" -> "image/x-icon"
        "woff2" -> "font/woff2"
        else -> "application/octet-stream"
    }

    /* ===== Puente para guardar el PDF con el diálogo nativo de Android ===== */

    private inner class Bridge {
        @JavascriptInterface
        fun printPage() {
            runOnUiThread {
                try {
                    val nombre = getString(R.string.print_job)
                    val printManager = getSystemService(Context.PRINT_SERVICE) as PrintManager
                    printManager.print(
                        nombre,
                        webView.createPrintDocumentAdapter(nombre),
                        PrintAttributes.Builder()
                            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                            .build()
                    )
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, getString(R.string.print_error), Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    companion object {
        private const val HOST = "appassets.androidplatform.net"
    }
}
