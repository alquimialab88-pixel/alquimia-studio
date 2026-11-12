package com.alquimialab.stickly.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.ViewList
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.alquimialab.stickly.data.Imagenes
import com.alquimialab.stickly.data.PostIt
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.MainViewModel
import com.alquimialab.stickly.ui.theme.PaletaStickly
import kotlin.math.roundToInt

private val CATEGORIAS = listOf("todas", "compras", "importante", "claves")

@Composable
fun NotasScreen(
    viewModel: MainViewModel,
    onAbrirNota: (PostIt) -> Unit
) {
    val idioma = viewModel.idioma.value
    val postIts by viewModel.postIts.collectAsStateWithLifecycle()

    var categoria by remember { mutableStateOf("todas") }
    var vista by remember { mutableStateOf("tablero") }

    val filtradas = if (categoria == "todas") postIts
    else postIts.filter { it.categoria == categoria }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(top = 8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = Textos.t(idioma, "notas"),
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp,
                color = PaletaStickly.textDark
            )
            Row(
                modifier = Modifier
                    .background(Color.White, RoundedCornerShape(50))
                    .padding(3.dp),
                horizontalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                TipoVista(
                    seleccionado = vista == "lista",
                    icono = Icons.Default.ViewList,
                    onClick = { vista = "lista" }
                )
                TipoVista(
                    seleccionado = vista == "tablero",
                    icono = Icons.Default.GridView,
                    onClick = { vista = "tablero" }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            CATEGORIAS.forEach { cat ->
                val clave = when (cat) {
                    "todas" -> "catTodas"
                    "compras" -> "catCompras"
                    "importante" -> "catImportante"
                    else -> "catClaves"
                }
                FilterChip(
                    selected = categoria == cat,
                    onClick = { categoria = cat },
                    label = {
                        Text(
                            text = Textos.t(idioma, clave),
                            fontSize = 13.sp
                        )
                    },
                    leadingIcon = if (cat == "claves") {
                        {
                            Icon(
                                Icons.Default.Lock,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    } else null,
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = if (cat == "claves") PaletaStickly.primaryDark else PaletaStickly.primary,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (filtradas.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(
                    text = Textos.t(
                        idioma,
                        if (categoria == "todas") "sinPostIts" else "sinCategoria"
                    ),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                )
            }
        } else if (vista == "lista") {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 96.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filtradas, key = { it.id }) { nota ->
                    NotaListaCard(
                        nota = nota,
                        idioma = idioma,
                        onTap = { onAbrirNota(nota) },
                        onBorrar = { viewModel.borrarPostIt(nota) }
                    )
                }
            }
        } else {
            TableroNotas(
                notas = filtradas,
                idioma = idioma,
                onAbrir = onAbrirNota,
                onMover = { nota, x, y -> viewModel.moverPostIt(nota, x, y) },
                onBorrar = { viewModel.borrarPostIt(it) }
            )
        }
    }
}

@Composable
private fun TipoVista(
    seleccionado: Boolean,
    icono: ImageVector,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(34.dp)
            .background(
                if (seleccionado) PaletaStickly.primary else Color.Transparent,
                RoundedCornerShape(50)
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            icono,
            contentDescription = null,
            modifier = Modifier.size(18.dp),
            tint = if (seleccionado) Color.White else PaletaStickly.textDark.copy(alpha = 0.6f)
        )
    }
}

@Composable
private fun NotaListaCard(
    nota: PostIt,
    idioma: String,
    onTap: () -> Unit,
    onBorrar: () -> Unit
) {
    val color = colorDe(nota.color)
    val miniatura = remember(nota.imagenUri) { Imagenes.miniatura(nota.imagenUri, 600) }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(3.dp, RoundedCornerShape(16.dp))
            .background(color, RoundedCornerShape(16.dp))
            .clickable(onClick = onTap)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (miniatura != null) {
            Image(
                bitmap = miniatura,
                contentDescription = null,
                modifier = Modifier
                    .size(56.dp)
                    .shadow(2.dp, RoundedCornerShape(10.dp)),
                contentScale = androidx.compose.ui.layout.ContentScale.Crop
            )
            Spacer(modifier = Modifier.width(12.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (nota.privada) {
                    Icon(
                        Icons.Default.Lock,
                        contentDescription = null,
                        modifier = Modifier.size(13.dp),
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.55f)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                }
                if (nota.privada || nota.titulo.isNotBlank()) {
                    Text(
                        text = if (nota.privada) Textos.t(idioma, "notaPrivada") else nota.titulo,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
            if (!nota.privada) {
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = when (nota.tipo) {
                        "texto" -> nota.contenido
                        else -> nota.items.split("\n")
                            .filter { it.isNotBlank() }
                            .take(3)
                            .joinToString(" · ") {
                                it.removePrefix("✓ ").removePrefix("○ ")
                            }
                    },
                    fontSize = 13.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f)
                )
            } else {
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = Textos.t(idioma, "protegida"),
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )
            }
        }
        IconButton(onClick = onBorrar, modifier = Modifier.size(32.dp)) {
            Icon(
                Icons.Default.Delete,
                contentDescription = Textos.t(idioma, "eliminar"),
                modifier = Modifier.size(17.dp),
                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
            )
        }
    }
}

@Composable
private fun TableroNotas(
    notas: List<PostIt>,
    idioma: String,
    onAbrir: (PostIt) -> Unit,
    onMover: (PostIt, Float, Float) -> Unit,
    onBorrar: (PostIt) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(bottom = 90.dp)
    ) {
        val altoMax = (notas.maxOfOrNull { it.y + it.alto } ?: 400f) + 140f
        Box(
            modifier = Modifier
                .width(400.dp)
                .height(altoMax.dp)
        ) {
            notas.forEach { nota ->
                TableroCard(
                    nota = nota,
                    idioma = idioma,
                    onTap = { onAbrir(nota) },
                    onDragEnd = { delta ->
                        onMover(
                            nota,
                            (nota.x + delta.x).coerceAtLeast(0f),
                            (nota.y + delta.y).coerceAtLeast(0f)
                        )
                    },
                    onBorrar = { onBorrar(nota) }
                )
            }
        }
    }
}

