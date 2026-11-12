package com.alquimialab.stickly.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color

private val SticklyColorScheme = lightColorScheme(
    primary = PaletaStickly.primary,
    onPrimary = Color.White,
    primaryContainer = PaletaStickly.primaryLight,
    onPrimaryContainer = PaletaStickly.primaryDark,
    secondary = PaletaStickly.primaryDark,
    onSecondary = Color.White,
    background = PaletaStickly.bg,
    onBackground = PaletaStickly.textDark,
    surface = PaletaStickly.surface,
    onSurface = PaletaStickly.textDark,
    surfaceVariant = PaletaStickly.primaryLight,
    onSurfaceVariant = PaletaStickly.primaryDark,
    outline = Color(0xFFD6C9A8)
)

@Composable
fun SticklyTheme(content: @Composable () -> Unit) {
    SideEffect {
        EstadoTema.primary.value = PaletaStickly.primary
        EstadoTema.primaryDark.value = PaletaStickly.primaryDark
        EstadoTema.primaryLight.value = PaletaStickly.primaryLight
        EstadoTema.bg.value = PaletaStickly.bg
        EstadoTema.textDark.value = PaletaStickly.textDark
    }
    MaterialTheme(
        colorScheme = SticklyColorScheme,
        typography = Typography(),
        content = content
    )
}
