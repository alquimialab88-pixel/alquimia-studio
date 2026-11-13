/* ==========================================================================
   Stickly · estado y operaciones
   Los datos viven en IndexedDB. Lo privado se cifra antes de guardarse.
   ========================================================================== */

import * as db from "./db.js";
import * as crypto from "./crypto.js";

const DEFAULT_SETTINGS = { autoLock: 5, studyMin: 25, breakMin: 5 }; // minutos
const MAX_FAILS = 5;
const BASE_DELAY = 30; // segundos tras el quinto intento

export const state = {
  ready: false,
  notes: [],
  tasks: [],
  notebooks: [],
  notebookNotes: [],
  passwords: [],
  profile: { name: "", photo: null },
  settings: Object.assign({}, DEFAULT_SETTINGS),
  keyWrap: null,
  key: null,
  onboarding: false,
  lockout: { fails: 0, until: 0 },
  openNotes: new Map(),
  openPasswords: new Map()
};

const listeners = [];

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

function emit() {
  for (const fn of listeners.slice()) {
    try { fn(); } catch (e) { console.error(e); }
  }
}

/* ===== Arranque ===== */

export async function init() {
  const [notes, tasks, notebooks, notebookNotes, passwords] = await Promise.all([
    db.getAll("notes"),
    db.getAll("tasks"),
    db.getAll("notebooks"),
    db.getAll("notebookNotes"),
    db.getAll("passwords")
  ]);

  state.notes = notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  state.tasks = tasks.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  state.notebooks = notebooks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  state.notebookNotes = notebookNotes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  state.passwords = passwords.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  state.profile = Object.assign({ name: "", photo: null }, await db.metaGet("profile", {}));
  state.settings = Object.assign({}, DEFAULT_SETTINGS, await db.metaGet("settings", {}));
  state.keyWrap = await db.metaGet("keyWrap", null);
  state.onboarding = await db.metaGet("onboarding", false);
  state.lockout = await db.metaGet("lockout", { fails: 0, until: 0 });

  state.ready = true;
  emit();
}

/* ===== PIN y sesión ===== */

export function hasPin() {
  return !!state.keyWrap;
}

export function isUnlocked() {
  return !!state.key;
}

export function hasPrivateData() {
  return state.passwords.length > 0 || state.notes.some((n) => n.privada);
}

export async function setupPin(pin) {
  const { key, wrap } = await crypto.createWrap(pin);
  state.key = key;
  state.keyWrap = wrap;
  await db.metaSet("keyWrap", wrap);
  await openPrivate();
  emit();
}

export async function unlockWithPin(pin) {
  const wait = lockWait();
  if (wait > 0) return { ok: false, reason: "locked", wait };
  const key = await crypto.unlock(pin, state.keyWrap);
  if (!key) {
    await registerFail();
    return { ok: false, reason: "wrong", wait: lockWait() };
  }
  state.key = key;
  await clearLockout();
  await openPrivate();
  emit();
  return { ok: true };
}

/** Comprueba el PIN sin abrir la sesión (para cambiarlo). */
export async function verifyPin(pin) {
  const wait = lockWait();
  if (wait > 0) return { ok: false, reason: "locked", wait };
  const key = await crypto.unlock(pin, state.keyWrap);
  if (!key) {
    await registerFail();
    return { ok: false, reason: "wrong", wait: lockWait() };
  }
  await clearLockout();
  return { ok: true };
}

export async function changePin(currentPin, newPin) {
  if (!state.key) return false;
  const check = await crypto.unlock(currentPin, state.keyWrap);
  if (!check) return false;
  const wrap = await crypto.changePin(state.key, newPin);
  state.keyWrap = wrap;
  await db.metaSet("keyWrap", wrap);
  emit();
  return true;
}

export function lock() {
  state.key = null;
  state.openNotes.clear();
  state.openPasswords.clear();
  emit();
}

