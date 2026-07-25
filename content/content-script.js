/* Content Script — Message router and orchestrator */

(function () {
  'use strict';

  // ── Injected state tracking ─────────────────────────────────
  const state = {
    activeModes: new Set(),
    initialized: false,
  };

  // ── Mode handler map ────────────────────────────────────────
  const handlers = {
    focus:     (action) => action === 'enable' ? FocusMode.enable()     : FocusMode.disable(),
    dyslexia:  (action) => action === 'enable' ? DyslexiaMode.enable()  : DyslexiaMode.disable(),
    simplify:  (action) => action === 'enable' ? SimplifyMode.enable()  : SimplifyMode.disable(),
  };

  // ── Message listener ────────────────────────────────────────
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const { mode, action } = msg;

    switch (mode) {
      case 'focus':
      case 'dyslexia':
      case 'simplify': {
        const handler = handlers[mode];
        if (!handler) {
          sendResponse({ success: false, error: `Unknown mode: ${mode}` });
          return false;
        }

        const result = handler(action);
        if (result) {
          // Update active state
          if (result.state === 'enabled' && !result.alreadyActive) {
            state.activeModes.add(mode);
          } else if (result.state === 'disabled' && !result.alreadyInactive) {
            state.activeModes.delete(mode);
          }
        }

        sendResponse({ ...result, activeModes: Array.from(state.activeModes) });
        break;
      }

      case 'reset': {
        // Disable all modes
        FocusMode.disable();
        DyslexiaMode.disable();
        SimplifyMode.disable();
        state.activeModes.clear();
        sendResponse({ success: true, activeModes: [] });
        break;
      }

      case 'sync': {
        // Return current state (popup asks on open)
        sendResponse({
          success: true,
          activeModes: Array.from(state.activeModes),
          url: window.location.href,
        });
        break;
      }

      default:
        sendResponse({ success: false, error: `Unknown message type: ${mode}` });
    }

    return true; // Keep channel open for async responses
  });

  // ── Notify popup when simplify state changes ────────────────
  // (Simplify is async, so we need to push state updates)
  const originalSimplifyEnable = SimplifyMode.enable.bind(SimplifyMode);
  SimplifyMode.enable = function() {
    const result = originalSimplifyEnable();
    if (result.success) {
      state.activeModes.add('simplify');
    }
    return result;
  };

  const originalSimplifyDisable = SimplifyMode.disable.bind(SimplifyMode);
  SimplifyMode.disable = function() {
    const result = originalSimplifyDisable();
    if (result.success) {
      state.activeModes.delete('simplify');
    }
    return result;
  };

  state.initialized = true;
  console.log('🔍 ClarityAI content script loaded');

})();
