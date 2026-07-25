// ClarityAI Content Script
// Runs on every webpage and applies reading enhancement modes.

// Track hidden elements for restoration
let hiddenElements: HTMLElement[] = [];
let dyslexiaStyleEl: HTMLStyleElement | null = null;
let fontLinkEl: HTMLLinkElement | null = null;
let checklistPanel: HTMLElement | null = null;
let simplifyOverlay: HTMLElement | null = null;

// ============================================================
// FOCUS MODE
// ============================================================

const NOISE_SELECTORS = [
  // Advertisements
  '[class*="ad-wrap"]', '[class*="advert"]', '[class*="advertisement"]',
  '[id*="google_ads"]', '[class*="ads-"]', 'ins.adsbygoogle',
  '[class*="ad-slot"]', '[class*="sponsored"]', '[class*="promo-banner"]',
  // Cookie / consent banners
  '[class*="cookie-banner"]', '[class*="cookie-consent"]', '[id*="cookie-banner"]',
  '[class*="gdpr"]', '[class*="consent-popup"]',
  // Popups / modals
  '[class*="newsletter-popup"]', '[class*="subscribe-popup"]',
  '[class*="paywall"]', '[class*="modal-overlay"]', '[class*="interstitial"]',
  // Notifications
  '[class*="notification-bar"]', '[class*="alert-bar"]', '[class*="promo-bar"]',
  // Sidebars
  'aside', '[class*="sidebar"]', '[role="complementary"]',
  '[class*="related-posts"]', '[class*="recommended"]', '[class*="trending"]',
  // Social
  '[class*="social-share"]', '[class*="share-buttons"]',
  // Comments
  '[class*="comments-section"]', '#comments', '.comments', '[class*="disqus"]',
  // Footer
  'footer', '[role="contentinfo"]',
  // Tags
  '[class*="tag-cloud"]', '[class*="category-list"]',
];

function findMainContent(): HTMLElement {
  const candidates = [
    'article', 'main', '[role="main"]', '#content', '.content',
    '.article', '.article-body', '.post-body', '.entry-content',
    '.story-body', '.prose',
  ];
  for (const sel of candidates) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) return el;
  }
  return document.body;
}

function applyFocusMode() {
  hiddenElements = [];
  const mainContent = findMainContent();

  NOISE_SELECTORS.forEach((selector) => {
    try {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (mainContent.contains(el)) return;
        if (el.offsetParent === null) return;
        el.dataset.clarityPrevDisplay = el.style.display;
        el.style.setProperty('display', 'none', 'important');
        hiddenElements.push(el);
      });
    } catch { /* ignore invalid selectors */ }
  });

  // Hide large fixed/sticky overlays
  document.querySelectorAll<HTMLElement>('*').forEach((el) => {
    const style = window.getComputedStyle(el);
    if (
      (style.position === 'fixed' || style.position === 'sticky') &&
      style.display !== 'none' &&
      !mainContent.contains(el) &&
      el !== document.body &&
      el !== document.documentElement
    ) {
      const rect = el.getBoundingClientRect();
      if (rect.width > window.innerWidth * 0.6 || rect.height > 80) {
        el.dataset.clarityPrevDisplay = el.style.display;
        el.style.setProperty('display', 'none', 'important');
        hiddenElements.push(el);
      }
    }
  });

  // Clean up the main content area
  mainContent.dataset.clarityFocusStyled = '1';
  mainContent.style.maxWidth = '720px';
  mainContent.style.margin = '0 auto';
  mainContent.style.padding = '24px';
}

function removeFocusMode() {
  hiddenElements.forEach((el) => {
    el.style.display = el.dataset.clarityPrevDisplay ?? '';
    delete el.dataset.clarityPrevDisplay;
  });
  hiddenElements = [];

  const mainContent = findMainContent();
  if (mainContent.dataset.clarityFocusStyled) {
    mainContent.style.maxWidth = '';
    mainContent.style.margin = '';
    mainContent.style.padding = '';
    delete mainContent.dataset.clarityFocusStyled;
  }
}

// ============================================================
// DYSLEXIA MODE
// ============================================================

