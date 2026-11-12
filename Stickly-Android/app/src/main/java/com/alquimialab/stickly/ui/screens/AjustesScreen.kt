package com.alquimialab.stickly.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.PinStore
import com.alquimialab.stickly.data.ResultadoPin
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.theme.PaletaStickly
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlinx.coroutines.launch

@Composable
fun AjustesScreen(
    idioma: String,
    tienePin: Boolean,
    desbloqueado: Boolean,
    autoBloqueo: Int,
    onIdioma: (String) -> Unit,
    onCrearPin: () -> Unit,
    onAutoBloqueo: (Int) -> Unit,
    onBloquear: () -> Unit,
    onExportar: (Uri) -> Unit,
    onImportar: (Uri) -> Unit,
    onBorrarTodo: () -> Unit,
    onVolver: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val pinStore = remember { PinStore(context) }

    var cambiarPin by remember { mutableStateOf(false) }
    var confirmarBorrar by remember { mutableStateOf(false) }
    var pinActual by remember { mutableStateOf("") }
    var pinNuevo by remember { mutableStateOf("") }
    var pinRepetir by remember { mutableStateOf("") }
    var errorPin by remember { mutableStateOf<String?>(null) }
    var ocupado by remember { mutableStateOf(false) }

    val exportarLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.CreateDocument("application/json")
    ) { uri -> uri?.let(onExportar) }

    val importarLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri -> uri?.let(onImportar) }

    fun lanzarExportar() {
        val fecha = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        exportarLauncher.launch("stickly-$fecha.json")
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(bottom = 28.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onVolver) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = Textos.t(idioma, "cerrar"),
                    tint = PaletaStickly.textDark
                )
            }
            Text(
                text = Textos.t(idioma, "config"),
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = PaletaStickly.textDark
            )
        }

        SeccionTitulo(Textos.t(idioma, "security"))

        if (!tienePin) {
            FilaAjuste(
                icono = Icons.Default.Lock,
                titulo = Textos.t(idioma, "createPin"),
                subtitulo = Textos.t(idioma, "configuraPin"),
                onClick = onCrearPin
            )
        } else {
            FilaAjuste(
                icono = Icons.Default.Security,
                titulo = Textos.t(idioma, "changePin"),
                subtitulo = Textos.t(idioma, "pinSet"),
                onClick = {
                    pinActual = ""
                    pinNuevo = ""
                    pinRepetir = ""
                    errorPin = null
                    cambiarPin = true
                }
            )
        }

        FilaAjuste(
            icono = Icons.Default.LockOpen,
            titulo = Textos.t(idioma, "autoLock"),
            subtitulo = Textos.t(idioma, "autoLockHelp"),
            valor = when (autoBloqueo) {
                0 -> Textos.t(idioma, "never")
                60 -> Textos.t(idioma, "min60")
                15 -> Textos.t(idioma, "min15")
                else -> Textos.t(idioma, "min5")
            },
            onClick = {
                val siguiente = when (autoBloqueo) {
                    5 -> 15
                    15 -> 60
                    60 -> 0
                    else -> 5
                }
                onAutoBloqueo(siguiente)
            }
        )

        if (tienePin && desbloqueado) {
            FilaAjuste(
                icono = Icons.Default.Lock,
                titulo = Textos.t(idioma, "lockNow"),
                subtitulo = null,
                onClick = onBloquear
            )
        }

        SeccionTitulo(Textos.t(idioma, "idioma"))
        IDIOMAS.forEach { (codigo, nombre) ->
            FilaAjuste(
                icono = Icons.Default.Language,
                titulo = nombre,
                subtitulo = null,
                valor = if (codigo == idioma) "✓" else null,
                onClick = { onIdioma(codigo) }
            )
        }

        SeccionTitulo(Textos.t(idioma, "data"))
        FilaAjuste(
            icono = Icons.Default.CloudDownload,
            titulo = Textos.t(idioma, "exportData"),
            subtitulo = Textos.t(idioma, "backupWarning"),
            onClick = ::lanzarExportar
        )
        FilaAjuste(
            icono = Icons.Default.CloudUpload,
            titulo = Textos.t(idioma, "importData"),
            subtitulo = Textos.t(idioma, "importData"),
            onClick = { importarLauncher.launch(arrayOf("application/json", "text/plain", "*/*")) }
        )
        FilaAjuste(
            icono = Icons.Default.Delete,
            titulo = Textos.t(idioma, "deleteAll"),
            subtitulo = null,
            peligro = true,
            onClick = { confirmarBorrar = true }
        )

        SeccionTitulo("Stickly")
        FilaAjuste(
            icono = Icons.Default.Info,
            titulo = Textos.t(idioma, "about"),
            subtitulo = Textos.t(idioma, "version"),
            onClick = null
        )

        Text(
            text = "Stickly · Alquimia Lab\n" + Textos.t(idioma, "vaultHelp"),
            fontSize = 11.sp,
            color = PaletaStickly.textDark.copy(alpha = 0.55f),
            modifier = Modifier.padding(horizontal = 22.dp, vertical = 16.dp)
        )
    }

    if (cambiarPin) {
        AlertDialog(
            onDismissRequest = { if (!ocupado) cambiarPin = false },
            title = { Text(Textos.t(idioma, "changePin"), fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = pinActual,
                        onValueChange = { pinActual = it.filter { c -> c.isDigit() }.take(6) },
                        label = { Text(Textos.t(idioma, "pin6enter")) },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = pinNuevo,
                        onValueChange = { pinNuevo = it.filter { c -> c.isDigit() }.take(6) },
                        label = { Text(Textos.t(idioma, "pin6")) },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = pinRepetir,
                        onValueChange = { pinRepetir = it.filter { c -> c.isDigit() }.take(6) },
                        label = { Text(Textos.t(idioma, "pin6confirm")) },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier.fillMaxWidth()
                    )
                    errorPin?.let {
                        Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                    }
                }
            },
            confirmButton = {
                TextButton(
                    enabled = !ocupado && pinActual.length >= 6 && pinNuevo.length >= 6,
                    onClick = {
                        if (pinNuevo != pinRepetir) {
                            errorPin = Textos.t(idioma, "pinNoCoincide")
                            return@TextButton
                        }
                        ocupado = true
                        scope.launch {
                            when (val r = pinStore.cambiarPin(pinActual, pinNuevo)) {
                                is ResultadoPin.Correcto -> {
                                    cambiarPin = false
                                    pinActual = ""
                                    pinNuevo = ""
                                    pinRepetir = ""
                                }
                                is ResultadoPin.Bloqueado -> {
                                    errorPin = Textos.t(idioma, "pinLocked") + " · " +
                                        Textos.t(idioma, "pinWait").replace("{s}", r.segundos.toString())
                                }
                                else -> errorPin = Textos.t(idioma, "pinIncorrecto")
                            }
                            ocupado = false
                        }
                    }
                ) {
                    Text(Textos.t(idioma, "guardar"), fontWeight = FontWeight.SemiBold)
                }
            },
            dismissButton = {
                TextButton(onClick = { if (!ocupado) cambiarPin = false }) {
                    Text(Textos.t(idioma, "cancelar"))
                }
            }
        )
    }

    if (confirmarBorrar) {
        AlertDialog(
            onDismissRequest = { confirmarBorrar = false },
            title = { Text(Textos.t(idioma, "deleteAll"), fontWeight = FontWeight.Bold) },
            text = { Text(Textos.t(idioma, "deleteAllText")) },
            confirmButton = {
                TextButton(onClick = {
                    confirmarBorrar = false
                    onBorrarTodo()
                }) {
                    Text(Textos.t(idioma, "eliminar"), color = Color(0xFFDC2626), fontWeight = FontWeight.SemiBold)
                }
            },
            dismissButton = {
                TextButton(onClick = { confirmarBorrar = false }) {
                    Text(Textos.t(idioma, "cancelar"))
                }
            }
        )
    }
}

