/**
 * @fileoverview Content Script — Message router and mode orchestrator.
 *
 * This is the central hub for all content script operations. It:
 * 1. Listens for messages from the popup script
 * 2. Routes messages to the appropriate mode handler (focus/dyslexia/simplify)
 * 3. Tracks which modes are currently active
 * 4. Handles the reset-all and sync-state operations
 *
 * Communication flow:
 *   popup.js  ──(chrome.tabs.sendMessage)──►  content-script.js  ──►  Mode modules
 */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  /** @type {Set<string>} Currently active mode names */
  const activeModes = new Set();

  /** @type {boolean} Whether the script has completed initialization */
  let initialized = false;

  // ── Mode Handler Registry ───────────────────────────────────
  /**
   * Maps mode names to their handler modules.
   * Each handler must expose enable() and disable() methods.
   */
  const handlers = {
    focus:    { module: window.FocusMode,    label: '🎯 Focus' },
    dyslexia: { module: window.DyslexiaMode, label: '📖 Dyslexia' },
    simplify: { module: window.SimplifyMode, label: '✂️ Simplify' },
  };

  /**
   * Execute an action on a mode handler.
   * @param {string} mode - Mode name ('focus', 'dyslexia', 'simplify')
   * @param {string} action - 'enable' or 'disable'
   * @returns {Object|null} Handler result or null if mode unknown
   */
  function executeMode(mode, action) {
    const entry = handlers[mode];
    if (!entry || !entry.module) return null;

    const handler = entry.module;
    const result = action === 'enable' ? handler.enable() : handler.disable();

    if (result) {
      if (result.state === 'enabled' && !result.alreadyActive) {
        activeModes.add(mode);
      } else if (result.state === 'disabled' && !result.alreadyInactive) {
        activeModes.delete(mode);
      }
    }

    return { ...result, activeModes: Array.from(activeModes) };
  }

  /**
   * Disable all active modes and reset the page to its original state.
   * @returns {Object} Result with cleared activeModes array
   */
  function resetAllModes() {
    Object.keys(handlers).forEach(mode => {
      const entry = handlers[mode];
      if (entry.module && entry.module.enabled) {
        entry.module.disable();
      }
    });
    activeModes.clear();
    return { success: true, activeModes: [] };
  }

  // ── Message Listener ────────────────────────────────────────
  /**
   * Handle incoming messages from the popup script.
   * Supports: focus, dyslexia, simplify (enable/disable), reset, sync.
   *
   * @param {Object} msg - Message from popup
   * @param {string} msg.mode - Target mode or 'reset' or 'sync'
   * @param {string} msg.action - 'enable', 'disable', 'all', or 'getState'
   * @param {Object} sender - Sender info (unused)
   * @param {Function} sendResponse - Callback to send response
   * @returns {boolean} True if response will be sent asynchronously
   */
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const { mode, action } = msg;

    switch (mode) {
      case 'focus':
      case 'dyslexia':
      case 'simplify': {
        if (action !== 'enable' && action !== 'disable') {
          sendResponse({ success: false, error: `Invalid action: ${action}` });
          return false;
        }
        const result = executeMode(mode, action);
        sendResponse(result || { success: false, error: `Handler not found: ${mode}` });
        break;
      }

      case 'reset': {
        sendResponse(resetAllModes());
        break;
      }

      case 'sync': {
        sendResponse({
          success: true,
          activeModes: Array.from(activeModes),
          url: window.location.href,
        });
        break;
      }

      default:
        sendResponse({ success: false, error: `Unknown message mode: ${mode}` });
    }

    return false; // All handlers are synchronous
  });

  // ── Simplify Mode Async State Sync ──────────────────────────
  // Simplify mode's enable/disable is async (LLM call), so we need
  // to wrap the originals to keep activeModes in sync.

  const originalSimplifyEnable = window.SimplifyMode?.enable?.bind(window.SimplifyMode);
  const originalSimplifyDisable = window.SimplifyMode?.disable?.bind(window.SimplifyMode);

  if (window.SimplifyMode && originalSimplifyEnable) {
    window.SimplifyMode.enable = function () {
      const result = originalSimplifyEnable();
      if (result?.success) activeModes.add('simplify');
      return result;
    };
  }

  if (window.SimplifyMode && originalSimplifyDisable) {
    window.SimplifyMode.disable = function () {
      const result = originalSimplifyDisable();
      if (result?.success) activeModes.delete('simplify');
      return result;
    };
  }

  // ── Initialization ──────────────────────────────────────────
  initialized = true;
  console.log('🔍 ClarityAI content script loaded');

})();
