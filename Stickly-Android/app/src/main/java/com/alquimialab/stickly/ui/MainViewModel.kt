package com.alquimialab.stickly.ui

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.alquimialab.stickly.data.Contrasena
import com.alquimialab.stickly.data.Cuaderno
import com.alquimialab.stickly.data.MaterialPin
import com.alquimialab.stickly.data.NotaCuaderno
import com.alquimialab.stickly.data.PinStore
import com.alquimialab.stickly.data.PostIt
import com.alquimialab.stickly.data.SticklyDatabase
import com.alquimialab.stickly.data.Tarea
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class MainViewModel(app: Application) : AndroidViewModel(app) {

    private val db = SticklyDatabase.obtener(app)
    private val postItDao = db.postItDao()
    private val tareaDao = db.tareaDao()
    private val cuadernoDao = db.cuadernoDao()
    private val notaCuadernoDao = db.notaCuadernoDao()
    private val contrasenaDao = db.contrasenaDao()
    private val pinStore = PinStore(app)

    val postIts = postItDao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val tareas = tareaDao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val cuadernos = cuadernoDao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val notasCuaderno = notaCuadernoDao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val contrasenas = contrasenaDao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val idioma = MutableStateFlow("es")

    val nombre = MutableStateFlow("")

    /** Clave de traducción del último aviso (para mostrar un diálogo). */
    val aviso = MutableStateFlow<String?>(null)

    fun limpiarAviso() {
        aviso.value = null
    }

    fun cargarNombre() {
        viewModelScope.launch {
            nombre.value = pinStore.obtenerNombre()
        }
    }

    fun guardarNombre(nombreUsuario: String) {
        viewModelScope.launch {
            pinStore.guardarNombre(nombreUsuario)
            nombre.value = nombreUsuario.trim()
        }
    }

    /* ===== Notas ===== */

    fun guardarPostIt(postIt: PostIt) {
        viewModelScope.launch {
            if (postIt.privada) {
                val enc = cifrarNota(postIt)
                if (enc == null) {
                    aviso.value = "pinNeeded"
                    return@launch
                }
                postItDao.upsert(
                    postIt.copy(
                        titulo = "",
                        contenido = "",
                        items = "",
                        imagenUri = "",
                        enc = enc
                    )
                )
            } else {
                postItDao.upsert(postIt.copy(enc = ""))
            }
        }
    }

    /** Devuelve una copia descifrada para abrir el editor. */
    suspend fun abrirPostIt(postIt: PostIt): PostIt {
        if (!postIt.privada) return postIt
        val texto = pinStore.descifrar(postIt.enc) ?: return postIt
        return try {
            val json = JSONObject(texto)
            postIt.copy(
                titulo = json.optString("titulo", ""),
                contenido = json.optString("contenido", ""),
                items = json.optString("items", ""),
                imagenUri = json.optString("imagenUri", ""),
                enc = postIt.enc
            )
        } catch (e: Exception) {
            postIt
        }
    }

    private suspend fun cifrarNota(postIt: PostIt): String? =
        pinStore.cifrar(
            JSONObject()
                .put("titulo", postIt.titulo)
                .put("contenido", postIt.contenido)
                .put("items", postIt.items)
                .put("imagenUri", postIt.imagenUri)
                .toString()
        )

    fun moverPostIt(postIt: PostIt, x: Float, y: Float) {
        viewModelScope.launch { postItDao.update(postIt.copy(x = x, y = y)) }
    }

    fun borrarPostIt(postIt: PostIt) {
        viewModelScope.launch { postItDao.delete(postIt) }
    }

    /* ===== Tareas ===== */

    fun guardarTarea(tarea: Tarea) {
        viewModelScope.launch { tareaDao.upsert(tarea) }
    }

    fun borrarTarea(tarea: Tarea) {
        viewModelScope.launch { tareaDao.delete(tarea) }
    }

    /* ===== Cuadernos ===== */

    fun guardarCuaderno(cuaderno: Cuaderno) {
        viewModelScope.launch { cuadernoDao.upsert(cuaderno) }
    }

    fun borrarCuaderno(cuaderno: Cuaderno) {
        viewModelScope.launch { cuadernoDao.delete(cuaderno) }
    }

    fun guardarNotaCuaderno(nota: NotaCuaderno) {
        viewModelScope.launch { notaCuadernoDao.upsert(nota) }
    }

    fun borrarNotaCuaderno(nota: NotaCuaderno) {
        viewModelScope.launch { notaCuadernoDao.delete(nota) }
    }

    /* ===== Contraseñas ===== */

    fun guardarContrasena(contrasena: Contrasena) {
        viewModelScope.launch {
            val enc = pinStore.cifrar(
                JSONObject()
                    .put("usuario", contrasena.usuario)
                    .put("clave", contrasena.clave)
                    .put("url", contrasena.url)
                    .put("nota", contrasena.nota)
                    .toString()
            )
            if (enc == null) {
                aviso.value = "pinNeeded"
                return@launch
            }
            contrasenaDao.upsert(
                contrasena.copy(
                    usuario = "",
                    clave = "",
                    url = "",
                    nota = "",
                    enc = enc
                )
            )
        }
    }

    /** Descifra las filas visibles de la bóveda. */
    suspend fun descifrarContrasenas(rows: List<Contrasena>): List<Contrasena> =
        rows.map { row ->
            if (row.enc.isBlank()) {
                row
            } else {
                val texto = pinStore.descifrar(row.enc)
                if (texto == null) {
                    row.copy(usuario = "", clave = "", url = "", nota = "")
                } else {
                    try {
                        val json = JSONObject(texto)
                        row.copy(
                            usuario = json.optString("usuario", ""),
                            clave = json.optString("clave", ""),
                            url = json.optString("url", ""),
                            nota = json.optString("nota", "")
                        )
                    } catch (e: Exception) {
                        row.copy(usuario = "", clave = "", url = "", nota = "")
                    }
                }
            }
        }

    fun borrarContrasena(contrasena: Contrasena) {
        viewModelScope.launch { contrasenaDao.delete(contrasena) }
    }

    /* ===== Migración de datos antiguos ===== */

    /** Cifra contraseñas y notas privadas que estaban en texto plano (versión 0.1). */
    fun migrarDatosPrivados() {
        viewModelScope.launch {
            if (!pinStore.estaDesbloqueado()) return@launch
            postItDao.todos().forEach { nota ->
                if (nota.privada && nota.enc.isBlank() &&
                    (nota.titulo.isNotBlank() || nota.contenido.isNotBlank() || nota.items.isNotBlank())
                ) {
                    val enc = cifrarNota(nota)
                    if (enc != null) {
                        postItDao.upsert(
                            nota.copy(
                                titulo = "",
                                contenido = "",
                                items = "",
                                imagenUri = "",
                                enc = enc
                            )
                        )
                    }
                }
            }
            contrasenaDao.todas().forEach { c ->
                if (c.enc.isBlank() &&
                    (c.usuario.isNotBlank() || c.clave.isNotBlank() || c.url.isNotBlank() || c.nota.isNotBlank())
                ) {
                    val enc = pinStore.cifrar(
                        JSONObject()
                            .put("usuario", c.usuario)
                            .put("clave", c.clave)
                            .put("url", c.url)
                            .put("nota", c.nota)
                            .toString()
                    )
                    if (enc != null) {
                        contrasenaDao.upsert(
                            c.copy(usuario = "", clave = "", url = "", nota = "", enc = enc)
                        )
                    }
                }
            }
        }
    }

    /* ===== Copia de seguridad ===== */

    fun exportar(uri: Uri) {
        viewModelScope.launch {
            val ok = withContext(Dispatchers.IO) {
                try {
                    val root = JSONObject()
                        .put("app", "stickly")
                        .put("version", 1)
                        .put("exportedAt", System.currentTimeMillis())
                        .put("nombre", pinStore.obtenerNombre())

                    val material = pinStore.materialPin()
                    if (material != null) {
                        root.put(
                            "pin",
                            JSONObject()
                                .put("salt", material.salt)
                                .put("iv", material.iv)
                                .put("wrap", material.wrap)
                                .put("iter", material.iter)
                        )
                    }
                    root.put("postits", JSONArray(postItDao.todos().map { it.toJson() }))
                    root.put("tareas", JSONArray(tareaDao.todas().map { it.toJson() }))
                    root.put("cuadernos", JSONArray(cuadernoDao.todos().map { it.toJson() }))
                    root.put("notasCuaderno", JSONArray(notaCuadernoDao.todas().map { it.toJson() }))
                    root.put("contrasenas", JSONArray(contrasenaDao.todas().map { it.toJson() }))

                    getApplication<Application>().contentResolver
                        .openOutputStream(uri)
                        ?.use { it.write(root.toString(2).toByteArray(Charsets.UTF_8)) }
                    true
                } catch (e: Exception) {
                    false
                }
            }
            aviso.value = if (ok) "exportDone" else "error"
        }
    }

    fun importar(uri: Uri) {
        viewModelScope.launch {
            val ok = withContext(Dispatchers.IO) {
                try {
                    val texto = getApplication<Application>().contentResolver
                        .openInputStream(uri)
                        ?.bufferedReader(Charsets.UTF_8)
                        ?.use { it.readText() }
                        ?: return@withContext false

                    val root = JSONObject(texto)
                    if (root.optString("app") != "stickly") return@withContext false

                    db.clearAllTables()

                    root.optJSONArray("postits")?.let { arr ->
                        for (i in 0 until arr.length()) {
                            arr.optJSONObject(i)?.let { postItDao.upsert(postItFrom(it)) }
                        }
                    }
                    root.optJSONArray("tareas")?.let { arr ->
                        for (i in 0 until arr.length()) {
                            arr.optJSONObject(i)?.let { tareaDao.upsert(tareaFrom(it)) }
                        }
                    }
                    root.optJSONArray("cuadernos")?.let { arr ->
                        for (i in 0 until arr.length()) {
                            arr.optJSONObject(i)?.let { cuadernoDao.upsert(cuadernoFrom(it)) }
                        }
                    }
                    root.optJSONArray("notasCuaderno")?.let { arr ->
                        for (i in 0 until arr.length()) {
                            arr.optJSONObject(i)?.let { notaCuadernoDao.upsert(notaCuadernoFrom(it)) }
                        }
                    }
                    root.optJSONArray("contrasenas")?.let { arr ->
                        for (i in 0 until arr.length()) {
                            arr.optJSONObject(i)?.let { contrasenaDao.upsert(contrasenaFrom(it)) }
                        }
                    }

                    val pin = root.optJSONObject("pin")
                    pinStore.restaurarMaterialPin(
                        if (pin == null) null
                        else MaterialPin(
                            pin.optString("salt"),
                            pin.optString("iv"),
                            pin.optString("wrap"),
                            pin.optInt("iter", 310_000)
                        )
                    )
                    pinStore.guardarNombre(root.optString("nombre", ""))
                    nombre.value = root.optString("nombre", "")
                    true
                } catch (e: Exception) {
                    false
                }
            }
            aviso.value = if (ok) "importDone" else "importError"
        }
    }

    fun borrarTodo() {
        viewModelScope.launch {
            withContext(Dispatchers.IO) {
                db.clearAllTables()
                pinStore.eliminarPin()
                pinStore.guardarNombre("")
                pinStore.guardarAutoBloqueo(5)
            }
            nombre.value = ""
        }
    }

    /* ===== JSON ===== */

    private fun PostIt.toJson(): JSONObject = JSONObject()
        .put("id", id)
        .put("titulo", titulo)
        .put("contenido", contenido)
        .put("tipo", tipo)
        .put("items", items)
        .put("color", color)
        .put("x", x.toDouble())
        .put("y", y.toDouble())
        .put("ancho", ancho)
        .put("alto", alto)
        .put("privada", privada)
        .put("categoria", categoria)
        .put("imagenUri", imagenUri)
        .put("enc", enc)
        .put("timestamp", timestamp)

    private fun Tarea.toJson(): JSONObject = JSONObject()
        .put("id", id)
        .put("titulo", titulo)
        .put("fecha", fecha)
        .put("materia", materia)
        .put("hecha", hecha)
        .put("timestamp", timestamp)

    private fun Cuaderno.toJson(): JSONObject = JSONObject()
        .put("id", id)
        .put("titulo", titulo)
        .put("color", color)
        .put("timestamp", timestamp)

    private fun NotaCuaderno.toJson(): JSONObject = JSONObject()
        .put("id", id)
        .put("cuadernoId", cuadernoId)
        .put("titulo", titulo)
        .put("contenido", contenido)
        .put("audioPath", audioPath)
        .put("timestamp", timestamp)

    private fun Contrasena.toJson(): JSONObject = JSONObject()
        .put("id", id)
        .put("titulo", titulo)
        .put("usuario", usuario)
        .put("clave", clave)
        .put("url", url)
        .put("nota", nota)
        .put("enc", enc)
        .put("timestamp", timestamp)

    private fun postItFrom(json: JSONObject): PostIt = PostIt(
        id = json.optLong("id"),
        titulo = json.optString("titulo"),
        contenido = json.optString("contenido"),
        tipo = json.optString("tipo", "texto"),
        items = json.optString("items"),
        color = json.optString("color", "#FEF08A"),
        x = json.optDouble("x", 0.0).toFloat(),
        y = json.optDouble("y", 0.0).toFloat(),
        ancho = json.optInt("ancho", 170),
        alto = json.optInt("alto", 170),
        privada = json.optBoolean("privada"),
        categoria = json.optString("categoria", "importante"),
        imagenUri = json.optString("imagenUri"),
        enc = json.optString("enc"),
        timestamp = json.optLong("timestamp", System.currentTimeMillis())
    )

    private fun tareaFrom(json: JSONObject): Tarea = Tarea(
        id = json.optLong("id"),
        titulo = json.optString("titulo"),
        fecha = json.optString("fecha"),
        materia = json.optString("materia"),
        hecha = json.optBoolean("hecha"),
        timestamp = json.optLong("timestamp", System.currentTimeMillis())
    )

    private fun cuadernoFrom(json: JSONObject): Cuaderno = Cuaderno(
        id = json.optLong("id"),
        titulo = json.optString("titulo"),
        color = json.optString("color", "#DDD6FE"),
        timestamp = json.optLong("timestamp", System.currentTimeMillis())
    )

    private fun notaCuadernoFrom(json: JSONObject): NotaCuaderno = NotaCuaderno(
        id = json.optLong("id"),
        cuadernoId = json.optLong("cuadernoId"),
        titulo = json.optString("titulo"),
        contenido = json.optString("contenido"),
        audioPath = json.optString("audioPath"),
        timestamp = json.optLong("timestamp", System.currentTimeMillis())
    )

    private fun contrasenaFrom(json: JSONObject): Contrasena = Contrasena(
        id = json.optLong("id"),
        titulo = json.optString("titulo"),
        usuario = json.optString("usuario"),
        clave = json.optString("clave"),
        url = json.optString("url"),
        nota = json.optString("nota"),
        enc = json.optString("enc"),
        timestamp = json.optLong("timestamp", System.currentTimeMillis())
    )
}
