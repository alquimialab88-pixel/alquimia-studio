package com.alquimialab.stickly.data

import android.content.Context
import android.util.Base64
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

private val Context.dataStore by preferencesDataStore(name = "stickly_prefs")

sealed class ResultadoPin {
    data object Correcto : ResultadoPin()
    data object Incorrecto : ResultadoPin()
    data class Bloqueado(val segundos: Long) : ResultadoPin()
}

data class MaterialPin(
    val salt: String,
    val iv: String,
    val wrap: String,
    val iter: Int
)

/**
 * Guarda el PIN como llave derivada (PBKDF2) que envuelve una llave AES-256.
 * El PIN nunca se almacena. La llave de contenido solo vive en memoria.
 */
class PinStore(private val context: Context) {

    private val claveSalt = stringPreferencesKey("pin_wrap_salt")
    private val claveIv = stringPreferencesKey("pin_wrap_iv")
    private val claveWrap = stringPreferencesKey("pin_wrap_ct")
    private val claveIter = intPreferencesKey("pin_wrap_iter")
    private val claveLegacy = stringPreferencesKey("pin_hash")
    private val claveNombre = stringPreferencesKey("nombre_usuario")
    private val claveIdioma = stringPreferencesKey("idioma")
    private val claveAutoBloqueo = intPreferencesKey("auto_bloqueo_min")
    private val claveFallos = intPreferencesKey("pin_fallos")
    private val claveBloqueoHasta = longPreferencesKey("pin_bloqueo_hasta")

    private val random = SecureRandom()

    /* ===== PIN y sesión ===== */

    suspend fun hayPin(): Boolean =
        context.dataStore.data.map { it[claveWrap] != null }.first()

    fun estaDesbloqueado(): Boolean = claveSesion != null

    suspend fun crearPin(pin: String): Boolean {
        if (pin.length < 6) return false
        val key = KeyGenerator.getInstance("AES").apply { init(256) }.generateKey()
        val material = envolver(key, pin)
        context.dataStore.edit {
            it[claveSalt] = material.salt
            it[claveIv] = material.iv
            it[claveWrap] = material.wrap
            it[claveIter] = material.iter
            it.remove(claveLegacy)
            it[claveFallos] = 0
            it[claveBloqueoHasta] = 0L
        }
        claveSesion = key
        ultimoUso = System.currentTimeMillis()
        return true
    }

    suspend fun verificarPin(pin: String): ResultadoPin {
        val prefs = context.dataStore.data.first()
        val hasta = prefs[claveBloqueoHasta] ?: 0L
        if (hasta > System.currentTimeMillis()) {
            return ResultadoPin.Bloqueado(((hasta - System.currentTimeMillis()) / 1000L) + 1L)
        }

        val salt = prefs[claveSalt]
        val iv = prefs[claveIv]
        val wrap = prefs[claveWrap]
        val iter = prefs[claveIter] ?: ITERACIONES
        if (salt == null || iv == null || wrap == null) {
            return ResultadoPin.Incorrecto
        }

        val key = desenrollar(pin, salt, iv, wrap, iter)
        if (key != null) {
            claveSesion = key
            ultimoUso = System.currentTimeMillis()
            context.dataStore.edit {
                it[claveFallos] = 0
                it[claveBloqueoHasta] = 0L
            }
            return ResultadoPin.Correcto
        }

        val fallos = (prefs[claveFallos] ?: 0) + 1
        val espera = if (fallos >= MAX_FALLOS) {
            val segundos = minOf(30L * (1L shl (fallos - MAX_FALLOS)), 15L * 60L)
            segundos
        } else 0L
        context.dataStore.edit {
            it[claveFallos] = fallos
            it[claveBloqueoHasta] = if (espera > 0) System.currentTimeMillis() + espera * 1000L else 0L
        }
        return if (espera > 0) ResultadoPin.Bloqueado(espera) else ResultadoPin.Incorrecto
    }

    suspend fun segundosBloqueo(): Long {
        val prefs = context.dataStore.data.first()
        val hasta = prefs[claveBloqueoHasta] ?: 0L
        return ((hasta - System.currentTimeMillis()) / 1000L).coerceAtLeast(0L)
    }

    suspend fun cambiarPin(actual: String, nuevo: String): ResultadoPin {
        if (nuevo.length < 6) return ResultadoPin.Incorrecto
        val resultado = verificarPin(actual)
        if (resultado !is ResultadoPin.Correcto) return resultado
        val key = claveSesion ?: return ResultadoPin.Incorrecto
        val material = envolver(key, nuevo)
        context.dataStore.edit {
            it[claveSalt] = material.salt
            it[claveIv] = material.iv
            it[claveWrap] = material.wrap
            it[claveIter] = material.iter
        }
        return ResultadoPin.Correcto
    }

    suspend fun eliminarPin() {
        claveSesion = null
        context.dataStore.edit {
            it.remove(claveSalt)
            it.remove(claveIv)
            it.remove(claveWrap)
            it.remove(claveIter)
            it.remove(claveLegacy)
            it[claveFallos] = 0
            it[claveBloqueoHasta] = 0L
        }
    }

    fun bloquear() {
        claveSesion = null
        ultimoUso = 0L
    }

    fun marcarFondo() {
        if (claveSesion != null) ultimoUso = System.currentTimeMillis()
    }

