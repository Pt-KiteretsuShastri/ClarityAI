// Popup script — handles UI interactions and communicates with content script
(function () {
  'use strict';

  const statusText = document.getElementById('statusText');
  const statusIndicator = document.getElementById('statusIndicator');
  const resetBtn = document.getElementById('resetBtn');
  const modeCards = document.querySelectorAll('.mode-card');

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
      // Content script might not be loaded (e.g., chrome:// pages)
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
      simplifyState.loading = true;
      updateStatus('Simplifying...', 'loading');
    }

    const response = await sendToContent({ mode, action });

    if (action === 'enable') {
      activeModes.add(mode);
    } else {
      activeModes.delete(mode);
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

  // ── Event listeners ─────────────────────────────────────────
  modeCards.forEach(card => {
    card.addEventListener('click', () => toggleMode(card.dataset.mode));
  });

  resetBtn.addEventListener('click', resetAll);

  // ── Initialize ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', syncState);

})();
