package com.alquimialab.stickly.ui.screens

import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.Canvas
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.theme.PaletaStickly
import kotlinx.coroutines.delay
import java.util.Locale

private const val SEGUNDOS_ESTUDIO = 25 * 60
private const val SEGUNDOS_DESCANSO = 5 * 60

@Composable
fun CronometroScreen(idioma: String) {
    val context = LocalContext.current

    var estudio by remember { mutableStateOf(true) }
    var segundos by remember { mutableIntStateOf(SEGUNDOS_ESTUDIO) }
    var corriendo by remember { mutableStateOf(false) }
    var ciclos by remember { mutableIntStateOf(0) }
    var finDeFase by remember { mutableStateOf(false) }

    LaunchedEffect(corriendo) {
        while (corriendo && segundos > 0) {
            delay(1000)
            if (segundos > 0) segundos--
        }
        if (corriendo && segundos == 0) {
            val eraEstudio = estudio
            if (eraEstudio) ciclos++
            estudio = !eraEstudio
            segundos = if (eraEstudio) SEGUNDOS_DESCANSO else SEGUNDOS_ESTUDIO
            corriendo = false
            finDeFase = true
        }
    }

    LaunchedEffect(finDeFase) {
        if (finDeFase) {
            Toast.makeText(context, Textos.t(idioma, "finTiempo"), Toast.LENGTH_LONG).show()
            try {
                val tono = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 90)
                tono.startTone(ToneGenerator.TONE_PROP_BEEP2, 500)
                Handler(Looper.getMainLooper()).postDelayed({ tono.release() }, 800)
            } catch (_: Exception) {
            }
            finDeFase = false
        }
    }

    val mm = segundos / 60
    val ss = segundos % 60
    val reloj = String.format(Locale.ROOT, "%02d:%02d", mm, ss)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = if (estudio) Textos.t(idioma, "estudio") else Textos.t(idioma, "descanso"),
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = if (estudio) PaletaStickly.primary else PaletaStickly.primaryDark
        )
        Text(
            text = "${Textos.t(idioma, "ciclo")} $ciclos",
            fontSize = 13.sp,
            color = PaletaStickly.textDark.copy(alpha = 0.55f)
        )

        Spacer(modifier = Modifier.height(28.dp))

        val totalFase = if (estudio) SEGUNDOS_ESTUDIO else SEGUNDOS_DESCANSO
        val progreso = if (totalFase > 0) segundos.toFloat() / totalFase else 0f
        Box(
            modifier = Modifier
                .size(260.dp)
                .shadow(10.dp, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.size(260.dp)) {
                val radio = size.minDimension / 2f
                val centro = center
                val grosorFondo = 14.dp.toPx()
                val grosorProgreso = 16.dp.toPx()

                drawCircle(
                    color = if (estudio) PaletaStickly.primaryLight
                    else PaletaStickly.primaryLight.copy(alpha = 0.75f),
                    radius = radio - grosorFondo / 2,
                    style = Stroke(width = grosorFondo)
                )

                drawArc(
                    color = if (estudio) PaletaStickly.primary else PaletaStickly.primaryDark,
                    startAngle = -90f,
                    sweepAngle = 360f * progreso,
                    useCenter = false,
                    style = Stroke(width = grosorProgreso, cap = StrokeCap.Round),
                    topLeft = Offset(grosorProgreso / 2, grosorProgreso / 2),
                    size = Size(
                        size.width - grosorProgreso,
                        size.height - grosorProgreso
                    )
                )

                val radioTick = radio - grosorFondo - 8.dp.toPx()
                val grosorTick = 1.5.dp.toPx()
                val largoTick = 7.dp.toPx()
                for (i in 0 until 60) {
                    val angulo = Math.toRadians((i * 6).toDouble())
                    val esGrande = i % 5 == 0
                    val dx1 = centro.x + (radioTick) * kotlin.math.cos(angulo).toFloat()
                    val dy1 = centro.y + (radioTick) * kotlin.math.sin(angulo).toFloat()
                    val dx2 = centro.x + (radioTick - if (esGrande) largoTick * 1.6f else largoTick) *
                            kotlin.math.cos(angulo).toFloat()
                    val dy2 = centro.y + (radioTick - if (esGrande) largoTick * 1.6f else largoTick) *
                            kotlin.math.sin(angulo).toFloat()
                    drawLine(
                        color = if (esGrande) PaletaStickly.primary.copy(alpha = 0.65f)
                        else PaletaStickly.textDark.copy(alpha = 0.25f),
                        start = Offset(dx1, dy1),
                        end = Offset(dx2, dy2),
                        strokeWidth = if (esGrande) grosorTick * 2f else grosorTick,
                        cap = StrokeCap.Round
                    )
                }
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = reloj,
                    fontSize = 52.sp,
                    fontWeight = FontWeight.Bold,
                    color = PaletaStickly.primaryDark
                )
                if (!estudio) {
                    Text(
                        text = Textos.t(idioma, "tomateDescanso"),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PaletaStickly.primary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(
                onClick = { corriendo = !corriendo },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (corriendo) Color(0xFFDC2626) else PaletaStickly.primary
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(
                    if (corriendo) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.size(6.dp))
                Text(
                    text = when {
                        corriendo -> Textos.t(idioma, "pausar")
                        segundos < (if (estudio) SEGUNDOS_ESTUDIO else SEGUNDOS_DESCANSO) ->
                            Textos.t(idioma, "reanudar")
                        else -> Textos.t(idioma, "iniciar")
                    },
                    fontWeight = FontWeight.SemiBold
                )
            }
            OutlinedButton(
                onClick = {
                    corriendo = false
                    estudio = true
                    segundos = SEGUNDOS_ESTUDIO
                },
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(
                    Icons.Default.Refresh,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                    tint = PaletaStickly.primary
                )
                Spacer(modifier = Modifier.size(6.dp))
                Text(Textos.t(idioma, "reiniciar"))
            }
        }
    }
}
