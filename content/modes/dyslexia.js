/* Dyslexia Mode — Dyslexia-friendly formatting */

(function () {
  'use strict';

  const DYSLEXIA_CLASS = 'clarity-dyslexia-mode';

  window.DyslexiaMode = {
    enabled: false,
    styleEl: null,
    originalStyles: new Map(),

    enable() {
      if (this.enabled) return { success: true, alreadyActive: true };
      this.enabled = true;

      document.body.classList.add(DYSLEXIA_CLASS);

      return { success: true, mode: 'dyslexia', state: 'enabled' };
    },

    disable() {
      if (!this.enabled) return { success: true, alreadyInactive: true };
      this.enabled = false;

      document.body.classList.remove(DYSLEXIA_CLASS);

      return { success: true, mode: 'dyslexia', state: 'disabled' };
    }
  };

})();
