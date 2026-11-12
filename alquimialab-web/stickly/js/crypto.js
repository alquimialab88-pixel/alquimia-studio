/* ==========================================================================
   Stickly · cifrado
   - PIN -> PBKDF2-SHA256 (310k) -> llave que envuelve una llave AES-256-GCM.
   - La llave de contenido solo vive en memoria mientras la sesión está abierta.
   - El PIN nunca se guarda. Cambiarlo solo re-envuelve la misma llave.
   ========================================================================== */

const ITERATIONS = 310000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function isSupported() {
  return !!(window.crypto && window.crypto.subtle && window.crypto.subtle.importKey);
}

export function b64(buffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(out);
}

export function unb64(text) {
  const raw = atob(text);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function deriveKEK(pin, salt, iterations) {
  const base = await crypto.subtle.importKey(
    "raw", encoder.encode(pin), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["wrapKey", "unwrapKey"]
  );
}

/** Crea una llave de contenido nueva y la envuelve con el PIN. */
export async function createWrap(pin) {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
  );
  const wrap = await wrapWithPin(key, pin);
  return { key, wrap };
}

async function wrapWithPin(key, pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const kek = await deriveKEK(pin, salt, ITERATIONS);
  const ct = await crypto.subtle.wrapKey("raw", key, kek, { name: "AES-GCM", iv });
  return {
    v: 1,
    iter: ITERATIONS,
    salt: b64(salt),
    iv: b64(iv),
    ct: b64(ct)
  };
}

/** Devuelve la llave de contenido o null si el PIN no abre la envoltura. */
export async function unlock(pin, wrap) {
  if (!wrap || !wrap.salt || !wrap.iv || !wrap.ct) return null;
  try {
    const salt = unb64(wrap.salt);
    const iv = unb64(wrap.iv);
    const kek = await deriveKEK(pin, salt, wrap.iter || ITERATIONS);
    const key = await crypto.subtle.unwrapKey(
      "raw", unb64(wrap.ct), kek, { name: "AES-GCM", iv },
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
    return key;
  } catch (e) {
    return null;
  }
}

/** Cambia el PIN re-envolviendo la misma llave (los datos no se re-cifran). */
export async function changePin(key, newPin) {
  return wrapWithPin(key, newPin);
}

export async function encryptJSON(key, value) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = encoder.encode(JSON.stringify(value));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { v: 1, iv: b64(iv), ct: b64(ct) };
}

export async function decryptJSON(key, blob) {
  if (!blob || !blob.iv || !blob.ct) return null;
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: unb64(blob.iv) }, key, unb64(blob.ct)
    );
    return JSON.parse(decoder.decode(plain));
  } catch (e) {
    return null;
  }
}
