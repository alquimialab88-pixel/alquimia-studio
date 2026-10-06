/* ===== Alquimia Studio — Main Application ===== */

/* ===== License System ===== */
const LICENSE_SECRET = 'ALQUIMIA2027';
const LICENSE_KEY = 'alquimia-license';

function generateLicenseHash(code) {
  let hash = 0;
  const str = code.replace(/-/g, '') + LICENSE_SECRET;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase().slice(0, 8);
}

function validateLicense(code) {
  const cleanCode = code.replace(/-/g, '').toUpperCase();
  if (cleanCode.length !== 16) return false;
  const baseCode = cleanCode.slice(0, 12);
  const inputCode = baseCode.slice(0, 4) + '-' + baseCode.slice(4, 8) + '-' + baseCode.slice(8, 12);
  const hash = generateLicenseHash(inputCode);
  return cleanCode.endsWith(hash.slice(-4));
}

function getStoredLicense() {
  return localStorage.getItem(LICENSE_KEY);
}

function storeLicense(code) {
  localStorage.setItem(LICENSE_KEY, code);
}

function isLicenseValid() {
  const stored = getStoredLicense();
  if (!stored) return false;
  return validateLicense(stored);
}

function initLicense() {
  try {
    const licenseScreen = document.getElementById('licenseScreen');
    const licenseForm = document.getElementById('licenseForm');
    const licenseSuccess = document.getElementById('licenseSuccess');
    const licenseInput = document.getElementById('licenseInput');
    const activateBtn = document.getElementById('activateBtn');
    const licenseError = document.getElementById('licenseError');

    if (isLicenseValid()) {
      licenseScreen.style.display = 'none';
      return true;
    }

    licenseScreen.style.display = 'flex';

    licenseInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      let formatted = value.match(/.{1,4}/g)?.join('-') || value;
      e.target.value = formatted;
    });

    activateBtn.addEventListener('click', () => {
      const code = licenseInput.value.trim();
      if (validateLicense(code)) {
        storeLicense(code);
        licenseForm.classList.add('hidden');
        licenseSuccess.classList.remove('hidden');
        setTimeout(() => {
          licenseScreen.style.display = 'none';
          initApp();
        }, 1500);
      } else {
        licenseError.textContent = 'Código inválido. Verifica e intenta de nuevo.';
        licenseError.classList.remove('hidden');
        licenseInput.classList.add('shake');
        setTimeout(() => licenseInput.classList.remove('shake'), 500);
      }
    });

    licenseInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') activateBtn.click();
    });

    return false;
  } catch(e) {
    return true;
  }
}

/* ===== Planner data ===== */
const PLANNERS = [
  {
    id: 'calma-y-orden',
    name: 'Calma y Orden',
    icon: '📓',
    description: 'Journal anual de autocuidado + organización',
    file: 'planners/calma-y-orden.html',
    color: '#6463aa'
  },
  {
    id: 'planner-anual',
    name: 'Planner Anual',
    icon: '📅',
    description: 'Planifica tu año con intención',
    file: 'planners/planner-anual.html',
    color: '#6463aa'
  },
  {
    id: 'planner-tdah',
    name: 'Planner TDAH',
    icon: '🧠',
    description: 'Prioridades visuales para cerebros diferentes',
    file: 'planners/planner-tdah.html',
    color: '#8f8dc7'
  },
  {
    id: 'planner-menstrual',
    name: 'Calendario Menstrual',
    icon: '🌸',
    description: 'Ciclo, síntomas y bienestar',
    file: 'planners/planner-menstrual.html',
    color: '#d4789c'
  }
];

// App State
let state = {
  currentPlanner: null,
  favorites: JSON.parse(localStorage.getItem('alquimia-favorites') || '[]'),
  theme: localStorage.getItem('alquimia-theme') || 'light',
  sidebarOpen: localStorage.getItem('alquimia-sidebar') !== 'false',
  customFiles: JSON.parse(localStorage.getItem('alquimia-custom-files') || '[]')
};

// DOM Elements
const elements = {
  splash: document.getElementById('splash'),
  app: document.getElementById('app'),
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  mobileSidebarToggle: document.getElementById('mobileSidebarToggle'),
  plannerList: document.getElementById('plannerList'),
  favoritesList: document.getElementById('favoritesList'),
  favCount: document.getElementById('favCount'),
  searchInput: document.getElementById('searchInput'),
  contentArea: document.getElementById('contentArea'),
  welcomeScreen: document.getElementById('welcomeScreen'),
  welcomeCards: document.getElementById('welcomeCards'),
  viewer: document.getElementById('viewer'),
  viewerFrame: document.getElementById('viewerFrame'),
  breadcrumbs: document.getElementById('breadcrumbs'),
  searchToggle: document.getElementById('searchToggle'),
  searchPanel: document.getElementById('searchPanel'),
  searchPanelInput: document.getElementById('searchPanelInput'),
  searchResults: document.getElementById('searchResults'),
  searchClose: document.getElementById('searchClose'),
  favoriteBtn: document.getElementById('favoriteBtn'),
  exportPdf: document.getElementById('exportPdf'),
  fullscreenBtn: document.getElementById('fullscreenBtn'),
  openFileBtn: document.getElementById('openFileBtn'),
  themeToggle: document.getElementById('themeToggle'),
  fileInput: document.getElementById('fileInput')
};

