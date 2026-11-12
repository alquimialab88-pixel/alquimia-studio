package com.alquimialab.stickly.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Update
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.flow.Flow

@Dao
interface PostItDao {
    @Query("SELECT * FROM postits ORDER BY timestamp DESC")
    fun observeAll(): Flow<List<PostIt>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(postIt: PostIt): Long

    @Update
    suspend fun update(postIt: PostIt)

    @Delete
    suspend fun delete(postIt: PostIt)

    @Query("SELECT * FROM postits")
    suspend fun todos(): List<PostIt>

    @Query("DELETE FROM postits")
    suspend fun borrarTodos()
}

@Dao
interface TareaDao {
    @Query("SELECT * FROM tareas ORDER BY fecha ASC, timestamp DESC")
    fun observeAll(): Flow<List<Tarea>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(tarea: Tarea): Long

    @Delete
    suspend fun delete(tarea: Tarea)

    @Query("SELECT * FROM tareas")
    suspend fun todas(): List<Tarea>

    @Query("DELETE FROM tareas")
    suspend fun borrarTodas()
}

@Dao
interface CuadernoDao {
    @Query("SELECT * FROM cuadernos ORDER BY timestamp DESC")
    fun observeAll(): Flow<List<Cuaderno>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(cuaderno: Cuaderno): Long

    @Delete
    suspend fun delete(cuaderno: Cuaderno)

    @Query("SELECT * FROM cuadernos")
    suspend fun todos(): List<Cuaderno>

    @Query("DELETE FROM cuadernos")
    suspend fun borrarTodos()
}

@Dao
interface NotaCuadernoDao {
    @Query("SELECT * FROM notas_cuaderno WHERE cuadernoId = :cuadernoId ORDER BY timestamp DESC")
    fun observePorCuaderno(cuadernoId: Long): Flow<List<NotaCuaderno>>

    @Query("SELECT COUNT(*) FROM notas_cuaderno WHERE cuadernoId = :cuadernoId")
    fun observeConteo(cuadernoId: Long): Flow<Int>

    @Query("SELECT * FROM notas_cuaderno")
    fun observeAll(): Flow<List<NotaCuaderno>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(nota: NotaCuaderno): Long

    @Delete
    suspend fun delete(nota: NotaCuaderno)

    @Query("SELECT * FROM notas_cuaderno")
    suspend fun todas(): List<NotaCuaderno>

    @Query("DELETE FROM notas_cuaderno")
    suspend fun borrarTodas()
}

@Dao
interface ContrasenaDao {
    @Query("SELECT * FROM contrasenas ORDER BY timestamp DESC")
    fun observeAll(): Flow<List<Contrasena>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(contrasena: Contrasena): Long

    @Delete
    suspend fun delete(contrasena: Contrasena)

    @Query("SELECT * FROM contrasenas")
    suspend fun todas(): List<Contrasena>

    @Query("DELETE FROM contrasenas")
    suspend fun borrarTodas()
}

@Database(
    entities = [PostIt::class, Tarea::class, Cuaderno::class, NotaCuaderno::class, Contrasena::class],
    version = 4,
    exportSchema = false
)
abstract class SticklyDatabase : RoomDatabase() {
    abstract fun postItDao(): PostItDao
    abstract fun tareaDao(): TareaDao
    abstract fun cuadernoDao(): CuadernoDao
    abstract fun notaCuadernoDao(): NotaCuadernoDao
    abstract fun contrasenaDao(): ContrasenaDao

    companion object {
        @Volatile
        private var INSTANCIA: SticklyDatabase? = null

        fun obtener(context: Context): SticklyDatabase =
            INSTANCIA ?: synchronized(this) {
                val db = Room.databaseBuilder(
                    context.applicationContext,
                    SticklyDatabase::class.java,
                    "stickly.db"
                ).addMigrations(MIGRACION_3_4)
                    .build()
                INSTANCIA = db
                db
            }

        private val MIGRACION_3_4 = object : Migration(3, 4) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("ALTER TABLE postits ADD COLUMN enc TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE contrasenas ADD COLUMN enc TEXT NOT NULL DEFAULT ''")
            }
        }
    }
}