export function lockWait() {
  const until = state.lockout.until || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

async function registerFail() {
  const fails = (state.lockout.fails || 0) + 1;
  let until = 0;
  if (fails >= MAX_FAILS) {
    const delay = Math.min(BASE_DELAY * Math.pow(2, fails - MAX_FAILS), 15 * 60);
    until = Date.now() + delay * 1000;
  }
  state.lockout = { fails, until };
  await db.metaSet("lockout", state.lockout);
  emit();
}

async function clearLockout() {
  if (!state.lockout.fails && !state.lockout.until) return;
  state.lockout = { fails: 0, until: 0 };
  await db.metaSet("lockout", state.lockout);
}

async function openPrivate() {
  if (!state.key) return;
  for (const note of state.notes) {
    if (!note.privada || !note.enc) continue;
    const data = await crypto.decryptJSON(state.key, note.enc);
    if (data) state.openNotes.set(note.id, data);
  }
  for (const row of state.passwords) {
    const data = await crypto.decryptJSON(state.key, row.enc);
    if (data) state.openPasswords.set(row.id, data);
  }
}

/** Borra datos privados y el PIN (cuando se olvidó la clave). */
export async function resetPrivate() {
  const notes = state.notes.filter((n) => n.privada);
  for (const note of notes) await db.del("notes", note.id);
  for (const row of state.passwords) await db.del("passwords", row.id);
  state.notes = state.notes.filter((n) => !n.privada);
  state.passwords = [];
  state.keyWrap = null;
  state.key = null;
  state.openNotes.clear();
  state.openPasswords.clear();
  await db.metaSet("keyWrap", null);
  await clearLockout();
  emit();
}

/* ===== Notas ===== */

export function noteView(note) {
  if (!note) return null;
  if (!note.privada) {
    return {
      title: note.title || "",
      content: note.content || "",
      items: note.items || [],
      image: note.image || null
    };
  }
  return state.openNotes.get(note.id) || null;
}

function notePayload(input) {
  return {
    title: input.title || "",
    content: input.content || "",
    items: Array.isArray(input.items) ? input.items : [],
    image: input.image || null
  };
}

export async function saveNote(input) {
  const now = Date.now();
  const prev = input.id ? state.notes.find((n) => n.id === input.id) : null;
  const base = {
    id: input.id || db.uid(),
    tipo: input.tipo || "texto",
    color: input.color || "#FEF08A",
    categoria: input.categoria || "importante",
    x: typeof input.x === "number" ? input.x : (prev && typeof prev.x === "number" ? prev.x : 20),
    y: typeof input.y === "number" ? input.y : (prev && typeof prev.y === "number" ? prev.y : 20),
    ancho: typeof input.ancho === "number" ? input.ancho : ((prev && prev.ancho) || 170),
    alto: typeof input.alto === "number" ? input.alto : ((prev && prev.alto) || 170),
    pos: input.pos !== undefined ? !!input.pos : !!(prev && prev.pos),
    privada: !!input.privada,
    createdAt: input.createdAt || (prev && prev.createdAt) || now,
    updatedAt: now
  };

  const payload = notePayload(input);
  if (base.privada) {
    if (!state.key) throw new Error("locked");
    base.enc = await crypto.encryptJSON(state.key, payload);
    state.openNotes.set(base.id, payload);
  } else {
    Object.assign(base, payload);
    state.openNotes.delete(base.id);
  }

  await db.put("notes", base);
  const i = state.notes.findIndex((n) => n.id === base.id);
  if (i >= 0) state.notes[i] = base;
  else state.notes.unshift(base);
  state.notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  emit();
  return base;
}

export async function deleteNote(id) {
  await db.del("notes", id);
  state.notes = state.notes.filter((n) => n.id !== id);
  state.openNotes.delete(id);
  emit();
}

export async function moveNote(id, x, y) {
  const note = state.notes.find((n) => n.id === id);
  if (!note) return;
  note.x = Math.max(0, Math.round(x));
  note.y = Math.max(0, Math.round(y));
  note.pos = true;
  note.updatedAt = Date.now();
  await db.put("notes", note);
}

export async function setNotePosition(id, x, y, ancho) {
  const note = state.notes.find((n) => n.id === id);
  if (!note) return;
  note.x = Math.max(0, Math.round(x));
  note.y = Math.max(0, Math.round(y));
  if (typeof ancho === "number" && ancho > 0) note.ancho = Math.round(ancho);
  note.pos = true;
  await db.put("notes", note);
}

/* ===== Tareas ===== */

export async function saveTask(input) {
  const now = Date.now();
  const task = {
    id: input.id || db.uid(),
    titulo: (input.titulo || "").trim(),
    fecha: input.fecha || "",
    materia: (input.materia || "").trim(),
    hecha: !!input.hecha,
    timestamp: input.timestamp || now
  };
  if (!task.titulo || !task.fecha) return null;
  await db.put("tasks", task);
  const i = state.tasks.findIndex((t) => t.id === task.id);
  if (i >= 0) state.tasks[i] = task;
  else state.tasks.push(task);
  state.tasks.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  emit();
  return task;
}

export async function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;
  task.hecha = !task.hecha;
  await db.put("tasks", task);
  emit();
}

