/**
 * @fileoverview DOM Utilities — reusable helpers for content script modes.
 * Provides smart heuristics for finding main content, detecting clutter,
 * and extracting text from web pages.
 *
 * All utilities are exported via window.ClarityDOM for cross-file access
 * within the content script context.
 */

(function () {
  'use strict';

  /**
   * Simple hash function for text caching.
   * @param {string} text - Input text to hash
   * @returns {string} Short hash string prefixed with 'h'
   */
  function hashText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36);
  }

  window.ClarityDOM = {

    // ── Main Content Detection ──────────────────────────────

    /**
     * Identify the primary content area of a webpage using heuristic selectors.
     * Falls back through a prioritized list of common content containers,
     * then to the largest text block, then to document.body.
     *
     * @returns {Element} The best candidate element for main content
     */
    findMainContent() {
      /** @type {string[]} Priority-ordered CSS selectors for content containers */
      const candidates = [
        'article',
        '[role="main"]',
        'main',
        '.post-content',
        '.article-content',
        '.entry-content',
        '#content',
        '.content',
        '.post',
        '.article',
        '.clarity-focus-content',
      ];

      for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim().length > 500) return el;
      }

      return this._findLargestTextBlock() || document.body;
    },

    /**
     * Scan the DOM for the element containing the largest block of visible text.
     * Filters out elements that are too small or visually hidden.
     *
     * @private
     * @returns {Element|null} The element with the most text content, or null
     */
    _findLargestTextBlock() {
      let best = null;
      let maxLen = 0;
      const candidates = document.querySelectorAll('div, section, main, article');

      candidates.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 200 || rect.height < 100) return;
        const text = el.textContent.trim();
        if (text.length > maxLen && text.length > 300) {
          maxLen = text.length;
          best = el;
        }
      });

      return best;
    },

    // ── Clutter Detection ──────────────────────────────────

    /**
     * Get an array of CSS selectors targeting non-content page elements.
     * Covers: ads, sidebars, headers, footers, cookie banners, popups,
     * sticky elements, social sharing, comment sections, widgets, and more.
     *
     * @returns {string[]} Array of CSS selector strings
     */
    getClutterSelectors() {
      return [
        // Ads
        '[class*="ad-"]', '[class*="ad_"]', '[id*="ad-"]', '[id*="ad_"]',
        '[class*="advertisement"]', '[id*="advertisement"]',
        'ins.adsbygoogle', '[data-ad]',
        // Sidebars
        'aside', '[role="complementary"]',
        // Headers & Footers (outside main content)
        'header:not(article header):not(main header)',
        'footer:not(article footer):not(main footer)',
        '[class*="header"]:not(article *):not(main *)',
        '[class*="footer"]:not(article *):not(main *)',
        '[id*="header"]:not(article *):not(main *)', '[id*="footer"]:not(article *):not(main *)',
        // Cookie & notification banners
        '[class*="cookie"]', '[id*="cookie"]',
        '[class*="consent"]', '[class*="notice"]',
        '[class*="banner"]', '[class*="popup"]', '[class*="modal"]',
        // Sticky/Fixed elements
        '[style*="position: fixed"]', '[style*="position:fixed"]',
        '[style*="position: sticky"]', '[style*="position:sticky"]',
        '.sticky', '.fixed',
        // Social sharing
        '[class*="share"]', '[class*="social"]',
        // Widgets and sidebars
        '[class*="sidebar"]', '[id*="sidebar"]',
        '[class*="widget"]', '[class*="widget-area"]',
        '[class*="comment"]',
        // Newsletter signups
        '[class*="newsletter"]', '[class*="subscribe"]',
        // Related posts
        '[class*="related"]',
      ];
    },

    // ── Content Extraction ─────────────────────────────────

    /**
     * Extract all visible paragraphs from the main content area.
     * Returns structured data with element reference, text, and tag type.
     *
     * @returns {Array<{el: Element, text: string, tag: string}>}
     */
    getContentParagraphs() {
      const main = this.findMainContent();
      if (!main) return [];

      const paragraphs = [];
      /** @type {string[]} Tags considered as content text */
      const contentTags = ['p', 'li', 'blockquote', 'h2', 'h3', 'h4', 'h5', 'h6'];

      contentTags.forEach(tag => {
        main.querySelectorAll(tag).forEach(el => {
          const text = el.textContent.trim();
          if (text.length > 20 && this._isVisible(el)) {
            paragraphs.push({ el, text, tag });
          }
        });
      });

      return paragraphs;
    },

    /**
     * Check if a DOM element is visually visible on the page.
     * Checks bounding box dimensions, display, visibility, and opacity.
     *
     * @private
     * @param {Element} el - The element to check
     * @returns {boolean} True if the element is visible
     */
    _isVisible(el) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
      );
    },

    /**
     * Get concatenated text from main content, suitable for LLM processing.
     * Truncates at maxChars to respect token limits.
     * Adds paragraph breaks between blocks.
     *
     * @param {number} [maxChars=4000] - Maximum characters to extract
     * @returns {string} Truncated text content from the main area
     */
    getMainContentText(maxChars = 4000) {
      const main = this.findMainContent();
      if (!main) return document.body.innerText.slice(0, maxChars);

      const paragraphs = this.getContentParagraphs();
      let result = '';
      let charCount = 0;

      for (const p of paragraphs) {
        if (charCount >= maxChars) break;
        const prefix = (p.tag === 'h2' || p.tag === 'h3') ? '\n\n' : '\n';
        const line = prefix + p.text;
        if (charCount + line.length <= maxChars) {
          result += line;
          charCount += line.length;
        } else {
          result += prefix + p.text.slice(0, maxChars - charCount);
          break;
        }
      }

      return result.trim() || document.body.innerText.slice(0, maxChars);
    },

    /**
     * Check if an element is inside the main content area.
     * Useful for determining whether to hide or keep an element.
     *
     * @param {Element} el - The element to check
     * @returns {boolean} True if element is within the main content
     */
    isInMainContent(el) {
      const main = this.findMainContent();
      return main ? main.contains(el) : true;
    },

    /**
     * Generate a stable cache key from text content.
     * Uses the first 50 chars of the hashed text for quick lookups.
     *
     * @param {string} text - Text to generate key for
     * @returns {string} Cache key
     */
    getCacheKey(text) {
      return hashText(text.slice(0, 200));
    },
  };

})();
