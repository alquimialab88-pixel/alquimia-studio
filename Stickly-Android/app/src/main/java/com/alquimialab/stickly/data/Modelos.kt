package com.alquimialab.stickly.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "postits")
data class PostIt(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val titulo: String = "",
    val contenido: String = "",
    val tipo: String = "texto",
    val items: String = "",
    val color: String = "#FEF08A",
    val x: Float = 0f,
    val y: Float = 0f,
    val ancho: Int = 170,
    val alto: Int = 170,
    val privada: Boolean = false,
    val categoria: String = "importante",
    val imagenUri: String = "",
    val enc: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "tareas")
data class Tarea(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val titulo: String = "",
    val fecha: String = "",
    val materia: String = "",
    val hecha: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "cuadernos")
data class Cuaderno(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val titulo: String = "",
    val color: String = "#DDD6FE",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "notas_cuaderno")
data class NotaCuaderno(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val cuadernoId: Long = 0,
    val titulo: String = "",
    val contenido: String = "",
    val audioPath: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "contrasenas")
data class Contrasena(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val titulo: String = "",
    val usuario: String = "",
    val clave: String = "",
    val url: String = "",
    val nota: String = "",
    val enc: String = "",
    val timestamp: Long = System.currentTimeMillis()
)
