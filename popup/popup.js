// Popup script — handles UI interactions, settings, and content script messaging
(function () {
  'use strict';

  // ── DOM refs ─────────────────────────────────────────────────
  const statusText = document.getElementById('statusText');
  const statusIndicator = document.getElementById('statusIndicator');
  const resetBtn = document.getElementById('resetBtn');
  const modeCards = document.querySelectorAll('.mode-card');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const providerSelect = document.getElementById('providerSelect');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const modelInput = document.getElementById('modelInput');
  const settingsStatus = document.getElementById('settingsStatus');

  // ── State ────────────────────────────────────────────────────
  let activeModes = new Set();
  let simplifyState = { loading: false };

  // ── Get active tab ──────────────────────────────────────────
  async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  }

  // ── Send message to content script ──────────────────────────
  async function sendToContent(message) {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    try {
      const response = await chrome.tabs.sendMessage(tab.id, message);
      return response;
    } catch (err) {
      console.warn('ClarityAI: Cannot reach content script', err.message);
      updateStatus('Cannot modify this page', 'inactive');
      return null;
    }
  }

  // ── Update status bar ───────────────────────────────────────
  function updateStatus(text, state) {
    statusText.textContent = text;
    statusIndicator.className = 'status-indicator';
    if (state === 'active') statusIndicator.classList.add('active');
    else if (state === 'loading') statusIndicator.classList.add('loading');
  }

  // ── Update UI to reflect active modes ──────────────────────
  function refreshUI() {
    modeCards.forEach(card => {
      const mode = card.dataset.mode;
      card.classList.toggle('active', activeModes.has(mode));
    });

    if (activeModes.size === 0) {
      updateStatus('No modes active', 'inactive');
    } else {
      const names = Array.from(activeModes)
        .map(m => ({ focus: '🎯Focus', dyslexia: '📖Dyslexia', simplify: '✂️Simplify' }[m]))
        .join(' + ');
      updateStatus(`Active: ${names}`, 'active');
    }
  }

  // ── Toggle a mode ───────────────────────────────────────────
  async function toggleMode(mode) {
    if (mode === 'simplify' && simplifyState.loading) return;

    const isActive = activeModes.has(mode);
    const action = isActive ? 'disable' : 'enable';

    if (action === 'enable' && mode === 'simplify') {
      // Check if API key is configured before enabling
      const config = await loadConfig();
      if (!config.apiKey) {
        showSettings(true);
        settingsStatus.textContent = '⚠️ Set your API key first to use Simplify';
        settingsStatus.className = 'settings-status error';
        return;
      }
      simplifyState.loading = true;
      updateStatus('Simplifying...', 'loading');
    }

    const response = await sendToContent({ mode, action });

    if (response?.success) {
      if (action === 'enable') {
        activeModes.add(mode);
      } else {
        activeModes.delete(mode);
      }
    }

    if (mode === 'simplify') {
      simplifyState.loading = false;
    }

    refreshUI();
  }

  // ── Reset all modes ─────────────────────────────────────────
  async function resetAll() {
    await sendToContent({ mode: 'reset', action: 'all' });
    activeModes.clear();
    simplifyState.loading = false;
    refreshUI();
  }

  // ── Sync state from content script on popup open ────────────
  async function syncState() {
    const response = await sendToContent({ mode: 'sync', action: 'getState' });
    if (response?.activeModes) {
      activeModes = new Set(response.activeModes);
      refreshUI();
    }
  }

  // ── Settings panel ──────────────────────────────────────────

  function showSettings(show) {
    settingsPanel.style.display = show ? 'block' : 'none';
    if (show) loadConfigIntoUI();
  }

  async function loadConfig() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
      return response?.config || {};
    } catch {
      return {};
    }
  }

  async function loadConfigIntoUI() {
    const config = await loadConfig();
    providerSelect.value = config.provider || 'anthropic';
    apiKeyInput.value = config.apiKey || '';
    modelInput.value = config.model || '';
  }

  async function saveConfig() {
    const config = {
      provider: providerSelect.value,
      apiKey: apiKeyInput.value.trim(),
      model: modelInput.value.trim(),
      baseUrl: '',
    };

    if (!config.apiKey) {
      settingsStatus.textContent = '⚠️ API key is required';
      settingsStatus.className = 'settings-status error';
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_CONFIG',
        config,
      });

      if (response?.success) {
        settingsStatus.textContent = '✅ Settings saved';
        settingsStatus.className = 'settings-status success';
        setTimeout(() => showSettings(false), 1200);
      } else {
        throw new Error(response?.error || 'Save failed');
      }
    } catch (err) {
      settingsStatus.textContent = '❌ ' + (err.message || 'Failed to save');
      settingsStatus.className = 'settings-status error';
    }
  }

  // ── Event listeners ─────────────────────────────────────────
  modeCards.forEach(card => {
    card.addEventListener('click', () => toggleMode(card.dataset.mode));
  });

  resetBtn.addEventListener('click', resetAll);

  settingsBtn.addEventListener('click', () => {
    const isOpen = settingsPanel.style.display !== 'none';
    showSettings(!isOpen);
  });

  closeSettingsBtn.addEventListener('click', () => showSettings(false));
  cancelSettingsBtn.addEventListener('click', () => showSettings(false));
  saveSettingsBtn.addEventListener('click', saveConfig);

  // ── Initialize ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', syncState);

})();