// Initialize App
function init() {
  try {
    if (!initLicense()) return;
    initApp();
  } catch(e) {
    // Force show app even if error
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
  }
}

function initApp() {
  // Apply theme
  applyTheme(state.theme);

  // Apply sidebar state
  if (!state.sidebarOpen) {
    elements.sidebar.classList.add('collapsed');
  }

  // Render UI
  renderPlannerList();
  renderFavorites();
  renderWelcomeCards();

  // Setup event listeners
  setupEventListeners();

  // Always hide splash
  setTimeout(() => {
    elements.splash.classList.add('fade-out');
    elements.app.classList.remove('hidden');
    setTimeout(() => {
      elements.splash.style.display = 'none';
    }, 500);
  }, 800);

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

// Render Functions
function renderPlannerList() {
  const allPlanners = [...PLANNERS, ...state.customFiles];
  elements.plannerList.innerHTML = allPlanners.map(p => `
    <li class="nav-item ${state.currentPlanner === p.id ? 'active' : ''}" data-id="${p.id}">
      <span class="nav-item-icon">${p.icon}</span>
      <span class="nav-item-text">${p.name}</span>
      <span class="nav-item-fav ${state.favorites.includes(p.id) ? 'active' : ''}" data-fav="${p.id}">⭐</span>
    </li>
  `).join('');

  // Add click handlers
  elements.plannerList.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-item-fav')) {
        toggleFavorite(e.target.dataset.fav);
        return;
      }
      openPlanner(item.dataset.id);
    });
  });
}

function renderFavorites() {
  const allPlanners = [...PLANNERS, ...state.customFiles];
  const favPlanners = allPlanners.filter(p => state.favorites.includes(p.id));

  elements.favCount.textContent = favPlanners.length;

  if (favPlanners.length === 0) {
    elements.favoritesList.innerHTML = '<li class="nav-item" style="opacity:0.5;cursor:default"><span class="nav-item-text">Sin favoritos aún</span></li>';
    return;
  }

  elements.favoritesList.innerHTML = favPlanners.map(p => `
    <li class="nav-item" data-id="${p.id}">
      <span class="nav-item-icon">${p.icon}</span>
      <span class="nav-item-text">${p.name}</span>
    </li>
  `).join('');

  elements.favoritesList.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => openPlanner(item.dataset.id));
  });
}

function renderWelcomeCards() {
  const allPlanners = [...PLANNERS, ...state.customFiles];
  elements.welcomeCards.innerHTML = allPlanners.map(p => `
    <div class="welcome-card" data-id="${p.id}">
      <div class="welcome-card-icon">${p.icon}</div>
      <div class="welcome-card-title">${p.name}</div>
      <div class="welcome-card-desc">${p.description}</div>
    </div>
  `).join('');

  elements.welcomeCards.querySelectorAll('.welcome-card').forEach(card => {
    card.addEventListener('click', () => openPlanner(card.dataset.id));
  });
}

// Core Functions
function openPlanner(id) {
  const allPlanners = [...PLANNERS, ...state.customFiles];
  const planner = allPlanners.find(p => p.id === id);
  if (!planner) return;

  state.currentPlanner = id;

  // Update UI
  renderPlannerList();
  updateBreadcrumbs(planner.name);
  updateFavoriteButton();

  // Show viewer
  elements.welcomeScreen.classList.add('hidden');
  elements.viewer.classList.remove('hidden');

  // Load planner
  elements.viewerFrame.src = planner.file;

  // Close mobile sidebar
  elements.sidebar.classList.remove('mobile-open');
}

function updateBreadcrumbs(name) {
  elements.breadcrumbs.innerHTML = `
    <span class="breadcrumb-item" onclick="showWelcome()">Alquimia Studio</span>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-current">${name}</span>
  `;
}

function showWelcome() {
  state.currentPlanner = null;
  elements.welcomeScreen.classList.remove('hidden');
  elements.viewer.classList.add('hidden');
  elements.viewerFrame.src = '';
  renderPlannerList();
  elements.breadcrumbs.innerHTML = '<span class="breadcrumb-item">Alquimia Studio</span>';
  updateFavoriteButton();
}

