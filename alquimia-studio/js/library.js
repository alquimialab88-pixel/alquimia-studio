/* ===== Alquimia Studio · Biblioteca y lector de PDFs =====
   Los archivos se guardan solo en este dispositivo (IndexedDB).
   Nada se sube a internet. */

(function () {
  'use strict';

  var DB_NAME = 'alquimia-studio-lib';
  var DB_VER = 1;
  var META = 'pdfs';
  var FILES = 'files';

  var dbPromise = null;
  var pdfjs = window.pdfjsLib || null;
  if (pdfjs && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';
  }

  var metas = [];
  var favoritesChangeHandler = null;
  var libraryChangeHandler = null;
  var filter = 'all';
  var query = '';
  var inited = false;

  var currentRec = null;
  var currentDoc = null;
  var currentPage = 1;
  var zoom = 1;
  var renderSeq = 0;
  var renderTask = null;
  var saveTimer = null;
  var resizeTimer = null;
  var loadSeq = 0;

  /* ---------- utilidades ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function fmtSize(b) {
    if (!b) return '';
    if (b < 1024 * 1024) return Math.round(b / 1024) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
  }
  function cleanTitle(name) {
    return String(name || 'PDF').replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim() || 'PDF';
  }
  function toast(msg) {
    var el = $('libToast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  /* ---------- IndexedDB ---------- */
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(META)) {
          db.createObjectStore(META, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(FILES)) {
          db.createObjectStore(FILES, { keyPath: 'id' });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }
  function store(name, mode) {
    return openDB().then(function (db) {
      return db.transaction(name, mode).objectStore(name);
    });
  }
  function reqP(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function getAllMeta() { return store(META, 'readonly').then(function (s) { return reqP(s.getAll()); }); }
  function putMeta(rec) { return store(META, 'readwrite').then(function (s) { return reqP(s.put(rec)); }); }
  function delMeta(id) { return store(META, 'readwrite').then(function (s) { return reqP(s.delete(id)); }); }
  function putFile(id, blob) { return store(FILES, 'readwrite').then(function (s) { return reqP(s.put({ id: id, blob: blob })); }); }
  function getFile(id) { return store(FILES, 'readonly').then(function (s) { return reqP(s.get(id)); }).then(function (r) { return r ? r.blob : null; }); }
  function delFile(id) { return store(FILES, 'readwrite').then(function (s) { return reqP(s.delete(id)); }); }
  function getAllFiles() { return store(FILES, 'readonly').then(function (s) { return reqP(s.getAll()); }); }
  function notifyFavoritesChanged() {
    if (typeof favoritesChangeHandler === 'function') {
      favoritesChangeHandler(metas.filter(function (rec) { return rec.favorite; }).map(function (rec) {
        return { id: rec.id, name: rec.name, title: rec.title };
      }));
    }
  }
  function notifyLibraryChanged() {
    if (typeof libraryChangeHandler === 'function') {
      libraryChangeHandler({
        recent: metas.slice().sort(function (a, b) {
          return (b.lastOpened || b.added) - (a.lastOpened || a.added);
        }).slice(0, 4).map(function (rec) {
          return { id: rec.id, name: rec.name, title: rec.title };
        }),
        count: metas.length
      });
    }
  }
  function saveFavorite(rec) {
    return putMeta(rec).then(function () {
      notifyFavoritesChanged();
      return true;
    }).catch(function (err) {
      toast('No se pudo guardar el favorito.');
      console.warn('Favorite save failed:', err);
      return false;
    });
  }

  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || '');
        var comma = result.indexOf(',');
        if (comma < 0) { reject(new Error('No se pudo leer uno de los PDFs.')); return; }
        resolve(result.slice(comma + 1));
      };
      reader.onerror = function () { reject(reader.error || new Error('No se pudo leer uno de los PDFs.')); };
      reader.readAsDataURL(blob);
    });
  }

  function base64ToBlob(data, type) {
    var binary;
    try { binary = atob(data); } catch (err) { throw new Error('El respaldo contiene un PDF inválido.'); }
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: type || 'application/pdf' });
  }

  function exportBackup() {
    return Promise.all([getAllMeta(), getAllFiles()]).then(function (results) {
      var files = {};
      (results[1] || []).forEach(function (item) { files[item.id] = item.blob; });
      var chain = Promise.resolve([]);
      (results[0] || []).forEach(function (rec) {
        chain = chain.then(function (pdfs) {
          var blob = files[rec.id];
          if (!blob) throw new Error('Falta el archivo de "' + (rec.title || rec.name) + '". No se creó el respaldo.');
          return blobToBase64(blob).then(function (data) {
            pdfs.push({
              metadata: rec,
              contentType: blob.type || 'application/pdf',
              data: data
            });
            return pdfs;
          });
        });
      });
      return chain;
    });
  }

  function importBackup(pdfs) {
    if (!Array.isArray(pdfs)) return Promise.reject(new Error('La lista de PDFs del respaldo no es válida.'));
    var records = [];
    try {
      pdfs.forEach(function (entry) {
        var rec = entry && entry.metadata;
        if (!rec || typeof rec.id !== 'string' || !/^pdf-[a-zA-Z0-9-]+$/.test(rec.id)
          || typeof rec.name !== 'string' || typeof rec.title !== 'string'
          || !Number.isFinite(rec.size) || rec.size < 0
          || !Number.isInteger(rec.pages) || rec.pages < 1
          || !Number.isFinite(rec.added) || !Number.isFinite(rec.lastPage)
          || (rec.lastOpened != null && !Number.isFinite(rec.lastOpened))
          || typeof rec.favorite !== 'boolean'
          || (rec.cover && !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(rec.cover))
          || typeof entry.data !== 'string'
          || !/^[A-Za-z0-9+/]*={0,2}$/.test(entry.data)) {
          throw new Error('El respaldo contiene datos de PDF inválidos.');
        }
        var blob = base64ToBlob(entry.data, 'application/pdf');
        if (blob.size !== rec.size) throw new Error('El tamaño de un PDF no coincide con sus datos de respaldo.');
        records.push({
          metadata: {
            id: rec.id,
            name: rec.name.slice(0, 255),
            title: rec.title.slice(0, 120),
            size: blob.size,
            pages: rec.pages,
            added: rec.added,
            lastOpened: Number.isFinite(rec.lastOpened) ? rec.lastOpened : rec.added,
            lastPage: clamp(Math.floor(rec.lastPage), 1, rec.pages),
            favorite: rec.favorite,
            cover: rec.cover || ''
          },
          blob: blob
        });
      });
    } catch (err) {
      return Promise.reject(err);
    }

    if (!records.length) return Promise.resolve();
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx;
        try { tx = db.transaction([META, FILES], 'readwrite'); }
        catch (err) { reject(err); return; }
        records.forEach(function (record) {
          tx.objectStore(META).put(record.metadata);
          tx.objectStore(FILES).put({ id: record.metadata.id, blob: record.blob });
        });
        tx.oncomplete = resolve;
        tx.onerror = function () { reject(tx.error || new Error('No se pudo guardar la biblioteca restaurada.')); };
        tx.onabort = function () { reject(tx.error || new Error('No se pudo guardar la biblioteca restaurada.')); };
      });
    }).then(function () {
      return getAllMeta();
    }).then(function (list) {
      metas = (list || []).sort(function (a, b) { return b.added - a.added; });
      renderLibrary();
      notifyFavoritesChanged();
      notifyLibraryChanged();
    });
  }

  /* ---------- biblioteca ---------- */
  function renderLibrary() {
    var grid = $('pdfGrid');
    var empty = $('libEmpty');
    if (!grid || !empty) return;

    var list = metas.slice();
    if (filter === 'fav') list = list.filter(function (m) { return m.favorite; });
    if (filter === 'recent') list = list.filter(function (m) { return Date.now() - m.added < 1000 * 60 * 60 * 24 * 30; });
    if (query) {
      var q = query.toLowerCase();
      list = list.filter(function (m) { return (m.title || '').toLowerCase().indexOf(q) !== -1 || (m.name || '').toLowerCase().indexOf(q) !== -1; });
    }
    list.sort(function (a, b) { return b.added - a.added; });

    if ($('pdfCount')) $('pdfCount').textContent = metas.length;

    if (!metas.length) {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      empty.classList.remove('hidden');
      empty.innerHTML = '<span class="ico">&#128218;</span>'
        + '<h3>Tu biblioteca está vacía</h3>'
        + '<p>Sube tus PDFs (libros, guías, apuntes) y léelos aquí como un ebook, en tu compu, tablet o celular.</p>'
        + '<button class="lib-btn primary" id="libEmptyBtn">＋ Subir mi primer PDF</button>';
      var b = $('libEmptyBtn');
      if (b) b.addEventListener('click', pickFiles);
      return;
    }

    empty.classList.add('hidden');
    grid.classList.remove('hidden');

    if (!list.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-muted);font-size:13.5px">No hay PDFs que coincidan con tu búsqueda.</div>';
      return;
    }

    grid.innerHTML = list.map(function (m) {
      var pct = m.pages > 1 ? Math.round(((m.lastPage || 1) - 1) / (m.pages - 1) * 100) : 0;
      pct = clamp(pct, 0, 100);
      var cover = m.cover
        ? '<img src="' + m.cover + '" alt="" loading="lazy">'
        : '<span class="pdf-ph">&#128196;</span>';
      return '<article class="pdf-card" data-id="' + esc(m.id) + '">'
        + '<div class="pdf-cover">' + cover
        + '<button class="pdf-fav' + (m.favorite ? ' on' : '') + '" data-fav="' + esc(m.id) + '" title="' + (m.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos') + '" aria-label="' + (m.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos') + '">' + (m.favorite ? '★' : '☆') + '</button>'
        + '<button class="pdf-edit" data-edit="' + esc(m.id) + '" title="Renombrar">&#9998;</button>'
        + '<button class="pdf-del" data-del="' + esc(m.id) + '" title="Eliminar">✕</button>'
        + '</div>'
        + '<div class="pdf-meta">'
        + '<div class="pdf-title">' + esc(m.title) + '</div>'
        + '<div class="pdf-sub"><span>' + (m.pages || '?') + ' pág.</span><span>' + fmtSize(m.size) + '</span></div>'
        + '<div class="pdf-bar"><i style="width:' + pct + '%"></i></div>'
        + '</div></article>';
    }).join('');
  }

  function showLibrary() {
    var view = $('libraryView');
    if (!view) return;
    if ($('welcomeScreen')) $('welcomeScreen').classList.add('hidden');
    if ($('viewer')) $('viewer').classList.add('hidden');
    if ($('searchPanel')) $('searchPanel').classList.add('hidden');
    if ($('viewerFrame')) $('viewerFrame').src = '';
    view.classList.remove('hidden');
    if ($('breadcrumbs')) {
      $('breadcrumbs').innerHTML = '<span class="breadcrumb-item" onclick="window._showWelcome()">Alquimia Studio</span>'
        + '<span class="breadcrumb-separator">/</span><span class="breadcrumb-current">Mi Biblioteca</span>';
    }
    if ($('favoriteBtn')) $('favoriteBtn').classList.remove('active');
    if ($('favoriteBtn')) $('favoriteBtn').hidden = true;
    if ($('sidebar')) $('sidebar').classList.remove('mobile-open');
    renderLibrary();
  }
  function hideLibrary() {
    var view = $('libraryView');
    if (view) view.classList.add('hidden');
  }

  /* ---------- subir archivos ---------- */
  function pickFiles() {
    var inp = $('libFileInput');
    if (inp) inp.click();
  }

  function makeCover(doc) {
    return doc.getPage(1).then(function (page) {
      var base = page.getViewport({ scale: 1 });
      var scale = Math.min(300 / base.width, 400 / base.height);
      var vp = page.getViewport({ scale: scale });
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.ceil(vp.width));
      c.height = Math.max(1, Math.ceil(vp.height));
      return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () {
        try { return c.toDataURL('image/jpeg', 0.72); } catch (e) { return ''; }
      });
    }).catch(function () { return ''; });
  }

  function addFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []).filter(function (f) {
      return f && (f.type === 'application/pdf' || /\.pdf$/i.test(f.name));
    });
    if (!files.length) { toast('Elige uno o varios archivos PDF.'); return; }
    if (!pdfjs) { toast('No se pudo cargar el lector de PDF. Recarga la página.'); return; }

    var box = $('libUploading');
    var txt = $('libUploadText');
    if (box) box.classList.remove('hidden');

    var ok = 0, bad = 0;
    var chain = Promise.resolve();

    files.forEach(function (file, i) {
      chain = chain.then(function () {
        if (txt) txt.innerHTML = 'Preparando <b>' + esc(file.name) + '</b><br><span style="font-size:12px;opacity:.75">' + (i + 1) + ' de ' + files.length + '</span>';
        return file.arrayBuffer().then(function (buf) {
          return pdfjs.getDocument({ data: buf }).promise;
        }).then(function (doc) {
          var pages = doc.numPages;
          return makeCover(doc).then(function (cover) {
            var rec = {
              id: 'pdf-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
              name: file.name,
              title: cleanTitle(file.name),
              size: file.size,
              pages: pages,
              added: Date.now(),
              lastPage: 1,
              favorite: false,
              cover: cover
            };
            return putMeta(rec).then(function () {
              return putFile(rec.id, file);
            }).then(function () {
              metas.unshift(rec);
              ok++;
            }).then(function () {
              try { doc.destroy(); } catch (e) {}
            });
          });
        });
      }).catch(function (err) {
        bad++;
        try { console.warn('PDF error:', file.name, err); } catch (e) {}
      });
    });

    chain.then(function () {
      if (box) box.classList.add('hidden');
      renderLibrary();
      notifyLibraryChanged();
      if (ok && bad) toast(ok + ' PDF(s) agregados · ' + bad + ' con error');
      else if (ok) toast(ok + (ok === 1 ? ' PDF agregado a tu biblioteca ✓' : ' PDFs agregados a tu biblioteca ✓'));
      else toast('No se pudo agregar el PDF. Revisa que no esté dañado.');
    });
  }

  /* ---------- lector ---------- */
  function setReaderLoading(on) {
    var el = $('readerLoading');
    if (el) el.classList.toggle('hidden', !on);
  }

  function updateReaderUI() {
    if (!currentDoc) return;
    if ($('readerTotal')) $('readerTotal').textContent = currentDoc.numPages;
    if ($('readerPage')) {
      $('readerPage').value = currentPage;
      $('readerPage').max = currentDoc.numPages;
    }
    if ($('readerTitle')) $('readerTitle').textContent = currentRec ? currentRec.title : '';
    if ($('readerPrev')) $('readerPrev').disabled = currentPage <= 1;
    if ($('readerNext')) $('readerNext').disabled = currentPage >= currentDoc.numPages;
    if ($('readerZoom')) $('readerZoom').textContent = Math.round(zoom * 100) + '%';
    if ($('readerFav')) {
      $('readerFav').classList.toggle('on', !!(currentRec && currentRec.favorite));
      $('readerFav').textContent = currentRec && currentRec.favorite ? '★' : '☆';
      $('readerFav').title = currentRec && currentRec.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos';
    }
  }

  function saveProgress() {
    if (!currentRec) return;
    currentRec.lastPage = currentPage;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      if (!currentRec) return;
      putMeta(currentRec).catch(function () {});
      var card = document.querySelector('.pdf-card[data-id="' + currentRec.id + '"]');
      if (card) {
        var pct = currentRec.pages > 1 ? Math.round((Math.min(currentPage, currentRec.pages) - 1) / (currentRec.pages - 1) * 100) : 0;
        var bar = card.querySelector('.pdf-bar i');
        if (bar) bar.style.width = clamp(pct, 0, 100) + '%';
      }
    }, 450);
  }

  function cancelRender() {
    if (renderTask) {
      try { renderTask.cancel(); } catch (e) {}
      renderTask = null;
    }
  }

  function renderPage() {
    if (!currentDoc) return Promise.resolve();
    cancelRender();
    var seq = ++renderSeq;
    setReaderLoading(true);
    return currentDoc.getPage(currentPage).then(function (page) {
      if (seq !== renderSeq) return;
      var wrap = $('readerWrap');
      var canvas = $('readerCanvas');
      if (!wrap || !canvas) return;
      var base = page.getViewport({ scale: 1 });
      var avail = Math.max(240, wrap.clientWidth - 24);
      var fitScale = clamp(avail / base.width, 0.35, 4);
      var scale = fitScale * zoom;
      var dpr = window.devicePixelRatio || 1;
      var vp = page.getViewport({ scale: scale * dpr });
      canvas.width = Math.max(1, Math.floor(vp.width));
      canvas.height = Math.max(1, Math.floor(vp.height));
      canvas.style.width = Math.floor(vp.width / dpr) + 'px';
      canvas.style.height = 'auto';
      var ctx = canvas.getContext('2d');
      var task = page.render({ canvasContext: ctx, viewport: vp });
      renderTask = task;
      return task.promise.then(function () {
        if (seq !== renderSeq) return;
        renderTask = null;
        setReaderLoading(false);
        updateReaderUI();
        saveProgress();
      });
    }).catch(function (err) {
      if (seq !== renderSeq) return;
      if (err && err.name === 'RenderingCancelledException') return;
      renderTask = null;
      setReaderLoading(false);
      toast('No se pudo mostrar la página.');
      try { console.warn(err); } catch (e) {}
    });
  }

  function goTo(n) {
    if (!currentDoc) return;
    var p = clamp(parseInt(n, 10) || 1, 1, currentDoc.numPages);
    if (p === currentPage) { updateReaderUI(); return; }
    currentPage = p;
    renderPage();
    var wrap = $('readerWrap');
    if (wrap) wrap.scrollTop = 0;
  }

  function openReader(id) {
    var rec = metas.filter(function (m) { return m.id === id; })[0];
    if (!rec) return;
    if (!pdfjs) { toast('El lector de PDF no está disponible.'); return; }
    rec.lastOpened = Date.now();
    putMeta(rec).catch(function (err) {
      toast('No se pudo actualizar tu lectura reciente.');
      console.warn('Reading activity save failed:', err);
    });
    notifyLibraryChanged();
    currentRec = rec;
    currentPage = clamp(rec.lastPage || 1, 1, rec.pages || 1);
    zoom = 1;
    var reader = $('pdfReader');
    if (!reader) return;
    reader.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    var night = localStorage.getItem('alquimia-reader-night') === '1';
    reader.classList.toggle('night', night);
    if ($('readerNight')) $('readerNight').classList.toggle('on', night);
    setReaderLoading(true);

    var my = ++loadSeq;
    cancelRender();
    renderSeq++;
    getFile(id).then(function (blob) {
      if (!blob) throw new Error('Archivo no encontrado');
      return blob.arrayBuffer();
    }).then(function (buf) {
      return pdfjs.getDocument({ data: buf }).promise;
    }).then(function (doc) {
      if (my !== loadSeq) { try { doc.destroy(); } catch (e) {} return; }
      if (currentDoc) { try { currentDoc.destroy(); } catch (e) {} }
      currentDoc = doc;
      if (currentPage > doc.numPages) currentPage = doc.numPages;
      return renderPage();
    }).catch(function (err) {
      setReaderLoading(false);
      toast('No se pudo abrir este PDF.');
      try { console.warn(err); } catch (e) {}
    });
  }

  function closeReader() {
    var reader = $('pdfReader');
    if (reader) reader.classList.add('hidden');
    document.body.style.overflow = '';
    clearTimeout(saveTimer);
    cancelRender();
    renderSeq++;
    if (currentRec) {
      currentRec.lastPage = currentPage;
      putMeta(currentRec).catch(function () {});
    }
    if (currentDoc) { try { currentDoc.destroy(); } catch (e) {} }
    currentDoc = null;
    currentRec = null;
    loadSeq++;
    renderLibrary();
  }

  /* ---------- eventos ---------- */
  function bind() {
    var nav = $('navLibrary');
    if (nav) nav.addEventListener('click', showLibrary);

    var up = $('libUploadBtn');
    if (up) up.addEventListener('click', pickFiles);

    var inp = $('libFileInput');
    if (inp) inp.addEventListener('change', function (e) {
      addFiles(e.target.files);
      e.target.value = '';
    });

    var search = $('libSearch');
    if (search) search.addEventListener('input', function (e) {
      query = e.target.value.trim();
      renderLibrary();
    });

    document.querySelectorAll('[data-libfilter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-libfilter]').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        filter = chip.dataset.libfilter;
        renderLibrary();
      });
    });

    var grid = $('pdfGrid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var fav = e.target.closest('[data-fav]');
        if (fav) {
          e.stopPropagation();
          var id = fav.dataset.fav;
          var m = metas.filter(function (x) { return x.id === id; })[0];
          if (!m) return;
          m.favorite = !m.favorite;
          if (currentRec && currentRec.id === id) currentRec.favorite = m.favorite;
          saveFavorite(m);
          notifyFavoritesChanged();
          renderLibrary();
          updateReaderUI();
          return;
        }
        var edit = e.target.closest('[data-edit]');
        if (edit) {
          e.stopPropagation();
          var eid = edit.dataset.edit;
          var em = metas.filter(function (x) { return x.id === eid; })[0];
          if (!em) return;
          var newTitle = window.prompt('Nuevo título para este PDF:', em.title);
          if (newTitle === null) return;
          newTitle = String(newTitle).replace(/\s+/g, ' ').trim();
          if (!newTitle) return;
          em.title = newTitle.slice(0, 120);
          putMeta(em).catch(function () {});
          if (currentRec && currentRec.id === eid) {
            currentRec.title = em.title;
            if ($('readerTitle')) $('readerTitle').textContent = em.title;
          }
          renderLibrary();
          toast('Título actualizado ✓');
          return;
        }
        var del = e.target.closest('[data-del]');
        if (del) {          e.stopPropagation();
          var did = del.dataset.del;
          var rec = metas.filter(function (x) { return x.id === did; })[0];
          if (!rec) return;
          if (!window.confirm('¿Eliminar "' + rec.title + '" de tu biblioteca?\n\nEl archivo se borra de este dispositivo.')) return;
          delMeta(did).then(function () { return delFile(did); }).then(function () {
            metas = metas.filter(function (x) { return x.id !== did; });
            notifyFavoritesChanged();
            notifyLibraryChanged();
            renderLibrary();
            toast('PDF eliminado.');
          }).catch(function (err) {
            toast('No se pudo eliminar el PDF.');
            console.warn('PDF deletion failed:', err);
          });
          return;
        }
        var card = e.target.closest('.pdf-card');
        if (card) openReader(card.dataset.id);
      });
    }

    var view = $('libraryView');
    if (view) {
      ['dragenter', 'dragover'].forEach(function (ev) {
        view.addEventListener(ev, function (e) {
          e.preventDefault(); e.stopPropagation();
          view.classList.add('dragover');
        });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        view.addEventListener(ev, function (e) {
          e.preventDefault(); e.stopPropagation();
          if (ev === 'dragleave' && e.target !== view) return;
          view.classList.remove('dragover');
        });
      });
      view.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
      });
    }

    /* lector */
    if ($('readerClose')) $('readerClose').addEventListener('click', closeReader);
    if ($('readerPrev')) $('readerPrev').addEventListener('click', function () { goTo(currentPage - 1); });
    if ($('readerNext')) $('readerNext').addEventListener('click', function () { goTo(currentPage + 1); });
    if ($('readerPage')) {
      $('readerPage').addEventListener('change', function (e) { goTo(e.target.value); });
      $('readerPage').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); goTo(e.target.value); e.target.blur(); } });
    }
    if ($('readerZoomIn')) $('readerZoomIn').addEventListener('click', function () { zoom = clamp(zoom * 1.2, 0.5, 4); renderPage(); });
    if ($('readerZoomOut')) $('readerZoomOut').addEventListener('click', function () { zoom = clamp(zoom / 1.2, 0.5, 4); renderPage(); });
    if ($('readerFit')) $('readerFit').addEventListener('click', function () { zoom = 1; renderPage(); });
    if ($('readerNight')) $('readerNight').addEventListener('click', function () {
      var on = !$('pdfReader').classList.contains('night');
      $('pdfReader').classList.toggle('night', on);
      $('readerNight').classList.toggle('on', on);
      localStorage.setItem('alquimia-reader-night', on ? '1' : '0');
    });
    if ($('readerFs')) $('readerFs').addEventListener('click', function () {
      var r = $('pdfReader');
      if (!document.fullscreenElement) { if (r.requestFullscreen) r.requestFullscreen(); }
      else if (document.exitFullscreen) document.exitFullscreen();
    });
    if ($('readerFav')) $('readerFav').addEventListener('click', function () {
      if (!currentRec) return;
      currentRec.favorite = !currentRec.favorite;
      saveFavorite(currentRec);
      notifyFavoritesChanged();
      updateReaderUI();
      renderLibrary();
    });

    /* teclado */
    document.addEventListener('keydown', function (e) {
      var r = $('pdfReader');
      if (!r || r.classList.contains('hidden')) return;
      if (e.key === 'Escape') { closeReader(); return; }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(currentPage + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(currentPage - 1); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(1); }
      else if (e.key === 'End') { e.preventDefault(); goTo(currentDoc ? currentDoc.numPages : 1); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoom = clamp(zoom * 1.2, 0.5, 4); renderPage(); }
      else if (e.key === '-') { e.preventDefault(); zoom = clamp(zoom / 1.2, 0.5, 4); renderPage(); }
    });

    /* deslizar en móvil */
    var wrap = $('readerWrap');
    if (wrap) {
      var sx = 0, sy = 0, st = 0;
      wrap.addEventListener('touchstart', function (e) {
        if (!e.touches || e.touches.length !== 1) return;
        sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
      }, { passive: true });
      wrap.addEventListener('touchend', function (e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Date.now() - st > 700) return;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(currentPage + (dx < 0 ? 1 : -1));
      }, { passive: true });
    }

    /* reajustar al girar/redimensionar */
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var r = $('pdfReader');
        if (r && !r.classList.contains('hidden') && currentDoc) renderPage();
      }, 220);
    });
  }

  /* ---------- API pública ---------- */
  function init() {
    if (inited) return;
    if (!document.getElementById('libraryView')) return;
    inited = true;
    bind();
    getAllMeta().then(function (list) {
      metas = (list || []).sort(function (a, b) { return b.added - a.added; });
      notifyFavoritesChanged();
      notifyLibraryChanged();
      renderLibrary();
      notifyFavoritesChanged();
    }).catch(function (err) {
      try { console.warn('IndexedDB no disponible:', err); } catch (e) {}
    });
  }

  window.AlquimiaLibrary = {
    init: init,
    show: showLibrary,
    hide: hideLibrary,
    exportBackup: exportBackup,
    importBackup: importBackup,
    onFavoritesChange: function (handler) {
      favoritesChangeHandler = handler;
      notifyFavoritesChanged();
    },
    onLibraryChange: function (handler) {
      libraryChangeHandler = handler;
      notifyLibraryChanged();
    },
    openFavorite: function (id) {
      showLibrary();
      openReader(id);
    },
    isOpen: function () {
      var v = document.getElementById('libraryView');
      return !!(v && !v.classList.contains('hidden'));
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