@Composable
private fun TableroCard(
    nota: PostIt,
    idioma: String,
    onTap: () -> Unit,
    onDragEnd: (Offset) -> Unit,
    onBorrar: () -> Unit
) {
    var dragOffset by remember(nota.id) { mutableStateOf(Offset.Zero) }
    val color = colorDe(nota.color)
    val miniatura = remember(nota.imagenUri) { Imagenes.miniatura(nota.imagenUri, 500) }

    Box(
        modifier = Modifier
            .offset {
                IntOffset(
                    (nota.x + dragOffset.x).roundToInt(),
                    (nota.y + dragOffset.y).roundToInt()
                )
            }
            .width(nota.ancho.dp)
            .shadow(4.dp, RoundedCornerShape(12.dp))
            .background(color, RoundedCornerShape(12.dp))
            .pointerInput(nota.id) {
                detectTapGestures(onTap = { onTap() })
            }
            .pointerInput(nota.id) {
                detectDragGestures(
                    onDragStart = { dragOffset = Offset.Zero },
                    onDrag = { change, amount ->
                        change.consume()
                        dragOffset += amount
                    },
                    onDragEnd = {
                        onDragEnd(dragOffset)
                        dragOffset = Offset.Zero
                    }
                )
            }
            .padding(10.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                if (nota.privada) {
                    Icon(
                        Icons.Default.Lock,
                        contentDescription = Textos.t(idioma, "protegida"),
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                }
                IconButton(onClick = onBorrar, modifier = Modifier.size(20.dp)) {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = Textos.t(idioma, "eliminar"),
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                    )
                }
            }
            if (nota.titulo.isNotBlank()) {
                Text(
                    text = nota.titulo,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
            if (miniatura != null) {
                Spacer(modifier = Modifier.height(4.dp))
                Image(
                    bitmap = miniatura,
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp),
                    contentScale = androidx.compose.ui.layout.ContentScale.Crop
                )
            }
            if (!nota.privada) {
                when (nota.tipo) {
                    "lista", "checklist" -> {
                        val lineas = nota.items.split("\n").filter { it.isNotBlank() }
                        lineas.take(4).forEach { linea ->
                            val hecho = linea.startsWith("✓ ")
                            val texto = linea.removePrefix("✓ ").removePrefix("○ ")
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = if (nota.tipo == "checklist") {
                                        if (hecho) "✓" else "○"
                                    } else "•",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                                )
                                Spacer(modifier = Modifier.width(3.dp))
                                Text(
                                    text = texto,
                                    fontSize = 11.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    color = MaterialTheme.colorScheme.onSurface.copy(
                                        alpha = if (hecho) 0.4f else 0.85f
                                    )
                                )
                            }
                        }
                    }
                    else -> {
                        Text(
                            text = nota.contenido,
                            fontSize = 12.sp,
                            maxLines = 6,
                            overflow = TextOverflow.Ellipsis,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
                        )
                    }
                }
            }
        }
    }
}

private fun colorDe(hex: String): Color = try {
    Color(android.graphics.Color.parseColor(hex))
} catch (_: Exception) {
    Color(0xFFFEF08A)
}