function applyDyslexiaMode() {
  fontLinkEl = document.createElement('link');
  fontLinkEl.rel = 'stylesheet';
  fontLinkEl.href = 'https://fonts.cdnfonts.com/css/opendyslexic';
  fontLinkEl.id = 'clarity-dyslexia-font';
  document.head.appendChild(fontLinkEl);

  dyslexiaStyleEl = document.createElement('style');
  dyslexiaStyleEl.id = 'clarity-dyslexia-styles';
  dyslexiaStyleEl.textContent = `
    body.clarity-dyslexia,
    body.clarity-dyslexia p,
    body.clarity-dyslexia li,
    body.clarity-dyslexia span,
    body.clarity-dyslexia div,
    body.clarity-dyslexia h1,
    body.clarity-dyslexia h2,
    body.clarity-dyslexia h3,
    body.clarity-dyslexia h4 {
      font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif !important;
      letter-spacing: 0.06em !important;
      word-spacing: 0.22em !important;
      line-height: 1.9 !important;
    }
    body.clarity-dyslexia { background-color: #FFFBF0 !important; }
    body.clarity-dyslexia p, body.clarity-dyslexia li {
      font-size: 1.06em !important;
      max-width: 65ch !important;
    }
    body.clarity-dyslexia p:nth-child(even) {
      background-color: rgba(255,240,200,0.35) !important;
      border-radius: 4px !important;
      padding: 4px 6px !important;
    }
  `;
  document.head.appendChild(dyslexiaStyleEl);
  document.body.classList.add('clarity-dyslexia');
}

function removeDyslexiaMode() {
  document.body.classList.remove('clarity-dyslexia');
  dyslexiaStyleEl?.remove();
  dyslexiaStyleEl = null;
  fontLinkEl?.remove();
  fontLinkEl = null;
}

// ============================================================
// READING CHECKLIST
// ============================================================