@Composable
private fun SeccionTitulo(texto: String) {
    Text(
        text = texto.uppercase(Locale.getDefault()),
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        color = PaletaStickly.textDark.copy(alpha = 0.5f),
        modifier = Modifier.padding(start = 22.dp, top = 18.dp, bottom = 6.dp)
    )
}

@Composable
private fun FilaAjuste(
    icono: ImageVector,
    titulo: String,
    subtitulo: String?,
    valor: String? = null,
    peligro: Boolean = false,
    onClick: (() -> Unit)?
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 3.dp)
            .background(Color.White, RoundedCornerShape(16.dp))
            .clickable(enabled = onClick != null) { onClick?.invoke() }
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .background(
                    if (peligro) Color(0xFFFEE2E2) else PaletaStickly.primaryLight,
                    RoundedCornerShape(12.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icono,
                contentDescription = null,
                modifier = Modifier.size(19.dp),
                tint = if (peligro) Color(0xFFDC2626) else PaletaStickly.primary
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = titulo,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = if (peligro) Color(0xFFDC2626) else PaletaStickly.textDark
            )
            if (!subtitulo.isNullOrBlank()) {
                Text(
                    text = subtitulo,
                    fontSize = 11.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.55f)
                )
            }
        }
        if (valor != null) {
            Text(
                text = valor,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = PaletaStickly.primary
            )
        } else if (onClick != null) {
            Icon(
                Icons.AutoMirrored.Filled.KeyboardArrowRight,
                contentDescription = null,
                modifier = Modifier.size(18.dp),
                tint = PaletaStickly.textDark.copy(alpha = 0.3f)
            )
        }
    }
}

private val IDIOMAS = listOf(
    "es" to "Español",
    "en" to "English",
    "fr" to "Français",
    "it" to "Italiano",
    "pt" to "Português",
    "de" to "Deutsch",
    "ja" to "日本語",
    "zh" to "简体中文",
    "ko" to "한국어"
)
