import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.alquimialab.stickly"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.alquimialab.stickly"
        minSdk = 24
        targetSdk = 36
        versionCode = 2
        versionName = "1.0.0"
    }

    val propiedadesLocales = Properties().apply {
        val archivo = rootProject.file("local.properties")
        if (archivo.exists()) archivo.inputStream().use { load(it) }
    }
    fun credencial(nombre: String): String =
        propiedadesLocales.getProperty(nombre) ?: System.getenv(nombre) ?: ""

    val archivoKeystore = file(credencial("STICKLY_STORE_FILE").ifBlank { "../Stickly-Android/mi-keystore.jks" })
    val claveKeystore = credencial("STICKLY_STORE_PASSWORD")
    val aliasKeystore = credencial("STICKLY_KEY_ALIAS").ifBlank { "mi-alias" }
    val claveAlias = credencial("STICKLY_KEY_PASSWORD")
    val firmaLista = archivoKeystore.exists() && claveKeystore.isNotBlank() && claveAlias.isNotBlank()

    signingConfigs {
        if (firmaLista) {
            create("release") {
                storeFile = archivoKeystore
                storePassword = claveKeystore
                keyAlias = aliasKeystore
                keyPassword = claveAlias
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            if (firmaLista) signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
    }

    // Empaqueta la PWA desde alquimialab-web/stickly (misma base de código).
    val syncStickly = tasks.register<Sync>("syncSticklyAssets") {
        from(rootProject.file("../alquimialab-web/stickly"))
        into(layout.buildDirectory.dir("stickly-assets/stickly"))
    }

    sourceSets.getByName("main").assets.srcDir(layout.buildDirectory.dir("stickly-assets"))

    tasks.matching { it.name.startsWith("merge") && it.name.endsWith("Assets") }.configureEach {
        dependsOn(syncStickly)
    }
    tasks.matching { it.name == "preBuild" }.configureEach {
        dependsOn(syncStickly)
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.16.0")
    implementation("androidx.activity:activity-ktx:1.10.1")
}
