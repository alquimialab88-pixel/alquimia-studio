package com.alquimialab.stickly.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Imagenes
import com.alquimialab.stickly.data.PostIt
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.theme.ColoresPostIt
import com.alquimialab.stickly.ui.theme.PaletaStickly

@Composable
fun PostItEditorScreen(
    postIt: PostIt?,
    categoriaInicial: String = "importante",
    idioma: String,
    tienePin: Boolean,
    onGuardar: (PostIt) -> Unit,
    onBorrar: (PostIt) -> Unit,
    onCrearPin: () -> Unit,
    onVolver: () -> Unit
) {
    val context = LocalContext.current

    var titulo by remember { mutableStateOf(postIt?.titulo ?: "") }
    var contenido by remember { mutableStateOf(postIt?.contenido ?: "") }
    var color by remember { mutableStateOf(postIt?.color ?: "#FEF08A") }
    var privada by remember { mutableStateOf(postIt?.privada ?: false) }
    var categoria by remember {
        mutableStateOf(postIt?.categoria ?: categoriaInicial)
    }
    var imagenRuta by remember { mutableStateOf(postIt?.imagenUri ?: "") }

    val tipoInicial = when (postIt?.tipo) {
        "lista" ->
            if (postIt.items.contains("✓ ") || postIt.items.contains("○ ")) "checklist"
            else "lista"
        else -> postIt?.tipo ?: "texto"
    }
    var tipo by remember { mutableStateOf(tipoInicial) }

    val items = remember {
        mutableStateListOf<String>().apply {
            if (postIt != null && postIt.items.isNotBlank()) {
                val lineas = postIt.items.split("\n")
                if (tipoInicial == "checklist") addAll(lineas)
                else addAll(lineas.map { it.removePrefix("✓ ").removePrefix("○ ") })
            }
        }
    }

    val lanzadorImagen = rememberLauncherForActivityResult(
        ActivityResultContracts.PickVisualMedia()
    ) { uri ->
        if (uri != null) {
            Imagenes.copiarAInterno(context, uri)?.let { imagenRuta = it }
        }
    }

    val miniatura = remember(imagenRuta) { Imagenes.miniatura(imagenRuta, 900) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = onVolver) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = Textos.t(idioma, "cerrar"))
            }
            Text(
                text = if (postIt == null) Textos.t(idioma, "opcionNota") else Textos.t(idioma, "editar"),
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
            if (postIt != null) {
                IconButton(onClick = { onBorrar(postIt); onVolver() }) {
                    Icon(Icons.Default.Delete, contentDescription = Textos.t(idioma, "eliminar"))
                }
            } else {
                Spacer(modifier = Modifier.size(48.dp))
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = Textos.t(idioma, "categoria"),
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("compras" to "catCompras", "importante" to "catImportante", "claves" to "catClaves")
                .forEach { (valor, clave) ->
                    FilterChip(
                        selected = categoria == valor,
                        onClick = {
                            categoria = valor
                            if (valor == "claves") privada = true
                        },
                        label = { Text(Textos.t(idioma, clave), fontSize = 13.sp) },
                        leadingIcon = if (valor == "claves") {
                            {
                                Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(14.dp))
                            }
                        } else null,
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = if (valor == "claves") PaletaStickly.primaryDark else PaletaStickly.primary,
                            selectedLabelColor = Color.White
                        )
                    )
                }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = tipo == "texto",
                onClick = { tipo = "texto" },
                label = { Text(Textos.t(idioma, "tipoTexto")) }
            )
            FilterChip(
                selected = tipo == "lista",
                onClick = { tipo = "lista" },
                label = { Text(Textos.t(idioma, "tipoBullets")) }
            )
            FilterChip(
                selected = tipo == "checklist",
                onClick = { tipo = "checklist" },
                label = { Text(Textos.t(idioma, "tipoCheck")) }
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = titulo,
            onValueChange = { titulo = it },
            label = { Text(Textos.t(idioma, "titulo")) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(12.dp))

        if (tipo == "texto") {
            OutlinedTextField(
                value = contenido,
                onValueChange = { contenido = it },
                label = { Text(Textos.t(idioma, "escribeAqui")) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
            )
        } else {
            items.forEachIndexed { indice, linea ->
                val hecho = linea.startsWith("✓ ")
                val texto = linea.removePrefix("✓ ").removePrefix("○ ")
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (tipo == "checklist") {
                        IconButton(onClick = {
                            items[indice] = if (hecho) "○ $texto" else "✓ $texto"
                        }) {
                            if (hecho) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF16A34A))
                            } else {
                                Box(
                                    modifier = Modifier
                                        .size(18.dp)
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                                )
                            }
                        }
                    } else {
                        Text(
                            text = "•",
                            fontSize = 16.sp,
                            color = PaletaStickly.primary,
                            modifier = Modifier.padding(start = 14.dp, end = 6.dp)
                        )
                    }
                    OutlinedTextField(
                        value = texto,
                        onValueChange = {
                            items[indice] = if (tipo == "checklist") {
                                (if (hecho) "✓ " else "○ ") + it
                            } else it
                        },
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                    IconButton(onClick = { items.removeAt(indice) }) {
                        Icon(Icons.Default.Close, contentDescription = Textos.t(idioma, "eliminar"))
                    }
                }
            }
            TextButton(onClick = { items.add(if (tipo == "checklist") "○ " else "") }) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(4.dp))
                Text(Textos.t(idioma, "anadirItem"))
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (imagenRuta.isBlank()) {
            TextButton(onClick = {
                lanzadorImagen.launch(
                    PickVisualMediaRequest.Builder()
                        .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly)
                        .build()
                )
            }) {
                Icon(Icons.Default.Image, contentDescription = null, tint = PaletaStickly.primary)
                Spacer(modifier = Modifier.width(6.dp))
                Text(Textos.t(idioma, "subirImagen"), color = PaletaStickly.primary)
            }
        } else {
            miniatura?.let { bmp ->
                Box {
                    Image(
                        bitmap = bmp,
                        contentDescription = null,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(170.dp)
                            .shadow(4.dp, RoundedCornerShape(14.dp))
                            .clip(RoundedCornerShape(14.dp)),
                        contentScale = ContentScale.Crop
                    )
                    IconButton(
                        onClick = { imagenRuta = "" },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(6.dp)
                            .size(30.dp)
                            .background(Color.White, CircleShape)
                    ) {
                        Icon(
                            Icons.Default.Close,
                            contentDescription = Textos.t(idioma, "quitarImagen"),
                            modifier = Modifier.size(16.dp),
                            tint = PaletaStickly.textDark
                        )
                    }
                }
            }
            TextButton(onClick = { imagenRuta = "" }) {
                Text(Textos.t(idioma, "quitarImagen"), fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = Textos.t(idioma, "color"),
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ColoresPostIt.forEach { c ->
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .shadow(2.dp, CircleShape)
                        .clip(CircleShape)
                        .background(c)
                        .clickable { color = "#%06X".format(0xFFFFFF and c.hashCode()) }
                ) {
                    if (color == "#%06X".format(0xFFFFFF and c.hashCode())) {
                        Icon(
                            Icons.Default.Check,
                            contentDescription = null,
                            modifier = Modifier.align(Alignment.Center),
                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = if (privada) Textos.t(idioma, "desmarcarPrivada") else Textos.t(idioma, "marcarPrivada"),
                    fontSize = 14.sp
                )
                if (!tienePin) {
                    TextButton(onClick = onCrearPin) {
                        Text(Textos.t(idioma, "creaPin"), fontSize = 12.sp)
                    }
                }
            }
            FilterChip(
                selected = privada,
                onClick = {
                    if (!privada && !tienePin) {
                        onCrearPin()
                    } else if (categoria != "claves") {
                        privada = !privada
                    }
                },
                label = { Text(Textos.t(idioma, "notaPrivada")) }
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        TextButton(
            onClick = {
                val lineas = items.map {
                    it.removePrefix("✓ ").removePrefix("○ ")
                }.filter { it.isNotBlank() }
                val itemsTexto = when (tipo) {
                    "checklist" -> items.filter {
                        it.removePrefix("✓ ").removePrefix("○ ").isNotBlank()
                    }.joinToString("\n")
                    else -> lineas.joinToString("\n")
                }
                onGuardar(
                    PostIt(
                        id = postIt?.id ?: 0,
                        titulo = titulo,
                        contenido = contenido,
                        tipo = tipo,
                        items = itemsTexto,
                        color = color,
                        x = postIt?.x ?: (40..200).random().toFloat(),
                        y = postIt?.y ?: (40..200).random().toFloat(),
                        ancho = postIt?.ancho ?: 170,
                        alto = postIt?.alto ?: 170,
                        privada = privada || categoria == "claves",
                        categoria = categoria,
                        imagenUri = imagenRuta,
                        timestamp = postIt?.timestamp ?: System.currentTimeMillis()
                    )
                )
                onVolver()
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(PaletaStickly.primary)
        ) {
            Text(
                text = Textos.t(idioma, "guardar"),
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        }
    }
}
