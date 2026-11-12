package com.alquimialab.stickly.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.StickyNote2
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.theme.MoradoSuave
import com.alquimialab.stickly.ui.theme.PaletaStickly

@Composable
fun MenuScreen(
    idioma: String,
    nombre: String,
    onGuardarNombre: (String) -> Unit,
    onNotas: () -> Unit,
    onCalendario: () -> Unit,
    onCuaderno: () -> Unit,
    onContrasenas: () -> Unit,
    onAjustes: () -> Unit,
    onSalir: () -> Unit
) {
    var aviso by remember { mutableStateOf<String?>(null) }
    var editarNombre by remember { mutableStateOf(false) }
    var nombreTemp by remember { mutableStateOf(nombre) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .shadow(6.dp, RoundedCornerShape(24.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(PaletaStickly.primaryLight, MoradoSuave)
                    ),
                    RoundedCornerShape(24.dp)
                )
                .padding(24.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(58.dp)
                        .shadow(4.dp, CircleShape)
                        .background(Color.White, CircleShape)
                        .clickable {
                            nombreTemp = nombre
                            editarNombre = true
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Person,
                        contentDescription = Textos.t(idioma, "editar"),
                        modifier = Modifier.size(34.dp),
                        tint = PaletaStickly.primary
                    )
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = nombre.ifBlank { Textos.t(idioma, "tuNombre") },
                        fontWeight = FontWeight.Bold,
                        fontSize = 22.sp,
                        color = PaletaStickly.primaryDark
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Stickly · Alquimia Lab",
                        fontSize = 12.sp,
                        color = PaletaStickly.textDark.copy(alpha = 0.6f)
                    )
                }
            }
        }

        FilaMenu(Icons.Default.StickyNote2, Textos.t(idioma, "notas")) { onNotas() }
        FilaMenu(Icons.Default.CalendarMonth, Textos.t(idioma, "tabCalendario")) { onCalendario() }
        FilaMenu(Icons.Default.Book, Textos.t(idioma, "cuaderno")) { onCuaderno() }
        FilaMenu(Icons.Default.Lock, Textos.t(idioma, "contrasenas")) { onContrasenas() }
        FilaMenu(Icons.Default.Settings, Textos.t(idioma, "config")) { onAjustes() }
        FilaMenu(Icons.Default.Logout, Textos.t(idioma, "salir"), esSalida = true) { onSalir() }

        Spacer(modifier = Modifier.height(24.dp))

        if (editarNombre) {
            AlertDialog(
                onDismissRequest = { editarNombre = false },
                title = { Text(Textos.t(idioma, "tuNombre"), fontWeight = FontWeight.Bold) },
                text = {
                    OutlinedTextField(
                        value = nombreTemp,
                        onValueChange = { nombreTemp = it },
                        singleLine = true,
                        label = { Text(Textos.t(idioma, "nombre")) }
                    )
                },
                confirmButton = {
                    TextButton(onClick = {
                        onGuardarNombre(nombreTemp)
                        editarNombre = false
                    }) {
                        Text(Textos.t(idioma, "guardar"), fontWeight = FontWeight.SemiBold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { editarNombre = false }) {
                        Text(Textos.t(idioma, "cancelar"))
                    }
                }
            )
        }

        aviso?.let { clave ->
            AvisoDialogo(
                titulo = Textos.t(idioma, "proximamente"),
                texto = Textos.t(idioma, clave),
                onCerrar = { aviso = null }
            )
        }
    }
}

@Composable
private fun FilaMenu(
    icono: ImageVector,
    texto: String,
    esSalida: Boolean = false,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 5.dp)
            .shadow(2.dp, RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .background(
                    if (esSalida) Color(0xFFFEE2E2) else PaletaStickly.primaryLight,
                    RoundedCornerShape(12.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icono,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = if (esSalida) Color(0xFFDC2626) else PaletaStickly.primary
            )
        }
        Spacer(modifier = Modifier.width(14.dp))
        Text(
            text = texto,
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
            color = if (esSalida) Color(0xFFDC2626) else PaletaStickly.textDark,
            modifier = Modifier.weight(1f)
        )
        Icon(
            Icons.AutoMirrored.Filled.KeyboardArrowRight,
            contentDescription = null,
            tint = if (esSalida) Color(0xFFDC2626) else PaletaStickly.textDark.copy(alpha = 0.35f)
        )
    }
}
