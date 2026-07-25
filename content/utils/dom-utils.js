/**
 * DOM Utilities — reusable helpers for content script modes
 */
(function () {
  'use strict';

  window.ClarityDOM = {
    /**
     * Find the main content area of a page using heuristics
     * Returns the best element or falls back to document.body
     */
    findMainContent() {
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
        'main > article',
      ];

      for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim().length > 500) return el;
      }

      // Fallback: find the element with the most text content
      return this.findLargestTextBlock() || document.body;
    },

    /**
     * Find the element with the largest text block
     */
    findLargestTextBlock() {
      let best = null;
      let maxLen = 0;
      const candidates = document.querySelectorAll('div, section, main, article');

      candidates.forEach(el => {
        // Skip small or hidden elements
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

    /**
     * Collect clutter selectors — elements commonly used for non-content UI
     */
    getClutterSelectors() {
      return [
        // Ads
        '[class*="ad-"]', '[class*="ad_"]', '[id*="ad-"]', '[id*="ad_"]',
        '[class*="advertisement"]', '[id*="advertisement"]',
        'ins.adsbygoogle', '[data-ad]',
        // Sidebars
        'aside', '[role="complementary"]',
        // Headers & Footers
        'header', 'footer',
        '[class*="header"]:not(article *)', '[class*="footer"]:not(article *)',
        '[id*="header"]:not(article *)', '[id*="footer"]:not(article *)',
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
        // Comments (unless it's the main content)
        '[class*="comment"]',
        // Sidebars, widgets
        '[class*="sidebar"]', '[id*="sidebar"]',
        '[class*="widget"]', '[class*="widget-area"]',
        // Newsletter signups
        '[class*="newsletter"]', '[class*="subscribe"]',
        // Related posts (often distracting)
        '[class*="related"]',
      ];
    },

    /**
     * Get visible paragraphs from the main content area
     */
    getContentParagraphs() {
      const main = this.findMainContent();
      if (!main) return [];

      const paragraphs = [];
      main.querySelectorAll('p, li, blockquote, h2, h3, h4, h5, h6').forEach(el => {
        const text = el.textContent.trim();
        if (text.length > 20 && this.isVisible(el)) {
          paragraphs.push({ el, text, tag: el.tagName.toLowerCase() });
        }
      });

      return paragraphs;
    },

    /**
     * Check if an element is visually visible
     */
    isVisible(el) {
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
     * Simple hash for text caching
     */
    hashText(text) {
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return 'h' + Math.abs(hash).toString(36);
    },

    /**
     * Check if element is inside the main content area
     */
    isInMainContent(el) {
      const main = this.findMainContent();
      return main ? main.contains(el) : true;
    },

    /**
     * Get all text from main content (for LLM simplification)
     * Truncated to 4000 chars to avoid token limits
     */
    getMainContentText(maxChars = 4000) {
      const main = this.findMainContent();
      if (!main) return document.body.innerText.slice(0, maxChars);

      const paragraphs = this.getContentParagraphs();
      let text = '';
      let charCount = 0;

      for (const p of paragraphs) {
        if (charCount >= maxChars) break;
        const prefix = p.tag === 'h2' || p.tag === 'h3' ? '\n\n' : '\n';
        const line = prefix + p.text;
        if (charCount + line.length <= maxChars) {
          text += line;
          charCount += line.length;
        } else {
          text += prefix + p.text.slice(0, maxChars - charCount);
          break;
        }
      }

      return text.trim() || document.body.innerText.slice(0, maxChars);
    }
  };

})();