function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index === -1) {
    state.favorites.push(id);
  } else {
    state.favorites.splice(index, 1);
  }
  localStorage.setItem('alquimia-favorites', JSON.stringify(state.favorites));
  renderPlannerList();
  renderFavorites();
  updateFavoriteButton();
}

function updateFavoriteButton() {
  if (!state.currentPlanner) {
    elements.favoriteBtn.classList.remove('active');
    return;
  }
  elements.favoriteBtn.classList.toggle('active', state.favorites.includes(state.currentPlanner));
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  localStorage.setItem('alquimia-theme', state.theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  elements.sidebar.classList.toggle('collapsed', !state.sidebarOpen);
  localStorage.setItem('alquimia-sidebar', state.sidebarOpen);
}

function toggleMobileSidebar() {
  elements.sidebar.classList.toggle('mobile-open');
}

function toggleSearchPanel() {
  elements.searchPanel.classList.toggle('hidden');
  if (!elements.searchPanel.classList.contains('hidden')) {
    elements.searchPanelInput.focus();
  }
}

function exportToPDF() {
  if (!state.currentPlanner) return;

  // Try to print the iframe content
  try {
    const iframe = elements.viewerFrame;
    const iframeWindow = iframe.contentWindow;
    iframeWindow.print();
  } catch (e) {
    // Fallback: open in new tab for printing
    const allPlanners = [...PLANNERS, ...state.customFiles];
    const planner = allPlanners.find(p => p.id === state.currentPlanner);
    if (planner) {
      window.open(planner.file, '_blank');
    }
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function openFile() {
  elements.fileInput.click();
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const id = 'custom-' + Date.now() + '-' + file.name.replace(/\.[^/.]+$/, '');
      const customFile = {
        id: id,
        name: file.name.replace(/\.[^/.]+$/, ''),
        icon: '📄',
        description: 'Archivo personalizado',
        file: event.target.result, // Data URL
        color: '#6463aa',
        isCustom: true
      };

      state.customFiles.push(customFile);
      localStorage.setItem('alquimia-custom-files', JSON.stringify(state.customFiles));

      renderPlannerList();
      renderWelcomeCards();
      openPlanner(id);
    };
    reader.readAsDataURL(file);
  });

  // Reset input
  e.target.value = '';
}

// Search functionality
function handleSearch(query) {
  if (!query.trim()) {
    elements.searchResults.innerHTML = '';
    return;
  }

  // Search through planner content
  const allPlanners = [...PLANNERS, ...state.customFiles];
  const results = [];

  allPlanners.forEach(p => {
    const nameMatch = p.name.toLowerCase().includes(query.toLowerCase());
    const descMatch = p.description.toLowerCase().includes(query.toLowerCase());

    if (nameMatch || descMatch) {
      results.push({
        planner: p,
        context: descMatch ? p.description : p.name
      });
    }
  });

  elements.searchResults.innerHTML = results.map(r => `
    <div class="search-result-item" data-id="${r.planner.id}">
      <div class="search-result-text">${r.planner.icon} ${highlightText(r.planner.name, query)}</div>
      <div class="search-result-context">${r.context}</div>
    </div>
  `).join('');

  if (results.length === 0) {
    elements.searchResults.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted)">No se encontraron resultados</div>';
  }

  // Add click handlers
  elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      openPlanner(item.dataset.id);
      toggleSearchPanel();
    });
  });
}

function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Event Listeners
function setupEventListeners() {
  // Sidebar
  elements.sidebarToggle.addEventListener('click', toggleSidebar);
  elements.mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);

  // Search
  elements.searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  elements.searchToggle.addEventListener('click', toggleSearchPanel);
  elements.searchClose.addEventListener('click', toggleSearchPanel);
  elements.searchPanelInput.addEventListener('input', (e) => handleSearch(e.target.value));

  // Toolbar
  elements.favoriteBtn.addEventListener('click', () => {
    if (state.currentPlanner) {
      toggleFavorite(state.currentPlanner);
    }
  });
  elements.exportPdf.addEventListener('click', exportToPDF);
  elements.fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Sidebar buttons
  elements.openFileBtn.addEventListener('click', openFile);
  elements.themeToggle.addEventListener('click', toggleTheme);

  // File input
  elements.fileInput.addEventListener('change', handleFileSelect);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K = Search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearchPanel();
    }
    // Escape = Close panels
    if (e.key === 'Escape') {
      elements.searchPanel.classList.add('hidden');
      elements.sidebar.classList.remove('mobile-open');
    }
    // Ctrl/Cmd + O = Open file
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      openFile();
    }
  });

  // Close mobile sidebar on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        elements.sidebar.classList.contains('mobile-open') &&
        !elements.sidebar.contains(e.target) &&
        !elements.mobileSidebarToggle.contains(e.target)) {
      elements.sidebar.classList.remove('mobile-open');
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
