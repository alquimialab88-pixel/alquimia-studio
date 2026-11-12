package com.alquimialab.stickly.ui.screens

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.widget.Toast
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.alquimialab.stickly.data.Cuaderno
import com.alquimialab.stickly.data.NotaCuaderno
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.MainViewModel
import com.alquimialab.stickly.ui.theme.PaletaStickly
import java.io.File

private val COLORES_CUADERNO = listOf(
    "#DDD6FE", "#FEF3C7", "#BBF7D0", "#FECDD3", "#BFDBFE", "#FED7AA"
)

private fun archivoDeAudio(context: Context): File {
    val dir = File(context.filesDir, "grabaciones").apply { mkdirs() }
    return File(dir, "voz_${System.currentTimeMillis()}.3gp")
}

@Composable
fun CuadernosScreen(
    viewModel: MainViewModel,
    idioma: String,
    onVolver: () -> Unit
) {
    val cuadernos by viewModel.cuadernos.collectAsState()
    val notas by viewModel.notasCuaderno.collectAsState()

    var cuadernoAbierto by remember { mutableStateOf<Cuaderno?>(null) }
    var mostrarNuevo by remember { mutableStateOf(false) }
    var tituloNuevo by remember { mutableStateOf("") }
    var colorNuevo by remember { mutableStateOf(COLORES_CUADERNO.first()) }

    if (mostrarNuevo) {
        AlertDialog(
            onDismissRequest = { mostrarNuevo = false },
            title = { Text(Textos.t(idioma, "nuevoCuaderno"), fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    OutlinedTextField(
                        value = tituloNuevo,
                        onValueChange = { tituloNuevo = it },
                        label = { Text(Textos.t(idioma, "titulo")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        COLORES_CUADERNO.forEach { color ->
                            Box(
                                modifier = Modifier
                                    .size(30.dp)
                                    .clip(CircleShape)
                                    .background(Color(android.graphics.Color.parseColor(color)))
                                    .then(
                                        if (color == colorNuevo) Modifier.shadow(4.dp, CircleShape)
                                        else Modifier
                                    )
                                    .clickable { colorNuevo = color },
                                contentAlignment = Alignment.Center
                            ) {
                                if (color == colorNuevo) {
                                    Icon(
                                        Icons.Default.Add,
                                        contentDescription = null,
                                        modifier = Modifier.size(14.dp),
                                        tint = Color.White
                                    )
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    if (tituloNuevo.isNotBlank()) {
                        viewModel.guardarCuaderno(
                            Cuaderno(titulo = tituloNuevo.trim(), color = colorNuevo)
                        )
                        tituloNuevo = ""
                        colorNuevo = COLORES_CUADERNO.first()
                        mostrarNuevo = false
                    }
                }) {
                    Text(Textos.t(idioma, "guardar"), fontWeight = FontWeight.SemiBold)
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarNuevo = false }) {
                    Text(Textos.t(idioma, "cancelar"))
                }
            }
        )
    }

    val abierto = cuadernoAbierto
    if (abierto == null) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onVolver) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = null,
                        tint = PaletaStickly.textDark
                    )
                }
                Text(
                    text = Textos.t(idioma, "cuadernos"),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = PaletaStickly.textDark,
                    modifier = Modifier.weight(1f)
                )
                Button(onClick = { mostrarNuevo = true }) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(Textos.t(idioma, "nuevoCuaderno"), fontSize = 13.sp)
                }
            }

            if (cuadernos.isEmpty()) {
                Text(
                    text = Textos.t(idioma, "sinCuadernos"),
                    fontSize = 14.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.5f),
                    modifier = Modifier.padding(32.dp)
                )
            } else {
                LazyColumn(
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(
                        horizontal = 16.dp, vertical = 4.dp
                    ),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(cuadernos, key = { it.id }) { cuaderno ->
                        val totalNotas = notas.count { it.cuadernoId == cuaderno.id }
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .shadow(2.dp, RoundedCornerShape(16.dp))
                                .background(Color.White, RoundedCornerShape(16.dp))
                                .clickable { cuadernoAbierto = cuaderno }
                                .padding(horizontal = 14.dp, vertical = 14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(android.graphics.Color.parseColor(cuaderno.color))),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.AutoMirrored.Filled.KeyboardArrowRight,
                                    contentDescription = null,
                                    modifier = Modifier.size(18.dp),
                                    tint = Color.White
                                )
                            }
                            Spacer(modifier = Modifier.width(14.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = cuaderno.titulo,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PaletaStickly.textDark,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "$totalNotas",
                                    fontSize = 12.sp,
                                    color = PaletaStickly.textDark.copy(alpha = 0.5f)
                                )
                            }
                            IconButton(onClick = { viewModel.borrarCuaderno(cuaderno) }) {
                                Icon(
                                    Icons.Default.Delete,
                                    contentDescription = Textos.t(idioma, "eliminar"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.textDark.copy(alpha = 0.35f)
                                )
                            }
                        }
                    }
                }
            }
        }
    } else {
        DetalleCuaderno(
            cuaderno = abierto,
            notas = notas.filter { it.cuadernoId == abierto.id },
            viewModel = viewModel,
            idioma = idioma,
            onVolver = { cuadernoAbierto = null }
        )
    }
}

