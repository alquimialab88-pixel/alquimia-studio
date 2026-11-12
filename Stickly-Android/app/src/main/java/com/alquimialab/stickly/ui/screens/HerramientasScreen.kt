package com.alquimialab.stickly.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.StickyNote2
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.theme.PaletaStickly

@Composable
fun HerramientasScreen(
    idioma: String,
    onCalendario: () -> Unit,
    onCronometro: () -> Unit,
    onCuadernos: () -> Unit,
    onNotas: () -> Unit,
    onContrasenas: () -> Unit
) {
    val herramientas = listOf(
        Triple(Icons.Default.CalendarMonth, Textos.t(idioma, "tabCalendario"), onCalendario),
        Triple(Icons.Default.Timer, Textos.t(idioma, "tabCronometro"), onCronometro),
        Triple(Icons.Default.Book, Textos.t(idioma, "cuadernos"), onCuadernos),
        Triple(Icons.Default.StickyNote2, Textos.t(idioma, "notas"), onNotas),
        Triple(Icons.Default.Lock, Textos.t(idioma, "contrasenas"), onContrasenas)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Text(
            text = Textos.t(idioma, "herramientas"),
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = PaletaStickly.textDark,
            modifier = Modifier.padding(start = 20.dp, top = 24.dp, end = 20.dp, bottom = 8.dp)
        )
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(herramientas.size) { i ->
                val (icono, etiqueta, accion) = herramientas[i]
                Column(
                    modifier = Modifier
                        .shadow(4.dp, RoundedCornerShape(20.dp))
                        .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(20.dp))
                        .clickable(onClick = accion)
                        .padding(vertical = 22.dp, horizontal = 12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(52.dp)
                            .background(PaletaStickly.primaryLight, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            icono,
                            contentDescription = etiqueta,
                            tint = PaletaStickly.primary,
                            modifier = Modifier.size(26.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = etiqueta,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PaletaStickly.textDark
                    )
                }
            }
        }
    }
}