    suspend fun debeBloquear(): Boolean {
        if (claveSesion == null) return false
        val minutos = obtenerAutoBloqueo()
        if (minutos <= 0) {
            ultimoUso = System.currentTimeMillis()
            return false
        }
        val inactivo = System.currentTimeMillis() - ultimoUso
        return if (ultimoUso > 0 && inactivo > minutos * 60_000L) {
            bloquear()
            true
        } else {
            ultimoUso = System.currentTimeMillis()
            false
        }
    }

    /* ===== Cifrado de contenido ===== */

    suspend fun cifrar(texto: String): String? = withContext(Dispatchers.Default) {
        val key = claveSesion ?: return@withContext null
        try {
            val iv = ByteArray(12).also { random.nextBytes(it) }
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, key, GCMParameterSpec(128, iv))
            val ct = cipher.doFinal(texto.toByteArray(Charsets.UTF_8))
            "v1:" + b64(iv) + ":" + b64(ct)
        } catch (e: Exception) {
            null
        }
    }

    suspend fun descifrar(texto: String?): String? = withContext(Dispatchers.Default) {
        if (texto.isNullOrBlank()) return@withContext null
        val key = claveSesion ?: return@withContext null
        try {
            val partes = texto.split(":")
            if (partes.size != 3 || partes[0] != "v1") return@withContext null
            val iv = unb64(partes[1])
            val ct = unb64(partes[2])
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(128, iv))
            String(cipher.doFinal(ct), Charsets.UTF_8)
        } catch (e: Exception) {
            null
        }
    }

    /* ===== Material para copias de seguridad ===== */

    suspend fun materialPin(): MaterialPin? {
        val prefs = context.dataStore.data.first()
        val salt = prefs[claveSalt] ?: return null
        val iv = prefs[claveIv] ?: return null
        val wrap = prefs[claveWrap] ?: return null
        return MaterialPin(salt, iv, wrap, prefs[claveIter] ?: ITERACIONES)
    }

    suspend fun restaurarMaterialPin(material: MaterialPin?) {
        claveSesion = null
        context.dataStore.edit {
            if (material == null) {
                it.remove(claveSalt)
                it.remove(claveIv)
                it.remove(claveWrap)
                it.remove(claveIter)
            } else {
                it[claveSalt] = material.salt
                it[claveIv] = material.iv
                it[claveWrap] = material.wrap
                it[claveIter] = material.iter
            }
            it[claveFallos] = 0
            it[claveBloqueoHasta] = 0L
        }
    }

    /* ===== Preferencias ===== */

    suspend fun obtenerNombre(): String =
        context.dataStore.data.map { it[claveNombre] ?: "" }.first()

    suspend fun guardarNombre(nombre: String) {
        context.dataStore.edit { it[claveNombre] = nombre.trim() }
    }

    suspend fun obtenerIdioma(): String =
        context.dataStore.data.map { it[claveIdioma] ?: "es" }.first()

    suspend fun guardarIdioma(idioma: String) {
        context.dataStore.edit { it[claveIdioma] = idioma }
    }

    suspend fun obtenerAutoBloqueo(): Int =
        context.dataStore.data.map { it[claveAutoBloqueo] ?: 5 }.first()

    suspend fun guardarAutoBloqueo(minutos: Int) {
        context.dataStore.edit { it[claveAutoBloqueo] = minutos.coerceAtLeast(0) }
    }

    /* ===== Criptografía ===== */

    private fun envolver(key: SecretKey, pin: String): MaterialPin {
        val salt = ByteArray(16).also { random.nextBytes(it) }
        val iv = ByteArray(12).also { random.nextBytes(it) }
        val kek = derivar(pin, salt, ITERACIONES)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(
            Cipher.ENCRYPT_MODE,
            SecretKeySpec(kek, "AES"),
            GCMParameterSpec(128, iv)
        )
        val ct = cipher.doFinal(key.encoded)
        return MaterialPin(b64(salt), b64(iv), b64(ct), ITERACIONES)
    }

    private fun desenrollar(
        pin: String,
        saltB64: String,
        ivB64: String,
        wrapB64: String,
        iter: Int
    ): SecretKey? {
        return try {
            val salt = unb64(saltB64)
            val iv = unb64(ivB64)
            val kek = derivar(pin, salt, iter)
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(
                Cipher.DECRYPT_MODE,
                SecretKeySpec(kek, "AES"),
                GCMParameterSpec(128, iv)
            )
            val keyBytes = cipher.doFinal(unb64(wrapB64))
            SecretKeySpec(keyBytes, "AES")
        } catch (e: Exception) {
            null
        }
    }

    private fun derivar(pin: String, salt: ByteArray, iter: Int): ByteArray {
        val spec = PBEKeySpec(pin.toCharArray(), salt, iter, 256)
        return try {
            val fabrica = try {
                SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            } catch (e: Exception) {
                SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")
            }
            fabrica.generateSecret(spec).encoded
        } finally {
            spec.clearPassword()
        }
    }

    private fun b64(bytes: ByteArray): String = Base64.encodeToString(bytes, Base64.NO_WRAP)

    private fun unb64(texto: String): ByteArray = Base64.decode(texto, Base64.NO_WRAP)

    companion object {
        private const val ITERACIONES = 310_000
        private const val MAX_FALLOS = 5

        // La sesión es única para toda la app: cualquier PinStore ve la misma llave.
        @Volatile
        private var claveSesion: SecretKey? = null

        @Volatile
        private var ultimoUso: Long = 0L
    }
}
