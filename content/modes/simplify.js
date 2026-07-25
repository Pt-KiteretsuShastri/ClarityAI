/* Simplify Mode — AI-powered text simplification */

(function () {
  'use strict';

  const SIMPLIFY_CLASS = 'clarity-simplify-mode';
  const STORAGE_KEY = 'clarity-simplify-originals';

  window.SimplifyMode = {
    enabled: false,
    loading: false,
    originals: new Map(),  // selector -> original HTML
    sentinelId: 'clarity-simplify-sentinel',

    enable() {
      if (this.enabled) return { success: true, alreadyActive: true };
      if (this.loading) return { success: false, message: 'Already simplifying...' };

      this.enabled = true;
      document.body.classList.add(SIMPLIFY_CLASS);

      // Start the simplification process
      this._simplify();

      return { success: true, mode: 'simplify', state: 'enabled' };
    },

    disable() {
      if (!this.enabled) return { success: true, alreadyInactive: true };
      this.enabled = false;
      this.loading = false;

      document.body.classList.remove(SIMPLIFY_CLASS);

      // Restore original content
      this._restoreOriginals();

      return { success: true, mode: 'simplify', state: 'disabled' };
    },

    /**
     * Extract text from main content and send to LLM
     */
    async _simplify() {
      this.loading = true;

      const mainEl = window.ClarityDOM.findMainContent();
      if (!mainEl) {
        this.loading = false;
        return { success: false, message: 'No main content found' };
      }

      // Store original HTML for restoration
      const contentId = 'clarity-main-content';
      if (!mainEl.id) mainEl.id = contentId;
      this.originals.set('#' + mainEl.id, mainEl.innerHTML);

      // Show loading state
      mainEl.classList.add('clarity-simplify-loading');

      try {
        const text = window.ClarityDOM.getMainContentText(4000);

        if (!text || text.length < 20) {
          throw new Error('Not enough content to simplify');
        }

        // Check if background is available
        if (!chrome?.runtime?.sendMessage) {
          throw new Error('Extension context not available');
        }

        // Send to background worker for LLM processing
        const response = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(
            {
              type: 'LLM_REQUEST',
              mode: 'simplify',
              text: text,
              url: window.location.href,
              title: document.title
            },
            (result) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else if (result?.error) {
                reject(new Error(result.error));
              } else {
                resolve(result);
              }
            }
          );
        });

        if (response?.text) {
          this._applySimplifiedText(mainEl, response.text);
        } else {
          throw new Error('No response from AI');
        }

      } catch (err) {
        console.warn('ClarityAI Simplify error:', err.message);
        this._showError(mainEl, err.message);
      } finally {
        this.loading = false;
        mainEl.classList.remove('clarity-simplify-loading');
      }
    },

    /**
     * Replace original content with simplified version
     */
    _applySimplifiedText(container, simplifiedHtml) {
      // Parse simplified HTML (LLM returns plain text with basic structure)
      const formatted = this._formatSimplifiedText(simplifiedHtml);

      // Replace the content
      container.innerHTML = formatted;
      container.classList.add('clarity-simplify-content');

      // Add sentinel to mark simplified content
      const sentinel = document.createElement('meta');
      sentinel.id = this.sentinelId;
      sentinel.setAttribute('data-simplified', 'true');
      container.appendChild(sentinel);
    },

    /**
     * Format LLM response as basic HTML
     */
    _formatSimplifiedText(text) {
      // Escape HTML entities
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Convert markdown-like formatting to HTML
      // Headings
      html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');

      // Bold
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

      // Lists
      html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
      html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

      // Paragraphs (double newlines)
      html = html.replace(/\n\n/g, '</p><p>');

      // Single newlines become breaks within paragraphs
      html = html.replace(/\n/g, '<br>');

      // Wrap in paragraphs
      if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
      }

      // Clean up empty paragraphs
      html = html.replace(/<p><\/p>/g, '');

      // Add citation back to source
      html += '<p style="font-size:0.8em;color:#6B7280;margin-top:24px;padding-top:12px;border-top:1px solid #E5E7EB;">';
      html += '✨ Simplified by ClarityAI · </p>';

      return html;
    },

    /**
     * Show error state in the content area
     */
    _showError(container, message) {
      const friendlyMessages = {
        'Extension context not available': 'Please refresh the page and try again.',
        'No main content found': 'Could not find readable content on this page.',
        'Not enough content to simplify': 'This page doesn\'t have enough text to simplify.',
        'No response from AI': 'AI service did not respond. Check your API key in settings.'
      };

      const friendly = friendlyMessages[message] || `Could not simplify: ${message}`;

      const errorDiv = document.createElement('div');
      errorDiv.className = 'clarity-simplify-error';
      errorDiv.textContent = '⚠️ ' + friendly;
      container.prepend(errorDiv);
    },

    /**
     * Restore original HTML for all modified elements
     */
    _restoreOriginals() {
      this.originals.forEach((originalHtml, selector) => {
        const el = document.querySelector(selector);
        if (el) {
          el.innerHTML = originalHtml;
          el.classList.remove('clarity-simplify-content');
        }
      });
      this.originals.clear();

      // Remove any error elements
      document.querySelectorAll('.clarity-simplify-error').forEach(el => el.remove());
    }
  };

})();
