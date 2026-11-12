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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.theme.PaletaStickly

@Composable
fun AvisoDialogo(
    titulo: String,
    texto: String,
    onCerrar: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onCerrar,
        title = { Text(titulo, fontWeight = FontWeight.Bold) },
        text = { Text(texto) },
        confirmButton = {
            TextButton(onClick = onCerrar) {
                Text(Textos.t("es", "ok"), fontWeight = FontWeight.SemiBold)
            }
        }
    )
}

@Composable
fun PerfilScreen(
    idioma: String,
    onSalir: () -> Unit
) {
    var aviso by remember { mutableStateOf<String?>(null) }
    var confirmarSalir by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(24.dp))

        Box(
            modifier = Modifier
                .size(96.dp)
                .shadow(6.dp, CircleShape)
                .background(PaletaStickly.primaryLight, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.Person,
                contentDescription = null,
                modifier = Modifier.size(52.dp),
                tint = PaletaStickly.primary
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "Stickly",
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp,
            color = PaletaStickly.textDark
        )
        Text(
            text = Textos.t(idioma, "version"),
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.55f)
        )

        Spacer(modifier = Modifier.height(32.dp))

        FilaPerfil(Icons.Default.Person, Textos.t(idioma, "cambiarFoto")) {
            aviso = "cambiarFotoProx"
        }
        FilaPerfil(Icons.Default.Sync, Textos.t(idioma, "sincronizar")) {
            aviso = "syncProx"
        }
        FilaPerfil(Icons.Default.Info, Textos.t(idioma, "infoApp")) {
            aviso = "versionApp"
        }
        FilaPerfil(Icons.Default.Logout, Textos.t(idioma, "cerrarSesion"), salida = true) {
            confirmarSalir = true
        }

        aviso?.let { clave ->
            AvisoDialogo(
                titulo = if (clave == "versionApp") Textos.t(idioma, "about")
                else Textos.t(idioma, "proximamente"),
                texto = Textos.t(idioma, clave),
                onCerrar = { aviso = null }
            )
        }

        if (confirmarSalir) {
            AlertDialog(
                onDismissRequest = { confirmarSalir = false },
                title = { Text(Textos.t(idioma, "salir"), fontWeight = FontWeight.Bold) },
                text = { Text(Textos.t(idioma, "salirPregunta")) },
                confirmButton = {
                    TextButton(onClick = {
                        confirmarSalir = false
                        onSalir()
                    }) {
                        Text(Textos.t(idioma, "si"), fontWeight = FontWeight.SemiBold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { confirmarSalir = false }) {
                        Text(Textos.t(idioma, "no"))
                    }
                }
            )
        }
    }
}

@Composable
private fun FilaPerfil(
    icono: ImageVector,
    texto: String,
    salida: Boolean = false,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 5.dp)
            .shadow(2.dp, RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icono,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = if (salida) Color(0xFFDC2626) else PaletaStickly.primary
        )
        Spacer(modifier = Modifier.width(14.dp))
        Text(
            text = texto,
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
            color = if (salida) Color(0xFFDC2626) else PaletaStickly.textDark,
            modifier = Modifier.weight(1f)
        )
    }
}
