package com.alquimialab.stickly.ui.screens

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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Backspace
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.PinStore
import com.alquimialab.stickly.data.ResultadoPin
import com.alquimialab.stickly.data.Textos
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class ModoPin {
    CREAR, CONFIRMAR, VERIFICAR
}

private const val LARGO_PIN = 6

@Composable
fun PinScreen(
    modo: ModoPin,
    idioma: String,
    pinPendiente: String = "",
    onConfirmado: (pinCreado: String?) -> Unit,
    onVolver: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val pinStore = remember { PinStore(context) }

    var pin by remember { mutableStateOf("") }
    var error by remember { mutableStateOf(false) }
    var bloqueo by remember { mutableStateOf(0L) }
    var ocupado by remember { mutableStateOf(false) }

    val titulo = when (modo) {
        ModoPin.CREAR -> Textos.t(idioma, "pin6")
        ModoPin.CONFIRMAR -> Textos.t(idioma, "pin6confirm")
        ModoPin.VERIFICAR -> Textos.t(idioma, "pin6enter")
    }

    LaunchedEffect(Unit) {
        bloqueo = pinStore.segundosBloqueo()
    }

    LaunchedEffect(bloqueo) {
        while (bloqueo > 0) {
            delay(1000)
            bloqueo = (bloqueo - 1).coerceAtLeast(0)
        }
    }

    fun procesarPin() {
        if (ocupado) return
        when (modo) {
            ModoPin.CREAR -> onConfirmado(pin)
            ModoPin.CONFIRMAR -> {
                if (pin == pinPendiente) {
                    ocupado = true
                    scope.launch {
                        if (pinStore.crearPin(pin)) {
                            onConfirmado(null)
                        } else {
                            error = true
                            pin = ""
                        }
                        ocupado = false
                    }
                } else {
                    error = true
                    pin = ""
                }
            }
            ModoPin.VERIFICAR -> {
                ocupado = true
                scope.launch {
                    when (val resultado = pinStore.verificarPin(pin)) {
                        is ResultadoPin.Correcto -> onConfirmado(null)
                        is ResultadoPin.Bloqueado -> {
                            bloqueo = resultado.segundos
                            error = true
                            pin = ""
                        }
                        else -> {
                            error = true
                            pin = ""
                        }
                    }
                    ocupado = false
                }
            }
        }
    }

    fun tecla(valor: String) {
        if (ocupado || bloqueo > 0) return
        error = false
        if (pin.length < LARGO_PIN) {
            pin += valor
            if (pin.length == LARGO_PIN) procesarPin()
        }
    }

    LaunchedEffect(modo) {
        pin = ""
        error = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onVolver) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = Textos.t(idioma, "cerrar"))
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Icon(
            Icons.Default.Lock,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = titulo,
            fontWeight = FontWeight.Bold,
            fontSize = 18.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = if (modo == ModoPin.CREAR) Textos.t(idioma, "pinNeededText") else Textos.t(idioma, "vaultHelp"),
            fontSize = 12.sp,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
        )

        if (error) {
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = if (bloqueo > 0) {
                    Textos.t(idioma, "pinLocked") + " · " +
                        Textos.t(idioma, "pinWait").replace("{s}", bloqueo.toString())
                } else {
                    when (modo) {
                        ModoPin.CONFIRMAR -> Textos.t(idioma, "pinNoCoincide")
                        else -> Textos.t(idioma, "pinIncorrecto")
                    }
                },
                color = MaterialTheme.colorScheme.error,
                fontSize = 14.sp,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            repeat(LARGO_PIN) { i ->
                Box(
                    modifier = Modifier
                        .size(16.dp)
                        .shadow(2.dp, CircleShape)
                        .clip(CircleShape)
                        .background(
                            if (i < pin.length) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                        )
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        val teclas = listOf("1", "2", "3", "4", "5", "6", "7", "8", "9")
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            teclas.chunked(3).forEach { fila ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    fila.forEach { valor ->
                        Tecla(valor, habilitada = bloqueo == 0L && !ocupado) { tecla(valor) }
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.width(72.dp))
                Tecla("0", habilitada = bloqueo == 0L && !ocupado) { tecla("0") }
                IconButton(
                    onClick = { if (pin.isNotEmpty()) pin = pin.dropLast(1) },
                    modifier = Modifier.size(56.dp)
                ) {
                    Icon(
                        Icons.Default.Backspace,
                        contentDescription = Textos.t(idioma, "eliminar"),
                        tint = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                    )
                }
            }
        }
    }
}

@Composable
private fun Tecla(texto: String, habilitada: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .size(56.dp)
            .shadow(2.dp, CircleShape)
            .clip(CircleShape)
            .background(
                if (habilitada) MaterialTheme.colorScheme.surface
                else MaterialTheme.colorScheme.surface.copy(alpha = 0.5f)
            )
            .clickable(enabled = habilitada, onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            texto,
            fontSize = 22.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = if (habilitada) 1f else 0.35f)
        )
    }
}
