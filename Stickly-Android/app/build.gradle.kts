import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.ksp)
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

    // Las credenciales viven en local.properties (ignorado por git) o en variables de entorno.
    val propiedadesLocales = Properties().apply {
        val archivo = rootProject.file("local.properties")
        if (archivo.exists()) archivo.inputStream().use { load(it) }
    }
    fun credencial(nombre: String): String =
        propiedadesLocales.getProperty(nombre) ?: System.getenv(nombre) ?: ""

    val archivoKeystore = file(credencial("STICKLY_STORE_FILE").ifBlank { "../mi-keystore.jks" })
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
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.fragment.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    implementation(libs.androidx.datastore.preferences)

    debugImplementation(libs.androidx.ui.tooling)
}
