/* Focus Mode — Remove clutter, increase readability */

(function () {
  'use strict';

  const FOCUS_CLASS = 'clarity-focus-mode';
  const HIDDEN_CLASS = 'clarity-hidden';

  window.FocusMode = {
    enabled: false,
    styleEl: null,
    hiddenElements: [],
    restoredStyles: new Map(),

    enable() {
      if (this.enabled) return { success: true, alreadyActive: true };
      this.enabled = true;

      // 1. Inject focus styles
      this._injectStyles();

      // 2. Hide clutter
      this._hideClutter();

      // 3. Apply readability enhancements to main content
      this._enhanceMainContent();

      return { success: true, mode: 'focus', state: 'enabled' };
    },

    disable() {
      if (!this.enabled) return { success: true, alreadyInactive: true };
      this.enabled = false;

      // 1. Remove style element
      if (this.styleEl?.parentNode) {
        this.styleEl.parentNode.removeChild(this.styleEl);
        this.styleEl = null;
      }

      // 2. Restore hidden elements
      this._restoreHidden();

      // 3. Remove classes from body
      document.body.classList.remove(FOCUS_CLASS);

      // 4. Restore modified elements
      this._restoreEnhancements();

      return { success: true, mode: 'focus', state: 'disabled' };
    },

    _injectStyles() {
      // Styles are already injected via manifest content_scripts CSS
      // The CSS file focus.css handles the visual transformations
      document.body.classList.add(FOCUS_CLASS);
    },

    _hideClutter() {
      const selectors = window.ClarityDOM.getClutterSelectors();
      const main = window.ClarityDOM.findMainContent();

      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          // Don't hide elements inside main content
          if (main && main.contains(el)) return;

          // Don't hide if already hidden
          if (el.classList.contains(HIDDEN_CLASS)) return;

          // Don't hide the body or html
          if (el === document.body || el === document.documentElement) return;

          const originalDisplay = el.style.display;
          this.restoredStyles.set(el, originalDisplay);
          el.style.display = 'none';
          el.classList.add(HIDDEN_CLASS);
          this.hiddenElements.push(el);
        });
      });
    },

    _restoreHidden() {
      this.hiddenElements.forEach(el => {
        el.classList.remove(HIDDEN_CLASS);
        if (this.restoredStyles.has(el)) {
          el.style.display = this.restoredStyles.get(el);
        } else {
          el.style.display = '';
        }
      });
      this.hiddenElements = [];
      this.restoredStyles.clear();
    },

    _enhanceMainContent() {
      const main = window.ClarityDOM.findMainContent();
      if (!main) return;

      // Add readability container class
      main.classList.add('clarity-focus-content');

      // Highlight headings
      main.querySelectorAll('h1, h2, h3, h4').forEach(h => {
        h.classList.add('clarity-focus-heading');
      });

      // Highlight key paragraphs (first paragraph after each heading)
      const headings = main.querySelectorAll('h2, h3');
      headings.forEach(h => {
        let next = h.nextElementSibling;
        if (next && next.tagName === 'P') {
          next.classList.add('clarity-key-paragraph');
        }
      });
    },

    _restoreEnhancements() {
      document.querySelectorAll('.clarity-focus-content').forEach(el => {
        el.classList.remove('clarity-focus-content');
      });
      document.querySelectorAll('.clarity-focus-heading').forEach(el => {
        el.classList.remove('clarity-focus-heading');
      });
      document.querySelectorAll('.clarity-key-paragraph').forEach(el => {
        el.classList.remove('clarity-key-paragraph');
      });
    }
  };

})();
