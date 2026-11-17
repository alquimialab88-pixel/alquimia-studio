import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.alquimialab.aurify"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.alquimialab.aurify"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    val propiedadesLocales = Properties().apply {
        val archivo = rootProject.file("local.properties")
        if (archivo.exists()) archivo.inputStream().use { load(it) }
    }
    fun credencial(nombre: String): String =
        propiedadesLocales.getProperty(nombre) ?: System.getenv(nombre) ?: ""

    val archivoKeystore = file(credencial("STICKLY_STORE_FILE").ifBlank { "../../Stickly-Android/mi-keystore.jks" })
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

    // Empaqueta la PWA de Aurify desde alquimialab-web/aurify (misma base de código).
    val syncAurify = tasks.register<Sync>("syncAurifyAssets") {
        from(rootProject.file("../alquimialab-web/aurify"))
        into(layout.buildDirectory.dir("aurify-assets/aurify"))
    }

    sourceSets.getByName("main").assets.srcDir(layout.buildDirectory.dir("aurify-assets"))

    tasks.matching { it.name.startsWith("merge") && it.name.endsWith("Assets") }.configureEach {
        dependsOn(syncAurify)
    }
    tasks.matching { it.name == "preBuild" }.configureEach {
        dependsOn(syncAurify)
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.16.0")
    implementation("androidx.activity:activity-ktx:1.10.1")
}