@Composable
private fun DetalleCuaderno(
    cuaderno: Cuaderno,
    notas: List<NotaCuaderno>,
    viewModel: MainViewModel,
    idioma: String,
    onVolver: () -> Unit
) {
    val context = LocalContext.current

    var notaEditando by remember { mutableStateOf<NotaCuaderno?>(null) }
    var tituloNota by remember { mutableStateOf("") }
    var contenidoNota by remember { mutableStateOf("") }
    var audioNota by remember { mutableStateOf("") }
    var grabando by remember { mutableStateOf(false) }
    var permisoDenegado by remember { mutableStateOf(false) }
    var archivoGrabando by remember { mutableStateOf("") }

    var recorder by remember { mutableStateOf<MediaRecorder?>(null) }
    var player by remember { mutableStateOf<MediaPlayer?>(null) }

    fun pararGrabador() {
        recorder?.let {
            try { it.stop() } catch (_: Exception) {}
            it.release()
            if (archivoGrabando.isNotBlank()) audioNota = archivoGrabando
        }
        recorder = null
        grabando = false
    }

    fun pararReproductor() {
        player?.let {
            try { it.stop() } catch (_: Exception) {}
            it.release()
        }
        player = null
    }

    fun empezarGrabar() {
        val archivo = archivoDeAudio(context)
        try {
            val r = MediaRecorder()
            @Suppress("DEPRECATION")
            r.setAudioSource(MediaRecorder.AudioSource.MIC)
            @Suppress("DEPRECATION")
            r.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            @Suppress("DEPRECATION")
            r.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
            r.setOutputFile(archivo.absolutePath)
            r.prepare()
            r.start()
            recorder = r
            grabando = true
            audioNota = ""
            archivoGrabando = archivo.absolutePath
            permisoDenegado = false
        } catch (_: Exception) {
            pararGrabador()
            Toast.makeText(context, Textos.t(idioma, "audioError"), Toast.LENGTH_SHORT).show()
        }
    }

    val launcherAudio = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { concedido ->
        if (concedido) empezarGrabar() else permisoDenegado = true
    }

    fun pedirOGrabar() {
        val concedido = ContextCompat.checkSelfPermission(
            context, Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
        if (concedido) empezarGrabar() else launcherAudio.launch(Manifest.permission.RECORD_AUDIO)
    }

    DisposableEffect(Unit) {
        onDispose {
            pararGrabador()
            pararReproductor()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = {
                pararGrabador()
                pararReproductor()
                onVolver()
            }) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = null,
                    tint = PaletaStickly.textDark
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = cuaderno.titulo,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = PaletaStickly.textDark,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = Textos.t(idioma, "cuadernos"),
                    fontSize = 11.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.5f)
                )
            }
            if (notaEditando == null) {
                Button(onClick = {
                    notaEditando = NotaCuaderno(cuadernoId = cuaderno.id)
                    tituloNota = ""
                    contenidoNota = ""
                    audioNota = ""
                }) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(Textos.t(idioma, "nuevaNota"), fontSize = 13.sp)
                }
            }
        }

        if (notaEditando == null) {
            if (notas.isEmpty()) {
                Text(
                    text = Textos.t(idioma, "sinNotasCuaderno"),
                    fontSize = 14.sp,
                    color = PaletaStickly.textDark.copy(alpha = 0.5f),
                    modifier = Modifier.padding(32.dp)
                )
            } else {
                LazyColumn(
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(
                        horizontal = 16.dp, vertical = 4.dp
                    ),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(notas, key = { it.id }) { nota ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .shadow(2.dp, RoundedCornerShape(16.dp))
                                .background(Color.White, RoundedCornerShape(16.dp))
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = if (nota.titulo.isNotBlank()) nota.titulo
                                    else Textos.t(idioma, "nuevaNota"),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PaletaStickly.textDark,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                if (nota.contenido.isNotBlank()) {
                                    Text(
                                        text = nota.contenido,
                                        fontSize = 12.sp,
                                        color = PaletaStickly.textDark.copy(alpha = 0.6f),
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                            if (nota.audioPath.isNotBlank()) {
                                IconButton(onClick = {
                                    pararReproductor()
                                    try {
                                        player = MediaPlayer().apply {
                                            setDataSource(nota.audioPath)
                                            prepare()
                                            start()
                                            setOnCompletionListener { pararReproductor() }
                                        }
                                    } catch (_: Exception) {
                                        Toast.makeText(
                                            context,
                                            Textos.t(idioma, "audioError"),
                                            Toast.LENGTH_SHORT
                                        ).show()
                                    }
                                }) {
                                    Icon(
                                        Icons.Default.PlayArrow,
                                        contentDescription = Textos.t(idioma, "reproducir"),
                                        tint = PaletaStickly.primary
                                    )
                                }
                            }
                            IconButton(onClick = {
                                if (nota.audioPath.isNotBlank()) File(nota.audioPath).delete()
                                viewModel.borrarNotaCuaderno(nota)
                            }) {
                                Icon(
                                    Icons.Default.Delete,
                                    contentDescription = Textos.t(idioma, "eliminar"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.textDark.copy(alpha = 0.35f)
                                )
                            }
                            IconButton(onClick = {
                                notaEditando = nota
                                tituloNota = nota.titulo
                                contenidoNota = nota.contenido
                                audioNota = nota.audioPath
                            }) {
                                Icon(
                                    Icons.Default.Mic,
                                    contentDescription = Textos.t(idioma, "editar"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.primary
                                )
                            }
                        }
                    }
                }
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp)
            ) {
                OutlinedTextField(
                    value = tituloNota,
                    onValueChange = { tituloNota = it },
                    label = { Text(Textos.t(idioma, "titulo")) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(
                    value = contenidoNota,
                    onValueChange = { contenidoNota = it },
                    label = { Text(Textos.t(idioma, "escribeAqui")) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = {
                            if (grabando) pararGrabador() else pedirOGrabar()
                        },
                        colors = androidx.compose.material3.ButtonDefaults.buttonColors(
                            containerColor = if (grabando) Color(0xFFDC2626) else PaletaStickly.primaryDark
                        )
                    ) {
                        Icon(
                            if (grabando) Icons.Default.Stop else Icons.Default.Mic,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (grabando) Textos.t(idioma, "detener")
                            else Textos.t(idioma, "grabar"),
                            fontSize = 13.sp
                        )
                    }
                    if (audioNota.isNotBlank() && !grabando) {
                        Button(onClick = {
                            pararReproductor()
                            try {
                                player = MediaPlayer().apply {
                                    setDataSource(audioNota)
                                    prepare()
                                    start()
                                    setOnCompletionListener { pararReproductor() }
                                }
                            } catch (_: Exception) {
                                Toast.makeText(
                                    context,
                                    Textos.t(idioma, "audioError"),
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        }) {
                            Icon(
                                Icons.Default.PlayArrow,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(Textos.t(idioma, "reproducir"), fontSize = 13.sp)
                        }
                    }
                    if (permisoDenegado) {
                        Text(
                            text = Textos.t(idioma, "permisoAudio"),
                            fontSize = 11.sp,
                            color = Color(0xFFDC2626),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(onClick = {
                        if (tituloNota.isNotBlank() || contenidoNota.isNotBlank() || audioNota.isNotBlank()) {
                            val base = notaEditando
                            viewModel.guardarNotaCuaderno(
                                (base ?: NotaCuaderno(cuadernoId = cuaderno.id)).copy(
                                    titulo = tituloNota.trim(),
                                    contenido = contenidoNota.trim(),
                                    audioPath = audioNota
                                )
                            )
                        }
                        pararGrabador()
                        notaEditando = null
                    }) {
                        Text(Textos.t(idioma, "guardar"), fontWeight = FontWeight.SemiBold)
                    }
                    TextButton(onClick = {
                        if (grabando) pararGrabador()
                        notaEditando = null
                    }) {
                        Text(Textos.t(idioma, "cancelar"))
                    }
                }
            }
        }
    }
}
