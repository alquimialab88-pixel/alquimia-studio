package com.alquimialab.stickly

import android.app.Activity
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.StickyNote2
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.alquimialab.stickly.data.PinStore
import com.alquimialab.stickly.data.PostIt
import com.alquimialab.stickly.data.Textos
import com.alquimialab.stickly.ui.MainViewModel
import com.alquimialab.stickly.ui.screens.AjustesScreen
import com.alquimialab.stickly.ui.screens.AvisoDialogo
import com.alquimialab.stickly.ui.screens.CalendarioScreen
import com.alquimialab.stickly.ui.screens.ContrasenasScreen
import com.alquimialab.stickly.ui.screens.CronometroScreen
import com.alquimialab.stickly.ui.screens.CuadernosScreen
import com.alquimialab.stickly.ui.screens.HerramientasScreen
import com.alquimialab.stickly.ui.screens.HomeScreen
import com.alquimialab.stickly.ui.screens.MenuScreen
import com.alquimialab.stickly.ui.screens.ModoPin
import com.alquimialab.stickly.ui.screens.NotasScreen
import com.alquimialab.stickly.ui.screens.PerfilScreen
import com.alquimialab.stickly.ui.screens.PinScreen
import com.alquimialab.stickly.ui.screens.PostItEditorScreen
import com.alquimialab.stickly.ui.theme.AcentoMorado
import com.alquimialab.stickly.ui.theme.BarraLavanda
import com.alquimialab.stickly.ui.theme.PaletaStickly
import com.alquimialab.stickly.ui.theme.SticklyTheme
import java.util.Locale
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SticklyTheme {
                SticklyApp()
            }
        }
    }
}