export async function deleteTask(id) {
  await db.del("tasks", id);
  state.tasks = state.tasks.filter((t) => t.id !== id);
  emit();
}

export function tasksFor(date) {
  return state.tasks
    .filter((t) => t.fecha === date)
    .sort((a, b) => Number(a.hecha) - Number(b.hecha));
}

/* ===== Cuadernos ===== */

export async function saveNotebook(input) {
  const notebook = {
    id: input.id || db.uid(),
    titulo: (input.titulo || "").trim(),
    color: input.color || "#DDD6FE",
    voice: !!input.voice,
    timestamp: input.timestamp || Date.now()
  };
  if (!notebook.titulo) return null;
  await db.put("notebooks", notebook);
  const i = state.notebooks.findIndex((b) => b.id === notebook.id);
  if (i >= 0) state.notebooks[i] = notebook;
  else state.notebooks.unshift(notebook);
  emit();
  return notebook;
}

export async function deleteNotebook(id) {
  const notes = state.notebookNotes.filter((n) => n.cuadernoId === id);
  for (const note of notes) await db.del("notebookNotes", note.id);
  await db.del("notebooks", id);
  state.notebooks = state.notebooks.filter((b) => b.id !== id);
  state.notebookNotes = state.notebookNotes.filter((n) => n.cuadernoId !== id);
  emit();
}

