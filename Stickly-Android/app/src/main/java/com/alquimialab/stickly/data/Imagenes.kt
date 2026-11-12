package com.alquimialab.stickly.data

import android.content.Context
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import java.io.File

object Imagenes {

    fun copiarAInterno(context: Context, uri: Uri): String? {
        return try {
            val dir = File(context.filesDir, "imagenes")
            if (!dir.exists()) dir.mkdirs()
            val destino = File(dir, "img_${System.currentTimeMillis()}_${(1000..9999).random()}.jpg")
            context.contentResolver.openInputStream(uri)?.use { entrada ->
                destino.outputStream().use { salida -> entrada.copyTo(salida) }
            } ?: return null
            destino.absolutePath
        } catch (e: Exception) {
            null
        }
    }

    fun miniatura(ruta: String, anchoMax: Int): ImageBitmap? {
        if (ruta.isBlank() || !ruta.startsWith("/")) return null
        return try {
            val limites = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            BitmapFactory.decodeFile(ruta, limites)
            if (limites.outWidth <= 0) return null
            var escala = 1
            while (limites.outWidth / escala > anchoMax * 2) escala *= 2
            val bmp = BitmapFactory.decodeFile(ruta, BitmapFactory.Options().apply { inSampleSize = escala })
            bmp?.asImageBitmap()
        } catch (e: Exception) {
            null
        }
    }
}
