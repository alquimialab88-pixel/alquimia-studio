package com.alquimialab.stickly.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Contrasena
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.MainViewModel
import com.alquimialab.stickly.ui.theme.PaletaStickly

@Composable
fun ContrasenasScreen(
    viewModel: MainViewModel,
    idioma: String,
    desbloqueado: Boolean,
    onDesbloquear: () -> Unit,
    onVolver: () -> Unit
) {
    val contrasenas by viewModel.contrasenas.collectAsState()
    val clipboard = LocalClipboardManager.current
    val context = LocalContext.current
    var filas by remember { mutableStateOf<List<Contrasena>>(emptyList()) }

    LaunchedEffect(contrasenas, desbloqueado) {
        filas = if (desbloqueado) viewModel.descifrarContrasenas(contrasenas) else emptyList()
    }

    if (!desbloqueado) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                Icons.Default.Lock,
                contentDescription = null,
                modifier = Modifier.size(46.dp),
                tint = PaletaStickly.primary
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = Textos.t(idioma, "pinNeeded"),
                fontSize = 19.sp,
                fontWeight = FontWeight.Bold,
                color = PaletaStickly.textDark
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = Textos.t(idioma, "pinNeededText"),
                fontSize = 13.sp,
                color = PaletaStickly.textDark.copy(alpha = 0.6f),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(modifier = Modifier.height(18.dp))
            Button(onClick = onDesbloquear) {
                Text(Textos.t(idioma, "desbloquear"))
            }
            Spacer(modifier = Modifier.height(8.dp))
            TextButton(onClick = onVolver) {
                Text(Textos.t(idioma, "cerrar"))
            }
        }
        return
    }

    var editando by remember { mutableStateOf<Contrasena?>(null) }
    var nuevo by remember { mutableStateOf(false) }
    var visibleId by remember { mutableStateOf<Long?>(null) }

    var titulo by remember { mutableStateOf("") }
    var usuario by remember { mutableStateOf("") }
    var clave by remember { mutableStateOf("") }
    var url by remember { mutableStateOf("") }
    var nota by remember { mutableStateOf("") }

    fun abrirEditor(base: Contrasena?, crear: Boolean) {
        titulo = base?.titulo ?: ""
        usuario = base?.usuario ?: ""
        clave = base?.clave ?: ""
        url = base?.url ?: ""
        nota = base?.nota ?: ""
        if (crear) {
            nuevo = true
            editando = null
        } else {
            nuevo = false
            editando = base
        }
    }

    if (nuevo || editando != null) {
        AlertDialog(
            onDismissRequest = { nuevo = false; editando = null },
            title = {
                Text(
                    text = Textos.t(
                        idioma,
                        if (nuevo) "nuevaContrasena" else "editar"
                    ),
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = titulo,
                        onValueChange = { titulo = it },
                        label = { Text(Textos.t(idioma, "titulo")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = usuario,
                        onValueChange = { usuario = it },
                        label = { Text(Textos.t(idioma, "usuario")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = clave,
                        onValueChange = { clave = it },
                        label = { Text(Textos.t(idioma, "clave")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = url,
                        onValueChange = { url = it },
                        label = { Text(Textos.t(idioma, "sitioWeb")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = nota,
                        onValueChange = { nota = it },
                        label = { Text(Textos.t(idioma, "notaAdicional")) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    if (titulo.isNotBlank() || clave.isNotBlank()) {
                        val base = editando ?: Contrasena()
                        viewModel.guardarContrasena(
                            base.copy(
                                titulo = titulo.trim(),
                                usuario = usuario.trim(),
                                clave = clave.trim(),
                                url = url.trim(),
                                nota = nota.trim()
                            )
                        )
                    }
                    nuevo = false
                    editando = null
                }) {
                    Text(Textos.t(idioma, "guardar"), fontWeight = FontWeight.SemiBold)
                }
            },
            dismissButton = {
                TextButton(onClick = { nuevo = false; editando = null }) {
                    Text(Textos.t(idioma, "cancelar"))
                }
            }
        )
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
            IconButton(onClick = onVolver) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = null,
                    tint = PaletaStickly.textDark
                )
            }
            Text(
                text = Textos.t(idioma, "contrasenas"),
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = PaletaStickly.textDark,
                modifier = Modifier.weight(1f)
            )
            Button(onClick = { abrirEditor(null, crear = true) }) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(Textos.t(idioma, "nuevaContrasena"), fontSize = 13.sp)
            }
        }

        if (filas.isEmpty()) {
            Text(
                text = Textos.t(idioma, "sinContrasenas"),
                fontSize = 14.sp,
                color = PaletaStickly.textDark.copy(alpha = 0.5f),
                modifier = Modifier.padding(32.dp)
            )
        } else {
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filas, key = { it.id }) { c ->
                    val oculta = visibleId != c.id
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .shadow(2.dp, RoundedCornerShape(16.dp))
                            .background(Color.White, RoundedCornerShape(16.dp))
                            .padding(horizontal = 14.dp, vertical = 12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = c.titulo.ifBlank { Textos.t(idioma, "contrasenas") },
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = PaletaStickly.textDark,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                if (c.usuario.isNotBlank()) {
                                    Text(
                                        text = c.usuario,
                                        fontSize = 12.sp,
                                        color = PaletaStickly.textDark.copy(alpha = 0.6f),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                            IconButton(onClick = {
                                visibleId = if (oculta) c.id else null
                            }) {
                                Icon(
                                    if (oculta) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    contentDescription = if (oculta) Textos.t(idioma, "verClave")
                                    else Textos.t(idioma, "ocultarClave"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.primary
                                )
                            }
                            IconButton(onClick = {
                                clipboard.setText(AnnotatedString(c.clave))
                                Toast.makeText(context, Textos.t(idioma, "copiado"), Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(
                                    Icons.Default.ContentCopy,
                                    contentDescription = Textos.t(idioma, "copiado"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.primary
                                )
                            }
                            IconButton(onClick = { abrirEditor(c, crear = false) }) {
                                Icon(
                                    Icons.Default.Edit,
                                    contentDescription = Textos.t(idioma, "editar"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.primary
                                )
                            }
                            IconButton(onClick = { viewModel.borrarContrasena(c) }) {
                                Icon(
                                    Icons.Default.Delete,
                                    contentDescription = Textos.t(idioma, "eliminar"),
                                    modifier = Modifier.size(18.dp),
                                    tint = PaletaStickly.textDark.copy(alpha = 0.35f)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (oculta) "••••••••" else c.clave,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (oculta) PaletaStickly.textDark.copy(alpha = 0.45f)
                            else PaletaStickly.primaryDark,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        if (c.url.isNotBlank()) {
                            Text(
                                text = c.url,
                                fontSize = 11.sp,
                                color = PaletaStickly.textDark.copy(alpha = 0.5f),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                        if (c.nota.isNotBlank()) {
                            Text(
                                text = c.nota,
                                fontSize = 11.sp,
                                color = PaletaStickly.textDark.copy(alpha = 0.5f),
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }
        }
    }
}