export function notesForNotebook(id) {
  return state.notebookNotes
    .filter((n) => n.cuadernoId === id)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

export async function saveNotebookNote(input) {
  const note = {
    id: input.id || db.uid(),
    cuadernoId: input.cuadernoId,
    titulo: (input.titulo || "").trim(),
    contenido: input.contenido || "",
    audio: input.audio || null,
    audioSec: input.audioSec || 0,
    timestamp: input.timestamp || Date.now()
  };
  if (!note.titulo && !note.contenido && !note.audio) return null;
  await db.put("notebookNotes", note);
  const i = state.notebookNotes.findIndex((n) => n.id === note.id);
  if (i >= 0) state.notebookNotes[i] = note;
  else state.notebookNotes.unshift(note);
  emit();
  return note;
}

export async function deleteNotebookNote(id) {
  await db.del("notebookNotes", id);
  state.notebookNotes = state.notebookNotes.filter((n) => n.id !== id);
  emit();
}

/* ===== Contraseñas ===== */

export async function savePassword(input) {
  if (!state.key) throw new Error("locked");
  const payload = {
    titulo: (input.titulo || "").trim(),
    usuario: (input.usuario || "").trim(),
    clave: input.clave || "",
    url: (input.url || "").trim(),
    nota: input.nota || ""
  };
  if (!payload.titulo) return null;
  const row = {
    id: input.id || db.uid(),
    enc: await crypto.encryptJSON(state.key, payload),
    createdAt: input.createdAt || Date.now(),
    updatedAt: Date.now()
  };
  await db.put("passwords", row);
  state.openPasswords.set(row.id, payload);
  const i = state.passwords.findIndex((p) => p.id === row.id);
  if (i >= 0) state.passwords[i] = row;
  else state.passwords.unshift(row);
  emit();
  return row;
}

export async function deletePassword(id) {
  await db.del("passwords", id);
  state.passwords = state.passwords.filter((p) => p.id !== id);
  state.openPasswords.delete(id);
  emit();
}

export function passwordView(row) {
  return state.openPasswords.get(row.id) || null;
}

/* ===== Perfil y ajustes ===== */

export async function setName(name) {
  state.profile = Object.assign({}, state.profile, { name: (name || "").trim() });
  await db.metaSet("profile", state.profile);
  emit();
}

export async function setPhoto(photo) {
  state.profile = Object.assign({}, state.profile, { photo: photo || null });
  await db.metaSet("profile", state.profile);
  emit();
}

export async function setSetting(key, value) {
  state.settings = Object.assign({}, state.settings, { [key]: value });
  await db.metaSet("settings", state.settings);
  emit();
}

export async function completeOnboarding() {
  state.onboarding = true;
  await db.metaSet("onboarding", true);
  emit();
}

/* ===== Copia de seguridad ===== */

export async function exportData(includePrivate) {
  const data = {};
  for (const store of ["notes", "tasks", "notebooks", "notebookNotes", "passwords"]) {
    data[store] = await db.getAll(store);
  }
  if (!includePrivate) {
    data.notes = data.notes.filter((n) => !n.privada);
    data.passwords = [];
  }
  return {
    app: "stickly",
    version: 1,
    exportedAt: new Date().toISOString(),
    includePrivate: !!includePrivate,
    profile: state.profile,
    settings: state.settings,
    keyWrap: includePrivate ? state.keyWrap : null,
    data
  };
}

export function validateBackup(obj) {
  if (!obj || obj.app !== "stickly" || !obj.data) return false;
  const data = obj.data;
  if (!Array.isArray(data.notes) || !Array.isArray(data.tasks)) return false;
  if (data.notebooks && !Array.isArray(data.notebooks)) return false;
  if (data.notebookNotes && !Array.isArray(data.notebookNotes)) return false;
  if (data.passwords && !Array.isArray(data.passwords)) return false;
  return true;
}

export async function importData(obj) {
  if (!validateBackup(obj)) throw new Error("invalid");
  const data = obj.data;
  const stores = ["notes", "tasks", "notebooks", "notebookNotes", "passwords"];
  await db.clearStores(stores);
  await db.putMany("notes", data.notes);
  await db.putMany("tasks", data.tasks);
  await db.putMany("notebooks", data.notebooks || []);
  await db.putMany("notebookNotes", data.notebookNotes || []);
  await db.putMany("passwords", data.passwords || []);

  state.notes = data.notes.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  state.tasks = data.tasks.slice();
  state.notebooks = (data.notebooks || []).slice();
  state.notebookNotes = (data.notebookNotes || []).slice();
  state.passwords = (data.passwords || []).slice();

  if (obj.profile) {
    state.profile = Object.assign({ name: "", photo: null }, obj.profile);
    await db.metaSet("profile", state.profile);
  }
  if (obj.settings) {
    state.settings = Object.assign({}, DEFAULT_SETTINGS, obj.settings);
    await db.metaSet("settings", state.settings);
  }
  state.keyWrap = obj.keyWrap || null;
  await db.metaSet("keyWrap", state.keyWrap);
  state.onboarding = true;
  await db.metaSet("onboarding", true);

  state.key = null;
  state.openNotes.clear();
  state.openPasswords.clear();
  emit();
}

export async function wipeAll() {
  await db.clearStores(["notes", "tasks", "notebooks", "notebookNotes", "passwords", "meta"]);
  state.notes = [];
  state.tasks = [];
  state.notebooks = [];
  state.notebookNotes = [];
  state.passwords = [];
  state.profile = { name: "", photo: null };
  state.settings = Object.assign({}, DEFAULT_SETTINGS);
  state.keyWrap = null;
  state.key = null;
  state.onboarding = false;
  state.lockout = { fails: 0, until: 0 };
  state.openNotes.clear();
  state.openPasswords.clear();
  emit();
}

export async function storageEstimate() {
  return db.estimate();
}