function applyChecklistMode() {
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>('h1, h2, h3, h4')
  ).filter((h) => {
    const text = h.textContent?.trim() ?? '';
    return text.length > 3 && text.length < 200;
  });

  if (headings.length === 0) {
    showToast('No headings found on this page.');
    return;
  }

  checklistPanel = document.createElement('div');
  checklistPanel.id = 'clarity-checklist-panel';
  checklistPanel.style.cssText = `
    position: fixed; top: 80px; right: 20px; width: 280px;
    max-height: 70vh; background: #ffffff; border-radius: 16px;
    box-shadow: 0 8px 32px rgba(79,70,229,0.15), 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid rgba(79,70,229,0.12); z-index: 2147483646;
    display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  `;

  let completedCount = 0;

  const itemsHtml = headings.map((h, i) => {
    const indent = h.tagName === 'H1' ? 0 : h.tagName === 'H2' ? 4 : h.tagName === 'H3' ? 8 : 12;
    const size = h.tagName === 'H1' ? '13px' : h.tagName === 'H2' ? '12px' : '11px';
    const weight = (h.tagName === 'H1' || h.tagName === 'H2') ? '600' : '500';
    return `
      <div data-clarity-item="${i}" style="
        display:flex; align-items:flex-start; gap:10px; padding:9px 10px;
        border-radius:10px; cursor:pointer; margin-bottom:2px;
        transition: background 0.15s;
      " class="clarity-checklist-item">
        <input type="checkbox" data-index="${i}" style="
          margin-top:2px; width:15px; height:15px; flex-shrink:0;
          accent-color:#4F46E5; cursor:pointer;
        " />
        <span data-label="${i}" style="
          font-size:${size}; font-weight:${weight}; color:#1e1b4b;
          line-height:1.4; padding-left:${indent}px;
        ">${h.textContent?.trim() ?? ''}</span>
      </div>
    `;
  }).join('');

  checklistPanel.innerHTML = `
    <div style="
      background:linear-gradient(135deg,#4F46E5,#7C3AED);
      padding:14px 16px; flex-shrink:0;
    ">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
          <p style="color:white; font-weight:700; font-size:13px; margin:0; line-height:1;">ClarityAI</p>
          <p style="color:rgba(255,255,255,0.75); font-size:11px; margin:3px 0 0; line-height:1;">Reading Checklist</p>
        </div>
        <button id="clarity-checklist-close" style="
          background:rgba(255,255,255,0.2); border:none; color:white;
          width:24px; height:24px; border-radius:8px; cursor:pointer;
          font-size:14px; line-height:1;
        ">×</button>
      </div>
      <div style="
        margin-top:10px; background:rgba(255,255,255,0.2);
        border-radius:4px; height:4px; overflow:hidden;
      ">
        <div id="clarity-progress-bar" style="
          height:100%; background:white; border-radius:4px;
          width:0%; transition:width 0.3s ease;
        "></div>
      </div>
      <p id="clarity-progress-text" style="
        color:rgba(255,255,255,0.75); font-size:10px; margin:6px 0 0; line-height:1;
      ">0 / ${headings.length} completed</p>
    </div>
    <div style="overflow-y:auto; flex:1; padding:8px;">
      ${itemsHtml}
    </div>
    <div style="padding:10px 12px; border-top:1px solid #f0f0f0; flex-shrink:0;">
      <button id="clarity-scroll-top" style="
        width:100%; padding:8px; background:linear-gradient(135deg,#4F46E5,#7C3AED);
        color:white; border:none; border-radius:10px; font-size:12px;
        font-weight:600; cursor:pointer;
      ">↑ Back to top</button>
    </div>
  `;

  document.body.appendChild(checklistPanel);

  // Hover effects on items
  checklistPanel.querySelectorAll<HTMLElement>('.clarity-checklist-item').forEach((item) => {
    item.addEventListener('mouseover', () => { item.style.background = '#F5F3FF'; });
    item.addEventListener('mouseout', () => { item.style.background = 'transparent'; });
  });

  // Checkbox change events
  headings.forEach((h, i) => {
    const checkbox = checklistPanel!.querySelector<HTMLInputElement>(`input[data-index="${i}"]`);
    const labelEl = checklistPanel!.querySelector<HTMLElement>(`span[data-label="${i}"]`);
    const itemEl = checklistPanel!.querySelector<HTMLElement>(`div[data-clarity-item="${i}"]`);

    checkbox?.addEventListener('change', () => {
      if (checkbox.checked) {
        completedCount++;
        if (labelEl) { labelEl.style.textDecoration = 'line-through'; labelEl.style.color = '#9ca3af'; }
      } else {
        completedCount--;
        if (labelEl) { labelEl.style.textDecoration = 'none'; labelEl.style.color = '#1e1b4b'; }
      }
      const pct = (completedCount / headings.length) * 100;
      const bar = document.getElementById('clarity-progress-bar');
      const txt = document.getElementById('clarity-progress-text');
      if (bar) bar.style.width = `${pct}%`;
      if (txt) txt.textContent = `${completedCount} / ${headings.length} completed`;
    });

    // Click item row to scroll to heading (but not when clicking the checkbox)
    itemEl?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const prevBg = h.style.backgroundColor;
      const prevRadius = h.style.borderRadius;
      h.style.backgroundColor = 'rgba(79,70,229,0.08)';
      h.style.borderRadius = '4px';
      setTimeout(() => {
        h.style.backgroundColor = prevBg;
        h.style.borderRadius = prevRadius;
      }, 1500);
    });
  });

  // Close button
  document.getElementById('clarity-checklist-close')?.addEventListener('click', () => {
    removeChecklistMode();
  });

  // Scroll to top
  document.getElementById('clarity-scroll-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function removeChecklistMode() {
  checklistPanel?.remove();
  checklistPanel = null;
}

// ============================================================
// SIMPLIFY MODE
// ============================================================

function getArticleText(): string {
  const mainEl = findMainContent();
  const paragraphs = Array.from(mainEl.querySelectorAll('p'))
    .map((p) => p.textContent?.trim())
    .filter((t): t is string => !!t && t.length > 30)
    .join('\n\n');
  return paragraphs.slice(0, 4000);
}

