package com.alquimialab.stickly.ui.theme

import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.graphics.Color

data class SticklyPaleta(
    val primary: Color,
    val primaryDark: Color,
    val primaryLight: Color,
    val bg: Color,
    val surface: Color,
    val textDark: Color
)

val PaletaStickly = SticklyPaleta(
    primary = Color(0xFF6463AA),
    primaryDark = Color(0xFF4A4990),
    primaryLight = Color(0xFFEDECF8),
    bg = Color(0xFFF8F7FB),
    surface = Color.White,
    textDark = Color(0xFF2A2A3E)
)

val AcentoMorado = Color(0xFF8B89D9)
val MoradoSuave = Color(0xFFDCDBF2)
val BarraLavanda = Color(0xFFB3B0E6)

val PostItAmarillo = Color(0xFFFEF08A)
val PostItRosa = Color(0xFFFBCFE8)
val PostItAzul = Color(0xFFBAE6FD)
val PostItVerde = Color(0xFFBBF7D0)
val PostItNaranja = Color(0xFFFED7AA)
val PostItMorado = Color(0xFFE9D5FF)
val PostItBlanco = Color(0xFFF8FAFC)

val ColoresPostIt = listOf(
    PostItAmarillo, PostItRosa, PostItAzul,
    PostItVerde, PostItNaranja, PostItMorado, PostItBlanco
)

object EstadoTema {
    val primary = mutableStateOf(PaletaStickly.primary)
    val primaryDark = mutableStateOf(PaletaStickly.primaryDark)
    val primaryLight = mutableStateOf(PaletaStickly.primaryLight)
    val bg = mutableStateOf(PaletaStickly.bg)
    val textDark = mutableStateOf(PaletaStickly.textDark)
}
