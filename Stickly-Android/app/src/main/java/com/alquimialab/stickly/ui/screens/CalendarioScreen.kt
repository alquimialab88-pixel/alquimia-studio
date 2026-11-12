package com.alquimialab.stickly.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Tarea
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.MainViewModel
import com.alquimialab.stickly.ui.theme.PaletaStickly
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

internal fun claveFecha(anio: Int, mes: Int, dia: Int): String =
    String.format(Locale.ROOT, "%04d-%02d-%02d", anio, mes + 1, dia)

internal fun claveHoy(): String {
    val c = Calendar.getInstance()
    return claveFecha(c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH))
}

@Composable
fun CalendarioScreen(
    viewModel: MainViewModel,
    idioma: String
) {
    val tareas by viewModel.tareas.collectAsState()
    val locale = Locale(idioma)

    val hoyCal = remember { Calendar.getInstance() }
    val anioInicial = hoyCal.get(Calendar.YEAR)
    val mesInicial = hoyCal.get(Calendar.MONTH)

    var anio by remember { mutableStateOf(anioInicial) }
    var mes by remember { mutableStateOf(mesInicial) }
    var seleccion by remember { mutableStateOf(claveHoy()) }
    var pestana by remember { mutableStateOf("mes") }
    var mostrarDialogo by remember { mutableStateOf(false) }
    var tituloTarea by remember { mutableStateOf("") }
    var materiaTarea by remember { mutableStateOf("") }

    val fechaHoy = claveHoy()
    val fmtMes = remember(locale) { SimpleDateFormat("MMMM yyyy", locale) }
    val fmtDiaCorto = remember(locale) { SimpleDateFormat("EEE, d MMM", locale) }
    val fmtCelda = remember { SimpleDateFormat("EEEEE", locale) }

    val fechaCal = remember(anio, mes) {
        Calendar.getInstance().apply { set(anio, mes, 1) }
    }
    val diasDelMes = fechaCal.getActualMaximum(Calendar.DAY_OF_MONTH)
    val primerDia = fechaCal.get(Calendar.DAY_OF_WEEK)
    val offset = (primerDia + 5) % 7

    val fechaSeleccionada = remember(seleccion) {
        Calendar.getInstance().apply {
            set(
                seleccion.substring(0, 4).toInt(),
                seleccion.substring(5, 7).toInt() - 1,
                seleccion.substring(8, 10).toInt()
            )
        }
    }

    val tareasDelDia = tareas.filter { it.fecha == seleccion }
    val fechasConTareas = tareas.filter { !it.hecha }.map { it.fecha }.toSet()
    val mesesConTareas = fechasConTareas.map { it.substring(0, 7) }.toSet()

    val cabeceras = remember(locale) {
        val lunes = Calendar.getInstance().apply {
            set(2024, Calendar.JANUARY, 1)
            set(Calendar.HOUR_OF_DAY, 12)
        }
        (0..6).map { i ->
            lunes.clone().let {
                (it as Calendar).add(Calendar.DAY_OF_MONTH, i)
                fmtCelda.format(it.time).uppercase(locale)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(2.dp, RoundedCornerShape(14.dp))
                .background(Color.White, RoundedCornerShape(14.dp))
                .padding(4.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            PestanaCalendario(
                texto = Textos.t(idioma, "mes"),
                activa = pestana == "mes",
                modifier = Modifier.weight(1f)
            ) { pestana = "mes" }
            PestanaCalendario(
                texto = Textos.t(idioma, "ano"),
                activa = pestana == "ano",
                modifier = Modifier.weight(1f)
            ) { pestana = "ano" }
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (pestana == "ano") {
            GridAnio(
                anio = anio,
                locale = locale,
                mesesConTareas = mesesConTareas,
                anioActual = anioInicial,
                mesActual = mesInicial,
                onElegirMes = { mesElegido ->
                    mes = mesElegido
                    seleccion = claveFecha(anio, mesElegido,
                        Calendar.getInstance().get(Calendar.DAY_OF_MONTH).coerceAtMost(
                            Calendar.getInstance().apply { set(anio, mesElegido, 1) }
                                .getActualMaximum(Calendar.DAY_OF_MONTH)))
                    pestana = "mes"
                }
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { anio-- }) {
                    Icon(
                        Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                        contentDescription = null,
                        tint = PaletaStickly.primary
                    )
                }
                Text(
                    text = anio.toString(),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = PaletaStickly.textDark
                )
                IconButton(onClick = { anio++ }) {
                    Icon(
                        Icons.AutoMirrored.Filled.KeyboardArrowRight,
                        contentDescription = null,
                        tint = PaletaStickly.primary
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        } else {

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = {
                if (mes == 0) { mes = 11; anio-- } else mes--
            }) {
                Icon(
                    Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                    contentDescription = null,
                    tint = PaletaStickly.primary
                )
            }
            Text(
                text = fmtMes.format(fechaCal.time).replaceFirstChar { it.uppercase(locale) },
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = PaletaStickly.textDark,
                modifier = Modifier.weight(1f),
                textAlign = TextAlign.Center
            )
            IconButton(onClick = {
                if (mes == 11) { mes = 0; anio++ } else mes++
            }) {
                Icon(
                    Icons.AutoMirrored.Filled.KeyboardArrowRight,
                    contentDescription = null,
                    tint = PaletaStickly.primary
                )
            }
        }

        Row(modifier = Modifier.fillMaxWidth()) {
            cabeceras.forEach { dia ->
                Text(
                    text = dia,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PaletaStickly.textDark.copy(alpha = 0.5f),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        val celdas = offset + diasDelMes
        val filas = (celdas + 6) / 7
        for (fila in 0 until filas) {
            Row(modifier = Modifier.fillMaxWidth()) {
                for (col in 0 until 7) {
                    val indice = fila * 7 + col
                    val dia = indice - offset + 1
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(46.dp)
                            .padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        if (dia in 1..diasDelMes) {
                            val clave = claveFecha(anio, mes, dia)
                            val esSeleccion = clave == seleccion
                            val esHoy = clave == fechaHoy
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when {
                                            esSeleccion -> PaletaStickly.primary
                                            esHoy -> PaletaStickly.primaryLight
                                            else -> Color.Transparent
                                        }
                                    )
                                    .then(
                                        if (!esSeleccion && !esHoy) Modifier.border(0.dp, Color.Transparent, CircleShape)
                                        else Modifier
                                    )
                                    .clickable { seleccion = clave },
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = dia.toString(),
                                        fontSize = 13.sp,
                                        fontWeight = if (esSeleccion || esHoy) FontWeight.Bold else FontWeight.Normal,
                                        color = when {
                                            esSeleccion -> Color.White
                                            esHoy -> PaletaStickly.primaryDark
                                            else -> PaletaStickly.textDark
                                        }
                                    )
                                    if (clave in fechasConTareas) {
                                        Box(
                                            modifier = Modifier
                                                .size(4.dp)
                                                .clip(CircleShape)
                                                .background(PaletaStickly.primary)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        }

        Text(
            text = fmtDiaCorto.format(fechaSeleccionada.time).replaceFirstChar { it.uppercase(locale) },
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = PaletaStickly.textDark
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (tareasDelDia.isEmpty()) {
            Text(
                text = Textos.t(idioma, "sinTareas"),
                fontSize = 13.sp,
                color = PaletaStickly.textDark.copy(alpha = 0.5f),
                modifier = Modifier.padding(vertical = 8.dp)
            )
        } else {
            tareasDelDia.forEach { tarea ->
                FilaTarea(
                    tarea = tarea,
                    idioma = idioma,
                    onToggle = { viewModel.guardarTarea(tarea.copy(hecha = !tarea.hecha)) },
                    onBorrar = { viewModel.borrarTarea(tarea) }
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = { mostrarDialogo = true },
            modifier = Modifier
                .fillMaxWidth()
                .shadow(4.dp, RoundedCornerShape(16.dp))
                .clip(RoundedCornerShape(16.dp)),
            shape = RoundedCornerShape(16.dp)
        ) {
            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(Textos.t(idioma, "anadirTarea"), fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(24.dp))
    }

    if (mostrarDialogo) {
        AlertDialog(
            onDismissRequest = { mostrarDialogo = false },
            title = { Text(Textos.t(idioma, "nuevaTarea"), fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    OutlinedTextField(
                        value = tituloTarea,
                        onValueChange = { tituloTarea = it },
                        label = { Text(Textos.t(idioma, "titulo")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedTextField(
                        value = materiaTarea,
                        onValueChange = { materiaTarea = it },
                        label = { Text(Textos.t(idioma, "materia")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    if (tituloTarea.isNotBlank()) {
                        viewModel.guardarTarea(
                            Tarea(
                                titulo = tituloTarea.trim(),
                                fecha = seleccion,
                                materia = materiaTarea.trim()
                            )
                        )
                        tituloTarea = ""
                        materiaTarea = ""
                        mostrarDialogo = false
                    }
                }) {
                    Text(Textos.t(idioma, "anadirTarea"), fontWeight = FontWeight.SemiBold)
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarDialogo = false }) {
                    Text(Textos.t(idioma, "cancelar"))
                }
            }
        )
    }
}

@Composable
private fun PestanaCalendario(
    texto: String,
    activa: Boolean,
    modifier: Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(if (activa) PaletaStickly.primary else Color.Transparent)
            .clickable(onClick = onClick)
            .padding(vertical = 9.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = texto,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = if (activa) Color.White else PaletaStickly.textDark.copy(alpha = 0.65f)
        )
    }
}

@Composable
private fun GridAnio(
    anio: Int,
    locale: Locale,
    mesesConTareas: Set<String>,
    anioActual: Int,
    mesActual: Int,
    onElegirMes: (Int) -> Unit
) {
    val fmtMesCorto = remember(locale) { SimpleDateFormat("MMM", locale) }
    val hoy = Calendar.getInstance()

    Column {
        (0..2).map { fila ->
            Row(modifier = Modifier.fillMaxWidth()) {
                (0..3).map { col ->
                    val mesIdx = fila * 4 + col
                    val fechaMes = Calendar.getInstance().apply { set(anio, mesIdx, 1) }
                    val claveMes = String.format(Locale.ROOT, "%04d-%02d", anio, mesIdx + 1)
                    val tieneTareas = claveMes in mesesConTareas
                    val esActual = anio == anioActual && mesIdx == mesActual
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .padding(4.dp)
                            .height(74.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (esActual) PaletaStickly.primaryLight else Color.White,
                                RoundedCornerShape(14.dp)
                            )
                            .clickable { onElegirMes(mesIdx) }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = fmtMesCorto.format(fechaMes.time)
                                    .replaceFirstChar { it.uppercase(locale) },
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (esActual) PaletaStickly.primaryDark
                                else PaletaStickly.textDark
                            )
                            Text(
                                text = anio.toString(),
                                fontSize = 10.sp,
                                color = PaletaStickly.textDark.copy(alpha = 0.45f)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Box(
                                modifier = Modifier
                                    .size(5.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (tieneTareas) PaletaStickly.primary else Color.Transparent
                                    )
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun FilaTarea(
    tarea: Tarea,
    idioma: String,
    onToggle: () -> Unit,
    onBorrar: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .shadow(2.dp, RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .padding(horizontal = 8.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(checked = tarea.hecha, onCheckedChange = { onToggle() })
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = tarea.titulo,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = PaletaStickly.textDark,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                textDecoration = if (tarea.hecha) TextDecoration.LineThrough else null
            )
            if (tarea.materia.isNotBlank()) {
                Text(
                    text = tarea.materia,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PaletaStickly.primary
                )
            }
        }
        IconButton(onClick = onBorrar, modifier = Modifier.size(36.dp)) {
            Icon(
                Icons.Default.Delete,
                contentDescription = Textos.t(idioma, "eliminar"),
                tint = PaletaStickly.textDark.copy(alpha = 0.4f),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}