function applySimplifyMode() {
  const text = getArticleText();
  if (!text) {
    showToast('No readable content found on this page.');
    return;
  }

  simplifyOverlay = document.createElement('div');
  simplifyOverlay.id = 'clarity-simplify-overlay';
  simplifyOverlay.style.cssText = `
    position:fixed; top:0; left:0; right:0; bottom:0;
    background:rgba(255,255,255,0.95); backdrop-filter:blur(8px);
    z-index:2147483645; display:flex; align-items:center; justify-content:center;
    font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  `;

  simplifyOverlay.innerHTML = `
    <div style="
      max-width:680px; width:90%; background:white; border-radius:20px;
      box-shadow:0 20px 60px rgba(79,70,229,0.12),0 4px 16px rgba(0,0,0,0.06);
      border:1px solid rgba(79,70,229,0.1); overflow:hidden;
      max-height:85vh; display:flex; flex-direction:column;
    ">
      <div style="
        background:linear-gradient(135deg,#4F46E5,#7C3AED); padding:16px 20px;
        display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
      ">
        <div>
          <p style="color:white;font-weight:700;font-size:15px;margin:0;">Simplified Version</p>
          <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:3px 0 0;">Powered by ClarityAI</p>
        </div>
        <button id="clarity-simplify-close" style="
          background:rgba(255,255,255,0.2); border:none; color:white;
          padding:6px 12px; border-radius:10px; cursor:pointer;
          font-size:13px; font-weight:500;
        ">✕ Close</button>
      </div>
      <div id="clarity-simplify-content" style="
        padding:24px; overflow-y:auto; flex:1;
        line-height:1.85; font-size:16px; color:#1a1a2e;
      ">
        <div style="
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:40px; gap:16px;
        ">
          <div style="
            width:36px; height:36px; border:3px solid #e0e7ff;
            border-top-color:#4F46E5; border-radius:50%;
            animation:clarity-spin 0.8s linear infinite;
          "></div>
          <p style="color:#6366f1;font-size:14px;font-weight:500;margin:0;">
            AI is simplifying this content…
          </p>
        </div>
        <style>
          @keyframes clarity-spin { to { transform: rotate(360deg); } }
        </style>
      </div>
    </div>
  `;

  document.body.appendChild(simplifyOverlay);

  document.getElementById('clarity-simplify-close')?.addEventListener('click', () => {
    removeSimplifyMode();
  });

  chrome.runtime.sendMessage({ type: 'SIMPLIFY_TEXT', text }, (response: { simplified?: string; error?: string }) => {
    const contentEl = document.getElementById('clarity-simplify-content');
    if (!contentEl) return;

    if (response?.error) {
      contentEl.innerHTML = `
        <div style="text-align:center;padding:40px;">
          <p style="color:#ef4444;font-weight:600;font-size:15px;">Something went wrong</p>
          <p style="color:#6b7280;font-size:13px;margin-top:8px;">${response.error}</p>
        </div>
      `;
      return;
    }

    if (response?.simplified) {
      const html = response.simplified
        .split('\n')
        .filter((p: string) => p.trim().length > 0)
        .map((p: string) => `<p style="margin-bottom:16px;">${p}</p>`)
        .join('');

      contentEl.innerHTML = `
        <div style="
          background:linear-gradient(135deg,rgba(79,70,229,0.04),rgba(124,58,237,0.04));
          border:1px solid rgba(79,70,229,0.1); border-radius:12px;
          padding:6px 16px; margin-bottom:20px; display:inline-block;
        ">
          <p style="color:#6366f1;font-size:12px;font-weight:600;margin:0;letter-spacing:0.03em;">
            SIMPLIFIED BY CLARITYAI
          </p>
        </div>
        ${html}
      `;
    }
  });
}

function removeSimplifyMode() {
  simplifyOverlay?.remove();
  simplifyOverlay = null;
}

// ============================================================
// TOAST HELPER
// ============================================================

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:#1e1b4b; color:white; padding:10px 20px; border-radius:100px;
    font-family:'Inter',-apple-system,sans-serif; font-size:13px; font-weight:500;
    z-index:2147483647; box-shadow:0 4px 20px rgba(79,70,229,0.3);
    opacity:0; transition:opacity 0.2s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

// ============================================================
// MESSAGE LISTENER
// ============================================================

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'RESET_ALL') {
    removeFocusMode();
    removeDyslexiaMode();
    removeChecklistMode();
    removeSimplifyMode();
    sendResponse({ ok: true });
    return;
  }

  if (message.type === 'TOGGLE_MODE') {
    const { mode, active } = message as { mode: string; active: boolean };
    switch (mode) {
      case 'focusMode':    active ? applyFocusMode()    : removeFocusMode();    break;
      case 'dyslexiaMode': active ? applyDyslexiaMode() : removeDyslexiaMode(); break;
      case 'checklistMode':active ? applyChecklistMode(): removeChecklistMode();break;
      case 'simplifyMode': active ? applySimplifyMode() : removeSimplifyMode(); break;
    }
    sendResponse({ ok: true });
  }
});

export {};