private object Navegacion {
    const val INICIO = "inicio"
    const val MENU = "menu"
    const val NOTAS = "notas"
    const val CALENDARIO = "calendario"
    const val CRONOMETRO = "cronometro"
    const val PERFIL = "perfil"
    const val EDITOR = "editor"
    const val PIN = "pin"
    const val CUADERNOS = "cuadernos"
    const val CONTRASENAS = "contrasenas"
    const val HERRAMIENTAS = "herramientas"
    const val AJUSTES = "ajustes"
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SticklyApp(viewModel: MainViewModel = viewModel()) {
    val navController = rememberNavController()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val lifecycleOwner = LocalLifecycleOwner.current
    val pinStore = remember { PinStore(context) }

    var idioma by remember { mutableStateOf(Textos.idiomaSistema(Locale.getDefault())) }
    var postItEditando by remember { mutableStateOf<PostIt?>(null) }
    var categoriaNueva by remember { mutableStateOf("importante") }
    var pinModo by remember { mutableStateOf(ModoPin.VERIFICAR) }
    var pinPendiente by remember { mutableStateOf("") }
    var postItPendientePrivado by remember { mutableStateOf<PostIt?>(null) }
    var tienePin by remember { mutableStateOf(false) }
    var desbloqueado by remember { mutableStateOf(false) }
    var autoBloqueo by remember { mutableStateOf(5) }
    var mostrarCrear by remember { mutableStateOf(false) }
    var confirmarSalir by remember { mutableStateOf(false) }
    var vaultPendiente by remember { mutableStateOf(false) }
    var nombre by remember { mutableStateOf("") }

    val aviso by viewModel.aviso.collectAsState()
    val notaPrivadaAbierta by rememberUpdatedState(postItEditando?.privada == true)

    LaunchedEffect(Unit) {
        tienePin = pinStore.hayPin()
        desbloqueado = pinStore.estaDesbloqueado()
        nombre = pinStore.obtenerNombre()
        autoBloqueo = pinStore.obtenerAutoBloqueo()
        val guardado = pinStore.obtenerIdioma()
        if (guardado in Textos.IDIOMAS_SOPORTADOS) idioma = guardado
        viewModel.idioma.value = idioma
        viewModel.cargarNombre()
    }

    LaunchedEffect(idioma) {
        viewModel.idioma.value = idioma
    }

    LaunchedEffect(aviso) {
        if (aviso == "importDone") {
            tienePin = pinStore.hayPin()
            nombre = pinStore.obtenerNombre()
            desbloqueado = false
            autoBloqueo = pinStore.obtenerAutoBloqueo()
        }
    }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_STOP -> pinStore.marcarFondo()
                Lifecycle.Event.ON_START -> scope.launch {
                    if (pinStore.debeBloquear()) {
                        desbloqueado = false
                        val ruta = navController.currentDestination?.route
                        if (ruta == Navegacion.CONTRASENAS || (ruta == Navegacion.EDITOR && notaPrivadaAbierta)) {
                            navController.popBackStack()
                        }
                    }
                }
                else -> Unit
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    val backStack by navController.currentBackStackEntryAsState()
    val rutaActual = backStack?.destination?.route

    fun irA(ruta: String) {
        navController.navigate(ruta) {
            popUpTo(Navegacion.INICIO) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    fun pedirPin(nota: PostIt? = null, vault: Boolean = false) {
        postItPendientePrivado = nota
        vaultPendiente = vault
        pinModo = if (tienePin) ModoPin.VERIFICAR else ModoPin.CREAR
        navController.navigate(Navegacion.PIN)
    }

    fun abrirVault() {
        if (tienePin && desbloqueado) {
            navController.navigate(Navegacion.CONTRASENAS)
        } else {
            pedirPin(vault = true)
        }
    }

    fun abrirNota(nota: PostIt) {
        if (!nota.privada) {
            postItEditando = nota
            navController.navigate(Navegacion.EDITOR)
            return
        }
        if (desbloqueado) {
            scope.launch {
                postItEditando = viewModel.abrirPostIt(nota)
                navController.navigate(Navegacion.EDITOR)
            }
        } else {
            pedirPin(nota)
        }
    }

    Scaffold(
        bottomBar = {
            BarraInferior(
                idioma = idioma,
                rutaActual = rutaActual,
                onTab = ::irA,
                onCrear = { mostrarCrear = true }
            )
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Navegacion.INICIO,
            modifier = Modifier.padding(padding)
        ) {
            composable(Navegacion.INICIO) {
                HomeScreen(
                    viewModel = viewModel,
                    idioma = idioma,
                    nombre = nombre,
                    onAbrirNota = ::abrirNota,
                    onAnadirTarea = { irA(Navegacion.CALENDARIO) }
                )
            }

            composable(Navegacion.NOTAS) {
                NotasScreen(
                    viewModel = viewModel,
                    onAbrirNota = ::abrirNota
                )
            }

            composable(Navegacion.MENU) {
                MenuScreen(
                    idioma = idioma,
                    nombre = nombre,
                    onGuardarNombre = { nuevo ->
                        nombre = nuevo
                        viewModel.guardarNombre(nuevo)
                    },
                    onNotas = { irA(Navegacion.NOTAS) },
                    onCalendario = { irA(Navegacion.CALENDARIO) },
                    onCuaderno = { irA(Navegacion.CUADERNOS) },
                    onContrasenas = ::abrirVault,
                    onAjustes = { navController.navigate(Navegacion.AJUSTES) },
                    onSalir = { confirmarSalir = true }
                )
            }

            composable(Navegacion.CALENDARIO) {
                CalendarioScreen(viewModel = viewModel, idioma = idioma)
            }

            composable(Navegacion.HERRAMIENTAS) {
                HerramientasScreen(
                    idioma = idioma,
                    onCalendario = { irA(Navegacion.CALENDARIO) },
                    onCronometro = { irA(Navegacion.CRONOMETRO) },
                    onCuadernos = { irA(Navegacion.CUADERNOS) },
                    onNotas = { irA(Navegacion.NOTAS) },
                    onContrasenas = ::abrirVault
                )
            }

            composable(Navegacion.CUADERNOS) {
                CuadernosScreen(
                    viewModel = viewModel,
                    idioma = idioma,
                    onVolver = { navController.popBackStack() }
                )
            }

            composable(Navegacion.CONTRASENAS) {
                ContrasenasScreen(
                    viewModel = viewModel,
                    idioma = idioma,
                    desbloqueado = desbloqueado,
                    onDesbloquear = { pedirPin(vault = true) },
                    onVolver = { navController.popBackStack() }
                )
            }

            composable(Navegacion.CRONOMETRO) {
                CronometroScreen(idioma = idioma)
            }

            composable(Navegacion.PERFIL) {
                PerfilScreen(
                    idioma = idioma,
                    onSalir = { confirmarSalir = true }
                )
            }

            composable(Navegacion.AJUSTES) {
                AjustesScreen(
                    idioma = idioma,
                    tienePin = tienePin,
                    desbloqueado = desbloqueado,
                    autoBloqueo = autoBloqueo,
                    onIdioma = { codigo ->
                        idioma = codigo
                        scope.launch { pinStore.guardarIdioma(codigo) }
                    },
                    onCrearPin = {
                        pinModo = ModoPin.CREAR
                        navController.navigate(Navegacion.PIN)
                    },
                    onAutoBloqueo = { minutos ->
                        autoBloqueo = minutos
                        scope.launch { pinStore.guardarAutoBloqueo(minutos) }
                    },
                    onBloquear = {
                        pinStore.bloquear()
                        desbloqueado = false
                        navController.popBackStack()
                    },
                    onExportar = { uri: Uri ->
                        viewModel.limpiarAviso()
                        viewModel.exportar(uri)
                    },
                    onImportar = { uri: Uri ->
                        viewModel.limpiarAviso()
                        viewModel.importar(uri)
                        pinStore.bloquear()
                        desbloqueado = false
                    },
                    onBorrarTodo = {
                        viewModel.borrarTodo()
                        pinStore.bloquear()
                        desbloqueado = false
                        tienePin = false
                        nombre = ""
                        navController.navigate(Navegacion.INICIO) {
                            popUpTo(Navegacion.INICIO) { inclusive = true }
                        }
                    },
                    onVolver = { navController.popBackStack() }
                )
            }

            composable(Navegacion.EDITOR) {
                PostItEditorScreen(
                    postIt = postItEditando,
                    categoriaInicial = categoriaNueva,
                    idioma = idioma,
                    tienePin = tienePin,
                    onGuardar = { viewModel.guardarPostIt(it) },
                    onBorrar = { viewModel.borrarPostIt(it) },
                    onCrearPin = {
                        pinModo = ModoPin.CREAR
                        navController.navigate(Navegacion.PIN)
                    },
                    onVolver = { navController.popBackStack() }
                )
            }

            composable(Navegacion.PIN) {
                PinScreen(
                    modo = pinModo,
                    idioma = idioma,
                    pinPendiente = pinPendiente,
                    onConfirmado = { pinCreado ->
                        when (pinModo) {
                            ModoPin.CREAR -> {
                                pinPendiente = pinCreado ?: ""
                                pinModo = ModoPin.CONFIRMAR
                            }
                            ModoPin.CONFIRMAR, ModoPin.VERIFICAR -> {
                                tienePin = true
                                desbloqueado = true
                                viewModel.migrarDatosPrivados()
                                val pendiente = postItPendientePrivado
                                val abrirVault = vaultPendiente
                                postItPendientePrivado = null
                                vaultPendiente = false
                                if (abrirVault) {
                                    navController.popBackStack()
                                    navController.navigate(Navegacion.CONTRASENAS)
                                } else if (pendiente != null) {
                                    scope.launch {
                                        postItEditando = viewModel.abrirPostIt(pendiente)
                                        navController.popBackStack()
                                        navController.navigate(Navegacion.EDITOR)
                                    }
                                } else {
                                    navController.popBackStack()
                                }
                            }
                        }
                    },
                    onVolver = {
                        postItPendientePrivado = null
                        vaultPendiente = false
                        navController.popBackStack()
                    }
                )
            }
        }
    }

    if (mostrarCrear) {
        ModalBottomSheet(onDismissRequest = { mostrarCrear = false }) {
            Column(modifier = Modifier.padding(bottom = 20.dp)) {
                Text(
                    text = Textos.t(idioma, "crear"),
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 4.dp)
                )
                OpcionCrear(Icons.Default.StickyNote2, Textos.t(idioma, "opcionNota"), PaletaStickly.primary) {
                    mostrarCrear = false
                    postItEditando = null
                    categoriaNueva = "importante"
                    navController.navigate(Navegacion.EDITOR)
                }
                OpcionCrear(Icons.Default.Lock, Textos.t(idioma, "opcionContrasena"), PaletaStickly.primaryDark) {
                    mostrarCrear = false
                    abrirVault()
                }
                OpcionCrear(Icons.Default.Book, Textos.t(idioma, "opcionCuaderno"), PaletaStickly.primary) {
                    mostrarCrear = false
                    navController.navigate(Navegacion.CUADERNOS)
                }
                OpcionCrear(Icons.Default.CalendarMonth, Textos.t(idioma, "opcionFecha"), PaletaStickly.primary) {
                    mostrarCrear = false
                    irA(Navegacion.CALENDARIO)
                }
            }
        }
    }

    aviso?.let { clave ->
        val titulo = when (clave) {
            "pinNeeded" -> Textos.t(idioma, "security")
            "importError" -> Textos.t(idioma, "error")
            else -> Textos.t(idioma, "config")
        }
        AvisoDialogo(
            titulo = titulo,
            texto = Textos.t(idioma, clave),
            onCerrar = { viewModel.limpiarAviso() }
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
                    pinStore.bloquear()
                    (context as? Activity)?.finishAffinity()
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

@Composable
private fun BarraInferior(
    idioma: String,
    rutaActual: String?,
    onTab: (String) -> Unit,
    onCrear: () -> Unit
) {
    Box(modifier = Modifier.fillMaxWidth()) {
        Surface(
            shadowElevation = 12.dp,
            color = BarraLavanda,
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(72.dp)
                    .padding(horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                ItemBarra(
                    icono = Icons.Default.Menu,
                    texto = Textos.t(idioma, "tabMenu"),
                    seleccionado = rutaActual == Navegacion.MENU || rutaActual == Navegacion.NOTAS,
                    modifier = Modifier.weight(1f)
                ) { onTab(Navegacion.MENU) }
                ItemBarra(
                    icono = Icons.Default.GridView,
                    texto = Textos.t(idioma, "herramientas"),
                    seleccionado = rutaActual == Navegacion.HERRAMIENTAS,
                    modifier = Modifier.weight(1f)
                ) { onTab(Navegacion.HERRAMIENTAS) }
                Spacer(modifier = Modifier.weight(1f))
                ItemBarra(
                    icono = Icons.Default.Home,
                    texto = Textos.t(idioma, "tabInicio"),
                    seleccionado = rutaActual == Navegacion.INICIO,
                    modifier = Modifier.weight(1f)
                ) { onTab(Navegacion.INICIO) }
                ItemBarra(
                    icono = Icons.Default.Person,
                    texto = Textos.t(idioma, "tabPerfil"),
                    seleccionado = rutaActual == Navegacion.PERFIL,
                    modifier = Modifier.weight(1f)
                ) { onTab(Navegacion.PERFIL) }
            }
        }
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .offset(y = (-24).dp)
                .size(56.dp)
                .shadow(8.dp, CircleShape)
                .clip(CircleShape)
                .background(PaletaStickly.primary)
                .border(3.dp, Color.White, CircleShape)
                .clickable(onClick = onCrear),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.Add,
                contentDescription = Textos.t(idioma, "crear"),
                tint = Color.White,
                modifier = Modifier.size(30.dp)
            )
        }
    }
}

@Composable
private fun ItemBarra(
    icono: ImageVector,
    texto: String,
    seleccionado: Boolean,
    modifier: Modifier,
    onClick: () -> Unit
) {
    val progreso by animateFloatAsState(
        targetValue = if (seleccionado) 1f else 0f,
        animationSpec = spring(
            dampingRatio = 0.55f,
            stiffness = Spring.StiffnessMediumLow
        ),
        label = "indicador"
    )
    Box(
        modifier = modifier
            .fillMaxHeight()
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(46.dp)
                .graphicsLayer {
                    scaleX = progreso
                    scaleY = progreso
                    alpha = progreso
                }
                .clip(CircleShape)
                .background(PaletaStickly.primary)
        )
        Icon(
            icono,
            contentDescription = texto,
            modifier = Modifier.size(24.dp),
            tint = Color.White
        )
    }
}

@Composable
private fun OpcionCrear(
    icono: ImageVector,
    texto: String,
    colorFondo: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 24.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(
                    colorFondo.copy(alpha = 0.14f),
                    RoundedCornerShape(12.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icono,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = colorFondo
            )
        }
        Spacer(modifier = Modifier.width(14.dp))
        Text(
            text = texto,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            color = PaletaStickly.textDark
        )
    }
}
