# ============================================
# ProGuard Rules for Kore App
# ============================================

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

# Firebase Auth
-keep class com.google.firebase.auth.** { *; }
-dontwarn com.google.firebase.auth.**

# Firestore (gRPC)
-keep class com.google.firebase.firestore.** { *; }
-dontwarn com.google.firebase.firestore.**
-dontwarn io.grpc.**
-dontwarn com.google.protobuf.**

# Play Services
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keep class com.google.android.gms.tasks.** { *; }
-dontwarn com.google.android.gms.**

# AndroidX Compose
-keep class androidx.compose.** { *; }
-dontwarn androidx.compose.**
-keep interface androidx.compose.** { *; }

# AndroidX Navigation Compose
-keep class androidx.navigation.** { *; }
-dontwarn androidx.navigation.**

# AndroidX Room
-keep class androidx.room.** { *; }
-dontwarn androidx.room.**
-keep @androidx.room.Entity class * { *; }
-keep @androidx.room.Dao class * { *; }
-keepclassmembers class * extends androidx.room.RoomDatabase { *; }

# AndroidX DataStore
-keep class androidx.datastore.** { *; }
-dontwarn androidx.datastore.**

# Kotlin Coroutines
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# OkHttp3
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# Facebook SDK
-keep class com.facebook.** { *; }
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class com.facebook.** { *; }
-dontwarn com.facebook.**

# AndroidX Lifecycle
-keep class androidx.lifecycle.** { *; }
-dontwarn androidx.lifecycle.**

# AndroidX Credential Manager
-keep class androidx.credentials.** { *; }
-dontwarn androidx.credentials.**

# Google ID / reCAPTCHA
-keep class com.google.android.gms.auth.api.signin.** { *; }
-keep class com.google.android.recaptcha.** { *; }
-dontwarn com.google.android.recaptcha.**

# Kotlin
-keep class kotlin.** { *; }
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class **$WhenMappings { *; }
-dontwarn kotlin.**

# Gson/JSON (if used)
-keep class org.json.** { *; }
-dontwarn org.json.**

# Keep the MusicaPlayer and related classes
-keep class com.alquimialab.kore.ui.MusicaPlayer { *; }
-keep class com.alquimialab.kore.ui.** { *; }
-keep class com.alquimialab.kore.** { *; }

# Keep Firebase broadcast receivers and services
-keep class com.alquimialab.kore.notif.** { *; }
-keep class com.alquimialab.kore.service.** { *; }

# Keep MediaPlayer usage
-keepclassmembers class * {
    android.media.MediaPlayer *;
}
