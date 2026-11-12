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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.PostIt
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.MainViewModel
import com.alquimialab.stickly.ui.theme.PaletaStickly
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    idioma: String,
    nombre: String,
    onAbrirNota: (PostIt) -> Unit,
    onAnadirTarea: () -> Unit
) {
    val tareas by viewModel.tareas.collectAsState()
    val postIts by viewModel.postIts.collectAsState()
    val locale = Locale(idioma)

    var diaSeleccion by remember { mutableStateOf(claveHoy()) }

    val ahora = remember { Calendar.getInstance() }
    val hora = ahora.get(Calendar.HOUR_OF_DAY)
    val saludo = when {
        hora < 12 -> Textos.t(idioma, "buenosDias")
        hora < 20 -> Textos.t(idioma, "buenasTardes")
        else -> Textos.t(idioma, "buenasNoches")
    }
    val fmtFechaLarga = remember(locale) { SimpleDateFormat("EEEE, d MMMM", locale) }
    val fechaLarga = fmtFechaLarga.format(ahora.time)

    val fechasConTareas = tareas.filter { !it.hecha }.map { it.fecha }.toSet()

    val semana = remember {
        val inicio = (ahora.clone() as Calendar).apply {
            set(Calendar.DAY_OF_WEEK, firstDayOfWeek)
            set(Calendar.HOUR_OF_DAY, 12)
        }
        (0..6).map { i ->
            (inicio.clone() as Calendar).apply { add(Calendar.DAY_OF_MONTH, i) }
        }
    }

    val tareasDelDia = tareas.filter { it.fecha == diaSeleccion }
    val notasImportantes = postIts.filter { it.categoria == "importante" }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(20.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "$saludo${if (nombre.isNotBlank()) ", $nombre" else ""} 👋",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = PaletaStickly.textDark
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = fechaLarga.replaceFirstChar { it.uppercase(locale) },
                    fontSize = 13.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.55f)
                )
            }
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .shadow(4.dp, CircleShape)
                    .clip(CircleShape)
                    .background(PaletaStickly.primaryLight, CircleShape)
                    .clickable { onAnadirTarea() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Add,
                    contentDescription = Textos.t(idioma, "anadirTarea"),
                    tint = PaletaStickly.primary,
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val fmtLetra = remember(locale) { SimpleDateFormat("EEEEE", locale) }
            val fmtNumero = remember { SimpleDateFormat("d", locale) }
            semana.forEach { dia ->
                val clave = claveFecha(
                    dia.get(Calendar.YEAR),
                    dia.get(Calendar.MONTH),
                    dia.get(Calendar.DAY_OF_MONTH)
                )
                val esHoy = clave == claveHoy()
                val seleccionado = clave == diaSeleccion
                val tieneTareas = clave in fechasConTareas
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            when {
                                seleccionado -> PaletaStickly.primary
                                esHoy -> PaletaStickly.primaryLight
                                else -> Color.White
                            },
                            RoundedCornerShape(16.dp)
                        )
                        .clickable { diaSeleccion = clave }
                        .padding(vertical = 10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = fmtLetra.format(dia.time).uppercase(locale),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (seleccionado) Color.White
                        else PaletaStickly.textDark.copy(alpha = 0.55f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = fmtNumero.format(dia.time),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (seleccionado) Color.White else PaletaStickly.textDark
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(CircleShape)
                            .background(
                                if (tieneTareas)
                                    if (seleccionado) Color.White else PaletaStickly.primary
                                else Color.Transparent
                            )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        SeccionHoy(
            titulo = Textos.t(idioma, "cosasHacerHoy"),
            total = tareasDelDia.size,
            onAnadir = onAnadirTarea
        ) {
            if (tareasDelDia.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(2.dp, RoundedCornerShape(16.dp))
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .padding(vertical = 18.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = Textos.t(idioma, "sinTareas"),
                        fontSize = 13.sp,
                        color = PaletaStickly.textDark.copy(alpha = 0.5f)
                    )
                }
            } else {
                tareasDelDia.forEach { tarea ->
                    FilaTareaHome(
                        titulo = tarea.titulo,
                        materia = tarea.materia,
                        hecha = tarea.hecha,
                        onToggle = {
                            viewModel.guardarTarea(tarea.copy(hecha = !tarea.hecha))
                        },
                        onBorrar = { viewModel.borrarTarea(tarea) }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = Textos.t(idioma, "notasImportantes"),
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = PaletaStickly.textDark
            )
            Spacer(modifier = Modifier.weight(1f))
            if (notasImportantes.isNotEmpty()) {
                Icon(
                    Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = PaletaStickly.textDark.copy(alpha = 0.4f),
                    modifier = Modifier.size(18.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        if (notasImportantes.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(2.dp, RoundedCornerShape(16.dp))
                    .background(Color.White, RoundedCornerShape(16.dp))
                    .padding(vertical = 18.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = Textos.t(idioma, "sinNotasImp"),
                    fontSize = 13.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.5f)
                )
            }
        } else {
            notasImportantes.take(4).forEach { nota ->
                MiniNota(
                    nota = nota,
                    idioma = idioma,
                    onClick = { onAbrirNota(nota) }
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun SeccionHoy(
    titulo: String,
    total: Int,
    onAnadir: () -> Unit,
    contenido: @Composable () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = titulo,
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            color = PaletaStickly.textDark
        )
        if (total > 0) {
            Spacer(modifier = Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .size(22.dp)
                    .clip(CircleShape)
                    .background(PaletaStickly.primaryLight),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = total.toString(),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = PaletaStickly.primary
                )
            }
        }
        Spacer(modifier = Modifier.weight(1f))
        IconButton(onClick = onAnadir, modifier = Modifier.size(32.dp)) {
            Icon(
                Icons.Default.Add,
                contentDescription = null,
                tint = PaletaStickly.primary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
    Spacer(modifier = Modifier.height(4.dp))
    contenido()
}

@Composable
private fun FilaTareaHome(
    titulo: String,
    materia: String,
    hecha: Boolean,
    onToggle: () -> Unit,
    onBorrar: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .shadow(2.dp, RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            if (hecha) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
            contentDescription = null,
            tint = if (hecha) PaletaStickly.primary else PaletaStickly.textDark.copy(alpha = 0.35f),
            modifier = Modifier
                .size(24.dp)
                .clip(CircleShape)
                .clickable(onClick = onToggle)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = titulo,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = PaletaStickly.textDark,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                textDecoration = if (hecha) TextDecoration.LineThrough else null
            )
            if (materia.isNotBlank()) {
                Text(
                    text = materia,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PaletaStickly.primary
                )
            }
        }
        IconButton(onClick = onBorrar, modifier = Modifier.size(32.dp)) {
            Icon(
                Icons.Default.Add,
                contentDescription = null,
                tint = Color.Transparent,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
private fun MiniNota(nota: PostIt, idioma: String, onClick: () -> Unit) {
    val fondo = remember(nota.color) { colorDePostIt(nota.color) }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .shadow(2.dp, RoundedCornerShape(16.dp))
            .background(fondo, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = if (nota.privada) {
                    Textos.t(idioma, "notaPrivada")
                } else {
                    nota.titulo.ifBlank { nota.contenido.lineSequence().firstOrNull().orEmpty() }
                },
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = PaletaStickly.textDark,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            if (!nota.privada && nota.contenido.isNotBlank() && nota.titulo.isNotBlank()) {
                Text(
                    text = nota.contenido,
                    fontSize = 12.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.65f),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
        Icon(
            Icons.AutoMirrored.Filled.KeyboardArrowRight,
            contentDescription = null,
            tint = PaletaStickly.textDark.copy(alpha = 0.35f),
            modifier = Modifier.size(18.dp)
        )
    }
}

private fun colorDePostIt(hex: String): Color = try {
    Color(android.graphics.Color.parseColor(hex))
} catch (_: Exception) {
    Color(0xFFFEF08A)
}
